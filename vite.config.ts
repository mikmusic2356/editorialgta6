import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

// Local Node Middleware for Cloudflare R2 Uploads, Streaming & Deletion (Zero CORS / Instant Visibility)
function cloudflareR2Plugin(): Plugin {
  const accountId = process.env.VITE_R2_ACCOUNT_ID || '';
  const accessKeyId = process.env.VITE_R2_ACCESS_KEY_ID || '';
  const secretAccessKey = process.env.VITE_R2_SECRET_ACCESS_KEY || '';
  const bucketName = process.env.VITE_R2_BUCKET_NAME || 'bubketgta6';
  const endpoint = process.env.VITE_R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : '');
  const publicUrlBase = process.env.VITE_R2_PUBLIC_URL || '';

  const s3 = new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return {
    name: 'cloudflare-r2-service',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // 1. Upload Handler
        if (req.url === '/api/upload-r2' && req.method === 'POST') {
          try {
            const chunks: Buffer[] = [];
            req.on('data', (chunk) => chunks.push(chunk));
            req.on('end', async () => {
              try {
                const buffer = Buffer.concat(chunks);
                const originalFilename = decodeURIComponent((req.headers['x-filename'] as string) || 'image.webp');
                const contentType = (req.headers['content-type'] as string) || 'image/webp';
                const folder = (req.headers['x-folder'] as string) || 'articulos';

                const cleanBaseName = originalFilename
                  .replace(/\.[^/.]+$/, '')
                  .toLowerCase()
                  .replace(/[^a-z0-9_-]/g, '-');
                const ext = originalFilename.split('.').pop() || 'webp';
                const fileKey = `${folder}/${cleanBaseName}-${Date.now()}.${ext}`;

                const command = new PutObjectCommand({
                  Bucket: bucketName,
                  Key: fileKey,
                  Body: buffer,
                  ContentType: contentType,
                  CacheControl: 'public, max-age=31536000, immutable',
                });

                await s3.send(command);

                // If public domain (r2.dev or custom) is configured, use it, else stream via proxy
                let publicUrl = '';
                if (publicUrlBase && (publicUrlBase.includes('.r2.dev') || publicUrlBase.includes('http')) && !publicUrlBase.includes('r2.cloudflarestorage.com')) {
                  publicUrl = `${publicUrlBase.replace(/\/$/, '')}/${fileKey}`;
                } else {
                  publicUrl = `/api/r2-file?key=${encodeURIComponent(fileKey)}`;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  success: true,
                  url: publicUrl,
                  key: fileKey,
                  name: `${cleanBaseName}.${ext}`,
                  sizeKb: Math.round(buffer.length / 1024) || 1,
                  mimeType: contentType,
                }));
              } catch (err: any) {
                console.error('[Cloudflare R2 Backend Upload Error]', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  success: false,
                  error: err?.message || 'Error al subir a Cloudflare R2',
                }));
              }
            });
          } catch (e: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: e?.message }));
          }
          return;
        }

        // 2. Stream Image from Cloudflare R2 with Full Cache and Correct Headers
        if (req.url?.startsWith('/api/r2-file') && req.method === 'GET') {
          try {
            const urlObj = new URL(req.url, 'http://localhost:3000');
            const key = urlObj.searchParams.get('key');
            if (!key) {
              res.writeHead(400, { 'Content-Type': 'text/plain' });
              res.end('Missing key parameter');
              return;
            }

            const command = new GetObjectCommand({
              Bucket: bucketName,
              Key: key,
            });

            const data = await s3.send(command);
            const stream = data.Body as Readable;

            res.writeHead(200, {
              'Content-Type': data.ContentType || 'image/webp',
              'Cache-Control': 'public, max-age=31536000, immutable',
              'ETag': data.ETag || '',
            });

            stream.pipe(res);
            return;
          } catch (err: any) {
            console.error('[Cloudflare R2 Stream Error]', err);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Image not found in Cloudflare R2');
            return;
          }
        }

        // 3. Delete Image from Cloudflare R2
        if (req.url?.startsWith('/api/delete-r2') && (req.method === 'POST' || req.method === 'DELETE')) {
          try {
            const urlObj = new URL(req.url, 'http://localhost:3000');
            const key = urlObj.searchParams.get('key');
            if (key) {
              const command = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: key,
              });
              await s3.send(command);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
            return;
          } catch (err: any) {
            console.error('[Cloudflare R2 Delete Error]', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err?.message }));
            return;
          }
        }

        // 4. Serve Dynamic Real-time /sitemap.xml for Google Search Console
        if (req.url === '/sitemap.xml' || req.url === '/sitemap') {
          try {
            const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
            if (fs.existsSync(sitemapPath)) {
              const xml = fs.readFileSync(sitemapPath, 'utf8');
              res.writeHead(200, {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
              });
              res.end(xml);
              return;
            }
          } catch (e) {
            console.error('[Sitemap Server Error]', e);
          }
        }

        // 5. Serve /robots.txt
        if (req.url === '/robots.txt') {
          try {
            const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
            if (fs.existsSync(robotsPath)) {
              const txt = fs.readFileSync(robotsPath, 'utf8');
              res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'public, max-age=86400',
              });
              res.end(txt);
              return;
            }
          } catch (e) {
            console.error('[Robots Server Error]', e);
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), cloudflareR2Plugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

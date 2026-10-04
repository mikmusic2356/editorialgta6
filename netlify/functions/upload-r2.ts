import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function handler(event: any) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' }) 
    };
  }

  try {
    const accountId = process.env.VITE_R2_ACCOUNT_ID || process.env.R2_ACCOUNT_ID || '4628a8ac5700bdd4518fb941c0d74bb1';
    const accessKeyId = process.env.VITE_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || 'b363d7a059011e862c03f9d636b221d1';
    const secretAccessKey = process.env.VITE_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || '0ba492eab5a57de7a07e0647553303901620d12c5010fc6119f158dee2bc4105';
    const bucketName = process.env.VITE_R2_BUCKET_NAME || process.env.R2_BUCKET_NAME || 'bubketgta6';
    const endpoint = process.env.VITE_R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : '');
    const publicUrlBase = process.env.VITE_R2_PUBLIC_URL || '';

    const s3 = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });

    let filename = 'imagen.webp';
    let contentType = 'image/webp';
    let folder = 'articulos';
    let bodyBuffer: Buffer;

    // Support JSON payload with Base64 or direct binary body
    if (event.headers['content-type']?.includes('application/json')) {
      try {
        const parsed = JSON.parse(event.body || '{}');
        filename = parsed.filename || filename;
        contentType = parsed.contentType || contentType;
        folder = parsed.folder || folder;
        if (parsed.base64) {
          const rawBase64 = parsed.base64.replace(/^data:image\/[a-z0-9]+;base64,/, '');
          bodyBuffer = Buffer.from(rawBase64, 'base64');
        } else {
          throw new Error('No base64 data provided');
        }
      } catch (e: any) {
        throw new Error('Error al parsear el cuerpo JSON: ' + e.message);
      }
    } else {
      const filenameHeader = event.headers['x-filename'] || event.headers['X-Filename'] || filename;
      filename = decodeURIComponent(filenameHeader);
      contentType = event.headers['content-type'] || event.headers['Content-Type'] || contentType;
      folder = event.headers['x-folder'] || event.headers['X-Folder'] || folder;

      bodyBuffer = event.isBase64Encoded 
        ? Buffer.from(event.body || '', 'base64')
        : Buffer.from(event.body || '');
    }

    const cleanBaseName = filename
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    const ext = filename.split('.').pop() || 'webp';
    const fileKey = `${folder}/${cleanBaseName}-${Date.now()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: bodyBuffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable'
    });

    await s3.send(command);

    let publicUrl = '';
    if (publicUrlBase && (publicUrlBase.includes('.r2.dev') || publicUrlBase.includes('http')) && !publicUrlBase.includes('r2.cloudflarestorage.com')) {
      publicUrl = `${publicUrlBase.replace(/\/$/, '')}/${fileKey}`;
    } else {
      publicUrl = `/api/r2-file?key=${encodeURIComponent(fileKey)}`;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        url: publicUrl,
        key: fileKey,
        name: filename,
        sizeKb: Math.round(bodyBuffer.length / 1024)
      })
    };
  } catch (error: any) {
    console.error('Error in upload-r2 function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message || 'Error al subir a Cloudflare R2' })
    };
  }
}


import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
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

    const filenameHeader = event.headers['x-filename'] || event.headers['X-Filename'] || 'image.webp';
    const originalFilename = decodeURIComponent(filenameHeader);
    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || 'image/webp';
    const folder = event.headers['x-folder'] || event.headers['X-Folder'] || 'articulos';

    const cleanBaseName = originalFilename
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    const ext = originalFilename.split('.').pop() || 'webp';
    const fileKey = `${folder}/${cleanBaseName}-${Date.now()}.${ext}`;

    const bodyBuffer = event.isBase64Encoded 
      ? Buffer.from(event.body || '', 'base64')
      : Buffer.from(event.body || '');

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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        url: publicUrl,
        key: fileKey,
        name: originalFilename,
        sizeKb: Math.round(bodyBuffer.length / 1024)
      })
    };
  } catch (error: any) {
    console.error('Error in upload-r2 function:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: error.message || 'Error al subir a Cloudflare R2' })
    };
  }
}

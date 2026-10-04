import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export async function handler(event: any) {
  const fileKey = event.queryStringParameters?.key;
  if (!fileKey) {
    return { statusCode: 400, body: 'Missing key parameter' };
  }

  try {
    const accountId = process.env.VITE_R2_ACCOUNT_ID || process.env.R2_ACCOUNT_ID || '4628a8ac5700bdd4518fb941c0d74bb1';
    const accessKeyId = process.env.VITE_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || 'b363d7a059011e862c03f9d636b221d1';
    const secretAccessKey = process.env.VITE_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || '0ba492eab5a57de7a07e0647553303901620d12c5010fc6119f158dee2bc4105';
    const bucketName = process.env.VITE_R2_BUCKET_NAME || process.env.R2_BUCKET_NAME || 'bubketgta6';
    const endpoint = process.env.VITE_R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : '');

    const s3 = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey
    });

    const result = await s3.send(command);
    if (!result.Body) {
      return { statusCode: 404, body: 'File body empty' };
    }

    const stream = result.Body as Readable;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': result.ContentType || 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*'
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error: any) {
    console.error('Error fetching file from R2:', error);
    return { statusCode: 404, body: 'File not found on R2' };
  }
}

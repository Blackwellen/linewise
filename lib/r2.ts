import 'server-only';
import { AwsClient } from 'aws4fetch';
import { FILES, DOWNLOAD_LIMITS, type FileId } from './site';

// Private Cloudflare R2 bucket, S3-compatible API. The bucket has no public access and no
// custom domain; files are only reachable through short-lived presigned GET URLs.

export function r2Configured() {
  return Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET);
}

export async function presignDownload(file: FileId): Promise<string> {
  if (!r2Configured()) throw new Error('R2 is not configured');
  const { key, filename } = FILES[file];
  const client = new AwsClient({
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    service: 's3',
    region: 'auto',
  });
  const url = new URL(`https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET}/${key}`);
  url.searchParams.set('X-Amz-Expires', String(DOWNLOAD_LIMITS.presignSeconds));
  url.searchParams.set('response-content-disposition', `attachment; filename="${filename}"`);
  url.searchParams.set('response-content-type', 'application/pdf');
  const signed = await client.sign(new Request(url, { method: 'GET' }), { aws: { signQuery: true } });
  return signed.url;
}

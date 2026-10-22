import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadProductionCredentials() {
  const possiblePaths = [
    'E:/ManageStudio/production_r2.txt',
    path.resolve(__dirname, '..', '.env.production')
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const keyMatch = content.match(/CLOUDFLARE_R2_ACCESS_KEY_ID\s*=\s*([a-f0-9]+)/i) ||
                       content.match(/Access Key ID[\s\S]*?([a-f0-9]{32})/i);
      const secretMatch = content.match(/CLOUDFLARE_R2_SECRET_ACCESS_KEY\s*=\s*([a-f0-9]+)/i) ||
                         content.match(/Secret Access Key[\s\S]*?([a-f0-9]{64})/i);

      if (keyMatch && secretMatch) {
        return {
          source: filePath,
          accessKeyId: keyMatch[1],
          secretAccessKey: secretMatch[1],
          endpoint: 'https://04b5d69ace9008c4f6fcce6e8428e9bc.r2.cloudflarestorage.com',
          bucket: 'managestudio-production-photos'
        };
      }
    }
  }
  return null;
}

async function verify() {
  console.log('\n======================================================');
  console.log('MANAGE STUDIO — PRODUCTION R2 OBJECT STORAGE VERIFICATION');
  console.log('======================================================');

  const creds = loadProductionCredentials();
  if (!creds) {
    console.error('❌ Production R2 credentials NOT found.');
    console.log('Please place your production R2 credentials in either:');
    console.log('  1. E:\\ManageStudio\\production_r2.txt  OR');
    console.log('  2. E:\\Studio Master\\website oct\\.env.production');
    console.log('\nFormat expected:');
    console.log('CLOUDFLARE_R2_ACCESS_KEY_ID=<your_key_id>');
    console.log('CLOUDFLARE_R2_SECRET_ACCESS_KEY=<your_secret_key>');
    process.exit(1);
  }

  console.log(`✓ Loaded production credentials from: ${creds.source}`);
  console.log(`  Target Bucket: ${creds.bucket}`);
  console.log(`  Endpoint: ${creds.endpoint}`);

  const client = new S3Client({
    region: 'auto',
    endpoint: creds.endpoint,
    credentials: {
      accessKeyId: creds.accessKeyId,
      secretAccessKey: creds.secretAccessKey
    }
  });

  const testKey = `production_audit/probe_${Date.now()}_${Math.random().toString(36).substring(7)}.txt`;
  const testPayload = `MANAGESTUDIO_PRODUCTION_PROBE_TIMESTAMP_${new Date().toISOString()}`;

  try {
    // 1. PutObject
    await client.send(new PutObjectCommand({
      Bucket: creds.bucket,
      Key: testKey,
      Body: Buffer.from(testPayload, 'utf8'),
      ContentType: 'text/plain'
    }));
    console.log(`✓ PutObject verified: Written to ${creds.bucket}/${testKey}`);

    // 2. GetObject & byte check
    const getRes = await client.send(new GetObjectCommand({
      Bucket: creds.bucket,
      Key: testKey
    }));
    const downloaded = await getRes.Body.transformToString('utf8');
    if (downloaded === testPayload) {
      console.log('✓ GetObject verified: Content matched byte-for-byte');
    } else {
      throw new Error('Downloaded bytes do not match uploaded payload!');
    }

    // 3. Presigned GET URL
    const presignedGet = await getSignedUrl(client, new GetObjectCommand({
      Bucket: creds.bucket,
      Key: testKey
    }), { expiresIn: 900 });
    console.log('✓ Presigned SigV4 download URL generated successfully');

    // 4. DeleteObject
    await client.send(new DeleteObjectCommand({
      Bucket: creds.bucket,
      Key: testKey
    }));
    console.log(`✓ DeleteObject verified: Test object cleanly purged from ${creds.bucket}`);

    console.log('\n======================================================');
    console.log('PRODUCTION CLOUDFLARE R2 VERIFICATION: 100% OPERATIONAL');
    console.log('Staging and Desktop buckets remained completely untouched.');
    console.log('======================================================\n');
  } catch (err) {
    console.error(`❌ Verification failed on production bucket: ${err.message}`);
    process.exit(1);
  }
}

verify();

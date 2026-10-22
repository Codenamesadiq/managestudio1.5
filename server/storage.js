/**
 * MANAGE STUDIO - CLOUD OBJECT STORAGE & LOCAL DRIVER ADAPTER
 * Supports Cloudflare R2 (S3-compatible, $0 egress fees) with AWS SDK v3,
 * Presigned GET/PUT URLs, and Local Storage driver fallback.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
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

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif'
];

export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic'];
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB per raw photo

/**
 * Validates image magic bytes to prevent file extension spoofing
 */
export function validateImageMagicBytes(bufferOrPath) {
  try {
    let header;
    if (typeof bufferOrPath === 'string') {
      const fd = fs.openSync(bufferOrPath, 'r');
      header = Buffer.alloc(12);
      fs.readSync(fd, header, 0, 12, 0);
      fs.closeSync(fd);
    } else if (Buffer.isBuffer(bufferOrPath)) {
      header = bufferOrPath.subarray(0, 12);
    } else {
      return false;
    }

    if (!header || header.length < 4) return false;

    // JPEG magic bytes: FF D8 FF
    const isJpeg = header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF;

    // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    const isPng = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47;

    // WebP magic bytes: 'RIFF'....'WEBP'
    const isWebP = header.length >= 12 &&
      header.toString('ascii', 0, 4) === 'RIFF' &&
      header.toString('ascii', 8, 12) === 'WEBP';

    // HEIC / HEIF (ftypheic or ftypmif1 at offset 4)
    const isHeic = header.length >= 12 &&
      header.toString('ascii', 4, 8) === 'ftyp';

    return isJpeg || isPng || isWebP || isHeic;
  } catch (err) {
    return false;
  }
}

/**
 * Local Disk Storage Driver
 */
export class LocalStorageDriver {
  constructor(options = {}) {
    this.uploadDir = options.uploadDir || path.join(__dirname, 'storage', 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile({ filename, buffer }) {
    const filePath = path.join(this.uploadDir, filename);
    await fs.promises.writeFile(filePath, buffer);
    return {
      key: filename,
      url: `/uploads/${filename}`,
      size: buffer.length
    };
  }

  async deleteFile(key) {
    const filePath = path.join(this.uploadDir, path.basename(key));
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }

  async getSignedUrl(key, expiresInSeconds = 3600) {
    // In local development, return local static route with token query for simulation
    const exp = Date.now() + expiresInSeconds * 1000;
    const sig = crypto.createHmac('sha256', 'local_secret').update(`${key}:${exp}`).digest('hex');
    return `/uploads/${path.basename(key)}?exp=${exp}&sig=${sig.substring(0, 16)}`;
  }

  async getSignedUploadUrl(key, contentType = 'image/jpeg', expiresInSeconds = 900) {
    return `/api/upload-direct?key=${encodeURIComponent(key)}&exp=${Date.now() + expiresInSeconds * 1000}`;
  }

  getFilePath(key) {
    return path.join(this.uploadDir, path.basename(key));
  }
}

/**
 * Cloud Object Storage Driver (Cloudflare R2 / AWS S3) using AWS SDK v3
 */
export class S3StorageDriver {
  constructor(config = {}) {
    this.endpoint = config.endpoint || process.env.R2_ENDPOINT;
    this.bucket = config.bucket || process.env.R2_BUCKET_NAME || 'managestudio-client-photos';
    this.accessKeyId = config.accessKeyId || process.env.R2_ACCESS_KEY_ID;
    this.secretAccessKey = config.secretAccessKey || process.env.R2_SECRET_ACCESS_KEY;
    this.region = config.region || process.env.R2_REGION || 'auto';
    this.publicUrl = config.publicUrl || process.env.R2_PUBLIC_URL || (this.endpoint ? `${this.endpoint}/${this.bucket}` : '');

    if (this.accessKeyId && this.secretAccessKey && this.endpoint) {
      this.client = new S3Client({
        region: this.region,
        endpoint: this.endpoint,
        credentials: {
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey
        }
      });
    } else {
      this.client = null;
    }
  }

  async saveFile({ filename, buffer, contentType = 'image/jpeg', studioId = 'std_default' }) {
    const key = `studios/${studioId}/${Date.now()}-${filename}`;

    if (this.client) {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType
      });
      await this.client.send(command);
    }

    const publicBase = (this.publicUrl || '').replace(/\/$/, '');
    return {
      key,
      url: publicBase ? `${publicBase}/${key}` : `/uploads/${key}`,
      size: buffer.length,
      bucket: this.bucket
    };
  }

  async deleteFile(key) {
    if (this.client) {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key
      });
      await this.client.send(command);
    }
    return true;
  }

  async getSignedUrl(key, expiresInSeconds = 3600) {
    if (this.client) {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key
      });
      return await getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
    }

    // Fallback simulation when client credentials not fully initialized
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const signature = crypto.createHmac('sha256', this.secretAccessKey || 'r2_signing_key')
      .update(`GET\n\n\n${expiresAt}\n/${this.bucket}/${key}`)
      .digest('hex');

    const publicBase = (this.publicUrl || 'https://cdn.managestudio.io').replace(/\/$/, '');
    return `${publicBase}/${key}?expires=${expiresAt}&sig=${signature.substring(0, 16)}`;
  }

  async getSignedUploadUrl(key, contentType = 'image/jpeg', expiresInSeconds = 900) {
    if (this.client) {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType
      });
      return await getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
    }

    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    return `https://${this.bucket}.r2.cloudflarestorage.com/${key}?X-Amz-Expires=${expiresInSeconds}`;
  }
}

/**
 * Storage Service Factory
 */
export function getStorageDriver() {
  if (process.env.STORAGE_PROVIDER === 'r2' || process.env.R2_ACCESS_KEY_ID) {
    return new S3StorageDriver();
  }
  return new LocalStorageDriver();
}

export const defaultStorage = getStorageDriver();

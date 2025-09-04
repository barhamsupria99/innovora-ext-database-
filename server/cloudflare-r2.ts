import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

// Cloudflare R2 configuration
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;

// Use the correct public URL format that includes the bucket name in the path
const getPublicUrl = () => {
  const configuredUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  
  if (configuredUrl && bucketName) {
    // Use the working account ID from the existing URLs
    const workingAccountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
    const correctBaseUrl = `https://pub-${workingAccountId}.r2.dev`;
    const correctUrl = `${correctBaseUrl}/${bucketName}`;
    
    console.log(`🔧 Using working R2 public URL: ${correctUrl}`);
    return correctUrl;
  }
  
  return configuredUrl;
};

const PUBLIC_URL = getPublicUrl();

export interface UploadResult {
  url: string;
  key: string;
}

export class CloudflareR2Service {
  /**
   * Upload a file to Cloudflare R2
   */
  static async uploadFile(
    file: Buffer,
    contentType: string,
    folder: string = 'products'
  ): Promise<UploadResult> {
    try {
      const key = `${folder}/${randomUUID()}-${Date.now()}`;
      
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType,
        ACL: 'public-read',
      });

      await r2Client.send(command);
      
      const url = `${PUBLIC_URL}/${key}`;
      
      return { url, key };
    } catch (error) {
      console.error('Error uploading to R2:', error);
      throw new Error('Failed to upload file to R2');
    }
  }

  /**
   * Delete a file from Cloudflare R2
   */
  static async deleteFile(key: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      await r2Client.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting from R2:', error);
      return false;
    }
  }

  /**
   * Extract key from R2 URL
   */
  static extractKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      // Remove leading slash and extract the key
      return pathname.startsWith('/') ? pathname.slice(1) : pathname;
    } catch {
      return null;
    }
  }

  /**
   * Generate a presigned URL for direct uploads (optional)
   */
  static async generatePresignedUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
      });

      return await getSignedUrl(r2Client, command, { expiresIn });
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw new Error('Failed to generate presigned URL');
    }
  }
}

// Fallback service for when R2 is not configured
export class LocalImageService {
  static async uploadFile(
    file: Buffer,
    contentType: string,
    folder: string = 'products'
  ): Promise<UploadResult> {
    // For development, return a placeholder URL
    const key = `${folder}/${randomUUID()}-${Date.now()}`;
    const url = `https://via.placeholder.com/400x300/cccccc/666666?text=${encodeURIComponent('Uploaded Image')}`;
    
    console.log(`[LocalImageService] Would upload file with key: ${key}`);
    return { url, key };
  }

  static async deleteFile(key: string): Promise<boolean> {
    console.log(`[LocalImageService] Would delete file with key: ${key}`);
    return true;
  }

  static extractKeyFromUrl(url: string): string | null {
    return null;
  }
}

// Use R2 if configured, otherwise fall back to local service
export const ImageService = 
  process.env.CLOUDFLARE_R2_ENDPOINT && 
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID && 
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
    ? CloudflareR2Service
    : LocalImageService;

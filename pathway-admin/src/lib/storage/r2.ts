import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Cloudflare R2 Client (S3-Compatible Object Storage)
 * - 0 Egress Bandwidth Fees
 * - Ideal for Student Passports, Transcripts, SOPs, and Offer Letters
 */
export function getR2Client(): S3Client | null {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "pathway-documents";

/**
 * Upload a document directly to Cloudflare R2
 */
export async function uploadDocumentToR2({
  key,
  buffer,
  contentType,
}: {
  key: string;
  buffer: Buffer | Uint8Array;
  contentType: string;
}): Promise<{ success: boolean; key: string; url?: string; error?: string }> {
  const client = getR2Client();
  if (!client) {
    return {
      success: false,
      key,
      error: "Cloudflare R2 credentials not configured. Please set CLOUDFLARE_R2_* environment variables.",
    };
  }

  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await client.send(command);

    const publicBase = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL;
    const url = publicBase ? `${publicBase.replace(/\/$/, "")}/${key}` : undefined;

    return { success: true, key, url };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload document to R2";
    console.error("Cloudflare R2 upload error:", err);
    return { success: false, key, error: message };
  }
}

/**
 * Generate a secure, time-limited presigned download link (e.g. 1 hour)
 * Keeps passports and transcripts strictly private.
 */
export async function getSecureDocumentUrl(key: string, expiresInSeconds: number = 3600): Promise<string | null> {
  const client = getR2Client();
  if (!client) return null;

  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  } catch (err) {
    console.error("Cloudflare R2 presigned URL generation error:", err);
    return null;
  }
}

/**
 * Delete a document from Cloudflare R2
 */
export async function deleteDocumentFromR2(key: string): Promise<boolean> {
  const client = getR2Client();
  if (!client) return false;

  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await client.send(command);
    return true;
  } catch (err) {
    console.error("Cloudflare R2 delete error:", err);
    return false;
  }
}

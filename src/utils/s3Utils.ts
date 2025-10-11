import { S3Client } from "@aws-sdk/client-s3";

// 初始化 S3 Client
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const bucketName = process.env.AWS_S3_BUCKET_NAME || "";

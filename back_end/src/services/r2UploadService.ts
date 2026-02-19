import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { config } from "../config/env";

export class R2UploadService {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileKey = `${uuid()}-${file.originalname}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: config.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const publicUrl = `${config.r2PublicUrl}/${fileKey}`;

    return publicUrl;
  }

  async deleteFile(key: string) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: config.bucketName,
        Key: key,
      }),
    );
  }
}



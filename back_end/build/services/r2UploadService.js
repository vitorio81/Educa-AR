"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2UploadService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const env_1 = require("../config/env");
class R2UploadService {
    constructor() {
        this.client = new client_s3_1.S3Client({
            region: "auto",
            endpoint: `https://${env_1.config.accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: env_1.config.accessKey,
                secretAccessKey: env_1.config.secretKey,
            },
        });
    }
    uploadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileKey = `${(0, uuid_1.v4)()}-${file.originalname}`;
            yield this.client.send(new client_s3_1.PutObjectCommand({
                Bucket: env_1.config.bucketName,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            }));
            const publicUrl = `${env_1.config.r2PublicUrl}/${fileKey}`;
            return publicUrl;
        });
    }
    deleteFile(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.send(new client_s3_1.DeleteObjectCommand({
                Bucket: env_1.config.bucketName,
                Key: key,
            }));
        });
    }
}
exports.R2UploadService = R2UploadService;

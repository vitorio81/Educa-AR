"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const MAX_SIZE = 20 * 1024 * 1024; // 20MB
const allowedTypes = [
    "model/gltf-binary",
    "model/gltf+json",
    "application/octet-stream",
];
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: MAX_SIZE },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(glb|gltf|obj|fbx)$/)) {
            return cb(new Error("Formato inválido"));
        }
        cb(null, true);
    },
});

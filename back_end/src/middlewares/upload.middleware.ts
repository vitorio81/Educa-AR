import multer from "multer";

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

const allowedTypes = [
  "model/gltf-binary",
  "model/gltf+json",
  "application/octet-stream",
];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(glb|gltf|obj|fbx)$/)) {
      return cb(new Error("Formato inválido"));
    }

    cb(null, true);
  },
});

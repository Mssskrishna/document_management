import multer from "multer";
import path from "path";
import fs from "fs-extra";
import { randomUUID } from "crypto";

// Set destination and file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "..", "src/assets");
    fs.ensureDirSync(uploadPath); // ensure uploads folder exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const token = randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${token}${ext}`);
  },
});

export const multerUpload = multer({ storage });

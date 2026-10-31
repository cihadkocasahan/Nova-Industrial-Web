import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Tüm upload route'ları authentication ile korunuyor
router.use(authenticate);

// Single file upload endpoint
router.post('/image', uploadSingle, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // File URL oluştur
    const fileUrl = `/uploads/projects/${req.file.filename}`;
    
    res.json({
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

export default router;


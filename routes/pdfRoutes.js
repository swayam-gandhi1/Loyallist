const express = require('express');
const multer = require('multer');
const path = require('path');
const Pdf = require('../models/Pdf');
const router = express.Router();

// Storage config for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads/pdfs'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// @route   POST /api/pdfs/upload
// @desc    Upload a new PDF
router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfUrl = `/uploads/pdfs/${req.file.filename}`;
    const newPdf = new Pdf({ title, url: pdfUrl });
    await newPdf.save();

    res.status(201).json({ message: 'PDF uploaded successfully', pdf: newPdf });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload PDF' });
  }
});

// @route   GET /api/pdfs
// @desc    Get all uploaded PDFs
router.get('/', async (req, res) => {
  try {
    const pdfs = await Pdf.find().sort({ createdAt: -1 });
    res.json(pdfs.map(pdf => ({
      title: pdf.title,
      url: pdf.url
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch PDFs' });
  }
});

module.exports = router;

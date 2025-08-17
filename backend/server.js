import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Initialize Resend with the API key 
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only text files are allowed'), false);
    }
  }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// Routes
app.post('/api/upload', upload.single('transcript'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const transcriptContent = fs.readFileSync(req.file.path, 'utf8');
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json({ content: transcriptContent });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

app.post('/api/summarize', async (req, res) => {
  try {
    const { transcript, instruction } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    const prompt = `
        Please analyze the following meeting transcript and provide a summary based on these instructions: "${instruction || 'Provide a comprehensive summary'}"

        Meeting Transcript:
        ${transcript}

        Please provide a well-structured summary that follows the given instructions.
            `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.json({ summary });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

app.post('/api/share', async (req, res) => {
  try {
    const { summary, emails, subject } = req.body;

    if (!summary || !emails || emails.length === 0) {
      return res.status(400).json({ error: 'Summary and email addresses are required' });
    }
    
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // ⚠️ must be verified domain in production
      to: emails, // should be array of email addresses
      subject: subject || 'Meeting Summary',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Meeting Summary</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
            ${summary.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #64748b; margin-top: 20px; font-size: 14px;">
            This summary was generated using AI and may require review.
          </p>
        </div>
      `
    });

    res.json({ success: true, message: 'Summary shared successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
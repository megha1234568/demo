// index.js

const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3004;

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize Multer upload
const upload = multer({ storage: storage });

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle file upload and send email
app.post('/send-email', upload.single('attachment'), async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    const attachmentPath = req.file.path;

    // Create Nodemailer transporter
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'megha.sharma2078@gmail.com', // Your Gmail address
        pass: 'terx smmk obtf shll' // Your Gmail password (consider using environment variables)
      }
    });

    // Mail options
    let mailOptions = {
      from: 'megha.sharma2078@gmail.com',
      to: to,
      subject: subject,
      text: text,
      attachments: [{ path: attachmentPath }]
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.send('Email sent successfully!');
  } catch (error) {
    res.status(500).send('Failed to send email. Error: ' + error.message);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

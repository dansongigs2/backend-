require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handle GET /
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the homepage!</h1>');
});

// Handle form submission
app.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Create transporter using environment variables from .env file
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email address from .env
      pass: process.env.EMAIL_PASS  // Your Gmail app password from .env
    }
  });

  // Prepare email
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER, // Receiving email from .env
    subject: `New contact from ${name}`,
    text: `Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}`
  };

  // Send email
  try { 
     await transporter.sendMail(mailOptions);
    console.log('Attempting to send email...');
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info);
    res.send('<h2>Thank you for reaching out! I will get back to you soon.</h2>');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('An error occurred while sending your message. Please try again later.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

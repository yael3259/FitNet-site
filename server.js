// backend/server.js

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// מאפשר חיבור בין השרת ל-frontend
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',  // כתובת אימייל שלך (השתמש בכתובת גימייל לדוגמה)
    pass: 'your-email-password'    // הסיסמא שלך (שקול להשתמש ב-App Password אם זה גימייל)
  }
});

// endpoint לשליחת אימייל
app.post('/send-email', (req, res) => {
  const { fullname, email, message } = req.body;

  const mailOptions = {
    from: 'your-email@gmail.com',  // כתובת שולח הדוא"ל
    to: email,                     // כתובת הנמען (הכתובת שהמשתמש הזין)
    subject: 'Your message was received',  // נושא ההודעה
    text: `Hello ${fullname},\n\nYour message was received successfully. We will get back to you within 3 business days.\n\nMessage: ${message}\n\nThank you for contacting us!`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Failed to send email');
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(200).send('Email sent successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

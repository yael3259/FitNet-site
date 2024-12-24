import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// הגדרת הטרנספורטר עבור Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',  // כתובת המייל שלך
        pass: 'your-email-password'   // הסיסמא שלך או App Password
    }
});

// הגדרת המודל של המשתמש
const userSchema = new mongoose.Schema({
    userName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: String
});

const User = mongoose.model('User', userSchema);

// יצירת אינסטנס של השרת
const app = express();
app.use(express.json());  // פענוח בקשות JSON

// חיבור למונגו-דאטהבייס
mongoose.connect('mongodb://localhost:27017/my-database', { useNewUrlParser: true, useUnifiedTopology: true });

// שליחת מייל לאיפוס סיסמה
const sendResetPasswordEmail = (email, resetToken) => {
    const mailOptions = {
        from: 'your-email@gmail.com',  // כתובת המייל שלך
        to: email,                     // כתובת המייל של המשתמש
        subject: 'Password Reset',     // נושא המייל
        html: `<p>To reset your password, click on the link below:</p>
               <p><a href="http://localhost:5000/reset-password/${resetToken}">Reset Password</a></p>` // קישור עם הטוקן
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// נתיב לשליחת בקשה לאיפוס סיסמה
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    // חפש את המשתמש לפי כתובת המייל
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // יצירת טוקן לאיפוס הסיסמה
    const resetToken = crypto.randomBytes(32).toString('hex');

    // שמירת הטוקן במסד הנתונים
    user.resetPasswordToken = resetToken;
    await user.save();

    // שלח את המייל עם הקישור לאיפוס הסיסמה
    sendResetPasswordEmail(user.email, resetToken);

    return res.json({ message: 'Password reset link sent to your email' });
});

// נתיב לאיפוס סיסמה עם הטוקן החדש
app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    // חפש את המשתמש עם הטוקן
    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) {
        return res.status(404).json({ message: 'Invalid or expired token' });
    }

    // עדכן את הסיסמה החדשה
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = null;  // מנקה את הטוקן

    await user.save();

    return res.json({ message: 'Password successfully reset' });
});

// הפעלת השרת
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

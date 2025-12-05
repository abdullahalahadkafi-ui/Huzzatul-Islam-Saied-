const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// HTML ফাইল দেখানোর জন্য
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ইমেইল সেটআপ (সবচেয়ে শক্তিশালী কনফিগারেশন)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'abdullahalahadkafi@gmail.com',
        pass: 'otvyhxdlltiebrpu' // স্পেস ছাড়া আপনার পাসওয়ার্ড
    },
    tls: {
        rejectUnauthorized: false // রেন্ডার সার্ভারের কানেকশন সমস্যা সমাধান করবে
    }
});

// ইমেইল রিসিভ রাউট
app.post('/send-email', (req, res) => {
    const { name, phone, email, message } = req.body;
    console.log(`New Message from: ${name}`);

    // ১. ইউজারকে সাথে সাথে সফল মেসেজ দেখানো
    res.send("success");

    // ২. ইমেইল তৈরি
    const mailToAdmin = {
        from: email,
        to: 'abdullahalahadkafi@gmail.com',
        subject: `New Message from Website: ${name}`,
        text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`
    };

    const autoReply = {
        from: 'Huzzatul Islam Saied <abdullahalahadkafi@gmail.com>',
        to: email,
        subject: 'Thank you for contacting me',
        text: `Dear ${name},\n\nI have received your message. I will contact you soon.\n\nRegards,\nHuzzatul Islam Saied`
    };

    // ৩. ব্যাকগ্রাউন্ডে ইমেইল পাঠানো
    transporter.sendMail(mailToAdmin, (error, info) => {
        if (error) {
            console.log("Email Error:", error);
        } else {
            console.log("Email Sent Successfully");
            if(email){
                transporter.sendMail(autoReply, (err, inf) => {});
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
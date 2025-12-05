const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // HTML ফাইল লোড করার জন্য

// 👇 এই লাইনটি নতুন করে যুক্ত করুন (এটা ছবি দেখাতে সাহায্য করবে)
app.use(express.static(__dirname)); 

// আগের লাইন (থাকলে থাকুক, সমস্যা নেই)
app.use(express.static(path.join(__dirname, 'public')));

// HTML ফাইল দেখানোর জন্য

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ইমেইল পাঠানোর সঠিক সেটআপ (Gmail Port 587)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // 587 পোর্টের জন্য false দিতে হয়
    auth: {
        user: 'abdullahalahadkafi@gmail.com',
        pass: 'otvy hxdl ltie brpu' // আপনার অ্যাপ পাসওয়ার্ড
    },
    tls: {
        rejectUnauthorized: false
    }
});

// ইমেইল রিসিভ এবং রিপ্লাই দেওয়ার রাউট
app.post('/send-email', (req, res) => {
    const { name, phone, email, message } = req.body;

    // ১. আপনার কাছে ইমেইল আসবে
    const mailToAdmin = {
        from: email,
        to: 'abdullahalahadkafi@gmail.com', // 🔴 যেই ইমেইলে মেসেজ পেতে চান
        subject: `ওয়েবসাইট থেকে নতুন বার্তা: ${name}`,
        text: `নাম: ${name}\nফোন: ${phone}\nইমেইল: ${email}\nবার্তা: ${message}`
    };

    // ২. প্রেরকের কাছে অটোমেটিক ধন্যবাদ বার্তা যাবে
    const autoReply = {
        from: 'হুজ্জাতুল ইসলাম সাঈদ <abdullahalahadkafi@gmail.com>',
        to: email, // প্রেরকের ইমেইল
        subject: 'ধন্যবাদ - আমি আপনার বার্তা পেয়েছি',
        text: `প্রিয় ${name},\n\nআপনার বার্তা পাঠানোর জন্য ধন্যবাদ। আমি খুব শীঘ্রই আপনার সাথে যোগাযোগ করব।\n\nশুভেচ্ছান্তে,\nহুজ্জাতুল ইসলাম সাঈদ\nযুগ্ন সদস্য সচিব, জাতীয় যুবশক্তি।`
    };

    // ইমেইল পাঠানো শুরু
    transporter.sendMail(mailToAdmin, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send("মেসেজ পাঠানো যায়নি। আবার চেষ্টা করুন।");
        } else {
            // যদি সফল হয়, তবে অটো-রিপ্লাই পাঠানো হবে
            if(email){
                transporter.sendMail(autoReply, (err, inf) => {});
            }
            res.send("success");
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
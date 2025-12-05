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

    // ============ ১. আপনার জন্য ডিজাইন (Admin Template) ============
    const adminTemplate = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
            <h2 style="color: #003366; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
                ওয়েবসাইট থেকে নতুন বার্তা
            </h2>
            <p><strong>নাম:</strong> ${name}</p>
            <p><strong>মোবাইল:</strong> ${phone}</p>
            <p><strong>ইমেইল:</strong> ${email ? email : 'দেওয়া হয়নি'}</p>
            
            <div style="background-color: #fff; padding: 15px; border-left: 5px solid #003366; margin-top: 10px;">
                <p style="margin: 0; color: #555;"><strong>বার্তা:</strong></p>
                <p style="margin-top: 5px; font-size: 16px;">${message}</p>
            </div>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">Sent from Portfolio Website</p>
        </div>
    `;

    // ============ ২. ভিজিটরের জন্য অটো-রিপ্লাই ডিজাইন (User Template) ============
    const userTemplate = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0;">
            <!-- হেডার -->
            <div style="background-color: #003366; padding: 30px 20px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px; text-transform: uppercase;">হুজ্জাতুল ইসলাম সাঈদ</h1>
                <p style="margin: 5px 0 0; color: #d4af37; font-size: 14px;">যুগ্ন সদস্য সচিব | জাতীয় যুবশক্তি</p>
            </div>

            <!-- বডি -->
            <div style="padding: 30px; background-color: #ffffff;">
                <p style="font-size: 16px;">প্রিয় <strong>${name}</strong>,</p>
                <p>আসসালামু আলাইকুম।</p>
                <p>আপনার বার্তাটি আমি পেয়েছি। আমার সাথে যোগাযোগ করার জন্য আপনাকে আন্তরিক ধন্যবাদ।</p>
                <p>আমি বা আমার প্রতিনিধি খুব শীঘ্রই আপনার বার্তার উত্তর দেব বা প্রয়োজনে আপনার সাথে যোগাযোগ করব।</p>
                
                <div style="margin-top: 30px; padding: 15px; background-color: #f0f8ff; border-radius: 5px;">
                    <p style="margin: 0; font-weight: bold; color: #003366;">জরুরি প্রয়োজনে:</p>
                    <p style="margin: 5px 0 0;">📞 +880 1XXXXXXXXX</p>
                </div>
            </div>

            <!-- ফুটার -->
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                <p>&copy; ২০২৫ হুজ্জাতুল ইসলাম সাঈদ। সর্বস্বত্ব সংরক্ষিত।</p>
                <p>চট্টগ্রাম মহানগর কার্যালয়, জাতীয় যুবশক্তি।</p>
            </div>
        </div>
    `;

    // ৩. ইমেইল পাঠানো (Admin)
    const mailToAdmin = {
        from: `"${name}" <${email}>`, // ভিজিটরের নাম দেখাবে
        to: 'abdullahalahadkafi@gmail.com', // আপনার ইমেইল
        subject: `New Message: ${name}`,
        html: adminTemplate // HTML ব্যবহার করা হলো
    };

    // ৪. অটো রিপ্লাই পাঠানো (User)
    const autoReply = {
        from: '"হুজ্জাতুল ইসলাম সাঈদ" <abdullahalahadkafi@gmail.com>',
        to: email,
        subject: 'ধন্যবাদ - আপনার বার্তা গৃহীত হয়েছে',
        html: userTemplate // HTML ব্যবহার করা হলো
    };

    // সেন্ডিং প্রসেস
    transporter.sendMail(mailToAdmin, (error, info) => {
        if (error) {
            console.log("Admin Email Error:", error);
        } else {
            console.log("Admin Email Sent");
            if(email){
                transporter.sendMail(autoReply, (err, inf) => {
                    if(err) console.log("Auto-reply Error");
                    else console.log("Auto-reply Sent");
                });
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

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
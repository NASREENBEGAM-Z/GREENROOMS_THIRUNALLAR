const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Request OTP
router.post('/request', async (req, res) => {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.otp.create({ data: { email, code, expiresAt } });

    await transporter.sendMail({
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${code}`,
    });

    res.json({ message: "OTP sent" });
});

// Verify OTP
router.post('/verify', async (req, res) => {
    const { email, code } = req.body;
    const otp = await prisma.otp.findFirst({
        where: { email, code },
        orderBy: { createdAt: 'desc' }
    });

    if (!otp || otp.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Optionally, delete OTP after use
    await prisma.otp.delete({ where: { id: otp.id } });

    res.json({ message: "OTP verified" });
});

module.exports = router; 
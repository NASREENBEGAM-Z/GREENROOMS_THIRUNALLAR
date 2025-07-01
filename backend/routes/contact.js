const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// @route   POST api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const contact = await prisma.contact.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                subject: req.body.subject,
                message: req.body.message
            }
        });

        // Send auto-reply to customer
        try {
            await transporter.sendMail({
                from: `"Green Guest House" <${process.env.EMAIL_USER}>`,
                to: contact.email,
                subject: 'Thank you for contacting us - Green Guest House',
                html: `
                    <h2>Thank you for contacting us!</h2>
                    <p>Dear ${contact.name},</p>
                    <p>We have received your message and will get back to you as soon as possible.</p>
                    <h3>Your message:</h3>
                    <p><strong>Subject:</strong> ${contact.subject}</p>
                    <p><strong>Message:</strong> ${contact.message}</p>
                    <p>We typically respond within 24 hours.</p>
                    <p>Best regards,<br>Green Guest House Team</p>
                `
            });
        } catch (emailError) {
            console.error('Failed to send auto-reply email:', emailError);
        }

        res.status(201).json({
            message: 'Contact form submitted successfully',
            contact
        });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ message: 'Failed to submit contact form' });
    }
});

// @route   GET api/contact
// @desc    Get all contact messages (Admin only)
// @access  Private
router.get('/', async (req, res) => {
    try {
        const {
            status,
            page = 1,
            limit = 20
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        let where = {};
        if (status) {
            where.status = status;
        }

        const [contacts, total] = await Promise.all([
            prisma.contact.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma.contact.count({ where })
        ]);

        res.json({
            contacts,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / parseInt(limit)),
                hasNext: skip + contacts.length < total,
                hasPrev: parseInt(page) > 1
            },
            total
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Failed to fetch contacts' });
    }
});

// @route   GET api/contact/:id
// @desc    Get contact message by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const contact = await prisma.contact.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!contact) {
            return res.status(404).json({ message: 'Contact message not found' });
        }

        // Mark as read if it's unread
        if (contact.status === 'unread') {
            await prisma.contact.update({
                where: { id: contact.id },
                data: { status: 'read' }
            });
        }

        res.json(contact);
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ message: 'Failed to fetch contact' });
    }
});

// @route   PUT api/contact/:id/reply
// @desc    Reply to contact message (Admin only)
// @access  Private
router.put('/:id/reply', [
    body('adminReply').notEmpty().withMessage('Reply message is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const contact = await prisma.contact.update({
            where: { id: parseInt(req.params.id) },
            data: {
                adminReply: req.body.adminReply,
                status: 'replied'
            }
        });

        // Send reply email to customer
        try {
            await transporter.sendMail({
                from: `"Green Guest House" <${process.env.EMAIL_USER}>`,
                to: contact.email,
                subject: `Re: ${contact.subject} - Green Guest House`,
                html: `
                    <h2>Response to your inquiry</h2>
                    <p>Dear ${contact.name},</p>
                    <p>Thank you for contacting Green Guest House. Here is our response to your inquiry:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #4CAF50;">
                        <p><strong>Your original message:</strong></p>
                        <p>${contact.message}</p>
                    </div>
                    <div style="background-color: #e3f2fd; padding: 15px; margin: 15px 0; border-left: 4px solid #2196F3;">
                        <p><strong>Our response:</strong></p>
                        <p>${req.body.adminReply}</p>
                    </div>
                    <p>If you have any further questions, please don't hesitate to contact us.</p>
                    <p>Best regards,<br>Green Guest House Team</p>
                `
            });
        } catch (emailError) {
            console.error('Failed to send reply email:', emailError);
        }

        res.json({
            message: 'Reply sent successfully',
            contact
        });
    } catch (error) {
        console.error('Error sending reply:', error);
        res.status(500).json({ message: 'Failed to send reply' });
    }
});

// @route   DELETE api/contact/:id
// @desc    Delete contact message (Admin only)
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        await prisma.contact.delete({
            where: { id: parseInt(req.params.id) }
        });

        res.json({ message: 'Contact message deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Failed to delete contact message' });
    }
});

module.exports = router; 
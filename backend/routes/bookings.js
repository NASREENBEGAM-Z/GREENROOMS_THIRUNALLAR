const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Public
router.post('/', [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('checkIn').isISO8601().withMessage('Valid check-in date is required'),
    body('checkOut').isISO8601().withMessage('Valid check-out date is required'),
    body('adults').isInt({ min: 1 }).withMessage('At least 1 adult is required'),
    body('children').isInt({ min: 0 }).withMessage('Children must be 0 or more'),
    body('totalPrice').isFloat({ min: 0 }).withMessage('Valid price is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if room is available for the selected dates
        if (req.body.roomId) {
            const conflictingBooking = await prisma.booking.findFirst({
                where: {
                    roomId: parseInt(req.body.roomId),
                    status: {
                        in: ['pending', 'confirmed']
                    },
                    OR: [
                        {
                            AND: [
                                { checkIn: { lte: new Date(req.body.checkIn) } },
                                { checkOut: { gt: new Date(req.body.checkIn) } }
                            ]
                        },
                        {
                            AND: [
                                { checkIn: { lt: new Date(req.body.checkOut) } },
                                { checkOut: { gte: new Date(req.body.checkOut) } }
                            ]
                        }
                    ]
                }
            });

            if (conflictingBooking) {
                return res.status(400).json({
                    message: 'Room is not available for the selected dates'
                });
            }
        }

        const booking = await prisma.booking.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                note: req.body.note,
                checkIn: new Date(req.body.checkIn),
                checkOut: new Date(req.body.checkOut),
                adults: parseInt(req.body.adults),
                children: parseInt(req.body.children),
                roomData: req.body.room || {},
                totalPrice: parseFloat(req.body.totalPrice),
                roomId: req.body.roomId ? parseInt(req.body.roomId) : null
            },
            include: {
                room: true
            }
        });

        // Send confirmation email to customer
        try {
            await transporter.sendMail({
                from: `"Green Guest House" <${process.env.EMAIL_USER}>`,
                to: booking.email,
                subject: 'Booking Confirmation - Green Guest House',
                html: `
                    <h2>Booking Confirmation</h2>
                    <p>Dear ${booking.firstName} ${booking.lastName},</p>
                    <p>Thank you for choosing Green Guest House Thirunallar!</p>
                    <h3>Booking Details:</h3>
                    <ul>
                        <li><strong>Booking ID:</strong> #${booking.id}</li>
                        <li><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</li>
                        <li><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</li>
                        <li><strong>Guests:</strong> ${booking.adults} adults, ${booking.children} children</li>
                        <li><strong>Total Amount:</strong> ₹${booking.totalPrice}</li>
                    </ul>
                    <p>We will review your booking and confirm it shortly. You will receive another email with confirmation details.</p>
                    <p>If you have any questions, please contact us.</p>
                    <p>Best regards,<br>Green Guest House Team</p>
                `
            });
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
        }

        res.status(201).json({
            message: 'Booking created successfully',
            booking,
            emailSent: true
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Failed to create booking' });
    }
});

// @route   GET api/bookings
// @desc    Get all bookings (for admin)
// @access  Private
router.get('/', async (req, res) => {
    try {
        const {
            status,
            page = 1,
            limit = 20,
            search,
            startDate,
            endDate
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        let where = {};

        if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (startDate && endDate) {
            where.checkIn = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        const [bookings, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                include: {
                    room: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: parseInt(limit)
            }),
            prisma.booking.count({ where })
        ]);

        res.json({
            bookings,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / parseInt(limit)),
                hasNext: skip + bookings.length < total,
                hasPrev: parseInt(page) > 1
            },
            total
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
});

// @route   GET api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { room: true }
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Failed to fetch booking' });
    }
});

// @route   PUT api/bookings/:id
// @desc    Update booking status (admin)
// @access  Private
router.put('/:id', [
    body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Invalid status'),
    body('adminReply').optional().isString(),
    body('adminNotes').optional().isString()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const booking = await prisma.booking.update({
            where: { id: parseInt(req.params.id) },
            data: {
                status: req.body.status,
                adminReply: req.body.adminReply,
                adminNotes: req.body.adminNotes
            },
            include: { room: true }
        });

        // Send email notification to customer if status changed
        if (req.body.status === 'confirmed' && booking.email) {
            try {
                await transporter.sendMail({
                    from: `"Green Guest House" <${process.env.EMAIL_USER}>`,
                    to: booking.email,
                    subject: 'Booking Confirmed - Green Guest House',
                    html: `
                        <h2>Booking Confirmed!</h2>
                        <p>Dear ${booking.firstName} ${booking.lastName},</p>
                        <p>Great news! Your booking has been confirmed.</p>
                        <h3>Booking Details:</h3>
                        <ul>
                            <li><strong>Booking ID:</strong> #${booking.id}</li>
                            <li><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</li>
                            <li><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</li>
                            <li><strong>Status:</strong> Confirmed</li>
                        </ul>
                        ${req.body.adminReply ? `<p><strong>Message from us:</strong> ${req.body.adminReply}</p>` : ''}
                        <p>We look forward to welcoming you!</p>
                        <p>Best regards,<br>Green Guest House Team</p>
                    `
                });
            } catch (emailError) {
                console.error('Failed to send confirmation email:', emailError);
            }
        }

        res.json({
            message: 'Booking updated successfully',
            booking
        });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Failed to update booking' });
    }
});

// @route   DELETE api/bookings/:id
// @desc    Delete booking (admin)
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        await prisma.booking.delete({
            where: { id: parseInt(req.params.id) }
        });

        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Failed to delete booking' });
    }
});

module.exports = router; 
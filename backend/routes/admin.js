const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// @route   POST api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const admin = await prisma.admin.findUnique({
            where: { email: req.body.email }
        });

        if (!admin || !admin.isActive) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

// @route   GET api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard', async (req, res) => {
    try {
        const [
            totalBookings,
            pendingBookings,
            confirmedBookings,
            totalRooms,
            availableRooms,
            totalContacts,
            unreadContacts,
            totalReviews,
            pendingReviews
        ] = await Promise.all([
            prisma.booking.count(),
            prisma.booking.count({ where: { status: 'pending' } }),
            prisma.booking.count({ where: { status: 'confirmed' } }),
            prisma.room.count(),
            prisma.room.count({ where: { isAvailable: true } }),
            prisma.contact.count(),
            prisma.contact.count({ where: { status: 'unread' } }),
            prisma.review.count(),
            prisma.review.count({ where: { isApproved: false } })
        ]);

        // Get recent bookings
        const recentBookings = await prisma.booking.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { room: true }
        });

        // Get revenue data (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentRevenue = await prisma.booking.aggregate({
            where: {
                createdAt: { gte: thirtyDaysAgo },
                status: { in: ['confirmed', 'completed'] }
            },
            _sum: { totalPrice: true }
        });

        res.json({
            stats: {
                totalBookings,
                pendingBookings,
                confirmedBookings,
                totalRooms,
                availableRooms,
                totalContacts,
                unreadContacts,
                totalReviews,
                pendingReviews,
                recentRevenue: recentRevenue._sum.totalPrice || 0
            },
            recentBookings
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
});

// @route   POST api/admin/create
// @desc    Create new admin (Super admin only)
// @access  Private
router.post('/create', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['admin', 'super_admin']).withMessage('Invalid role')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const admin = await prisma.admin.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role
            }
        });

        res.status(201).json({
            message: 'Admin created successfully',
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Error creating admin:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }
        res.status(500).json({ message: 'Failed to create admin' });
    }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { body, validationResult } = require('express-validator');

// @route   POST api/reviews
// @desc    Submit a review
// @access  Public
router.post('/', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Comment is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const review = await prisma.review.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                rating: parseInt(req.body.rating),
                comment: req.body.comment
            }
        });

        res.status(201).json({
            message: 'Review submitted successfully. It will be published after approval.',
            review
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: 'Failed to submit review' });
    }
});

// @route   GET api/reviews
// @desc    Get all approved reviews (Public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            rating
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        let where = { isApproved: true };
        if (rating) {
            where.rating = parseInt(rating);
        }

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma.review.count({ where })
        ]);

        // Calculate average rating
        const avgRating = await prisma.review.aggregate({
            where: { isApproved: true },
            _avg: { rating: true }
        });

        res.json({
            reviews,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / parseInt(limit)),
                hasNext: skip + reviews.length < total,
                hasPrev: parseInt(page) > 1
            },
            total,
            averageRating: avgRating._avg.rating || 0
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});

// @route   GET api/reviews/admin
// @desc    Get all reviews for admin (including pending)
// @access  Private
router.get('/admin', async (req, res) => {
    try {
        const {
            status,
            page = 1,
            limit = 20
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        let where = {};
        if (status === 'pending') {
            where.isApproved = false;
        } else if (status === 'approved') {
            where.isApproved = true;
        }

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma.review.count({ where })
        ]);

        res.json({
            reviews,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / parseInt(limit)),
                hasNext: skip + reviews.length < total,
                hasPrev: parseInt(page) > 1
            },
            total
        });
    } catch (error) {
        console.error('Error fetching admin reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});

// @route   PUT api/reviews/:id/approve
// @desc    Approve a review (Admin only)
// @access  Private
router.put('/:id/approve', async (req, res) => {
    try {
        const review = await prisma.review.update({
            where: { id: parseInt(req.params.id) },
            data: { isApproved: true }
        });

        res.json({
            message: 'Review approved successfully',
            review
        });
    } catch (error) {
        console.error('Error approving review:', error);
        res.status(500).json({ message: 'Failed to approve review' });
    }
});

// @route   PUT api/reviews/:id/reject
// @desc    Reject a review (Admin only)
// @access  Private
router.put('/:id/reject', async (req, res) => {
    try {
        await prisma.review.delete({
            where: { id: parseInt(req.params.id) }
        });

        res.json({ message: 'Review rejected and deleted successfully' });
    } catch (error) {
        console.error('Error rejecting review:', error);
        res.status(500).json({ message: 'Failed to reject review' });
    }
});

// @route   DELETE api/reviews/:id
// @desc    Delete a review (Admin only)
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        await prisma.review.delete({
            where: { id: parseInt(req.params.id) }
        });

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Failed to delete review' });
    }
});

// @route   GET api/reviews/stats
// @desc    Get review statistics
// @access  Public
router.get('/stats', async (req, res) => {
    try {
        const [totalReviews, approvedReviews, averageRating, ratingDistribution] = await Promise.all([
            prisma.review.count(),
            prisma.review.count({ where: { isApproved: true } }),
            prisma.review.aggregate({
                where: { isApproved: true },
                _avg: { rating: true }
            }),
            prisma.review.groupBy({
                by: ['rating'],
                where: { isApproved: true },
                _count: { rating: true }
            })
        ]);

        res.json({
            totalReviews,
            approvedReviews,
            pendingReviews: totalReviews - approvedReviews,
            averageRating: averageRating._avg.rating || 0,
            ratingDistribution
        });
    } catch (error) {
        console.error('Error fetching review stats:', error);
        res.status(500).json({ message: 'Failed to fetch review statistics' });
    }
});

module.exports = router; 
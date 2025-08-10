const express = require('express');
const Feedback = require('../models/Feedback');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/feedback
// @desc    Submit feedback
// @access  Public
router.post('/feedback', async (req, res) => {
    try {
        const { name, email, feedback } = req.body;

        // Validation
        if (!name || !email || !feedback) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Email validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Create feedback
        const newFeedback = new Feedback({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            feedback: feedback.trim(),
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        });

        await newFeedback.save();

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully. Thank you for your valuable input!',
            data: {
                id: newFeedback._id,
                submittedAt: newFeedback.createdAt
            }
        });

    } catch (error) {
        console.error('Feedback submission error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while submitting feedback'
        });
    }
});

// @route   GET /api/feedback
// @desc    Get all feedback (admin only)
// @access  Private (Admin)
router.get('/feedback', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        const { 
            page = 1, 
            limit = 10, 
            status = '', 
            priority = '',
            search = ''
        } = req.query;

        // Build query
        let query = {};

        if (status) {
            query.status = status;
        }

        if (priority) {
            query.priority = priority;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { feedback: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get feedback
        const feedbackList = await Feedback.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const totalCount = await Feedback.countDocuments(query);
        const totalPages = Math.ceil(totalCount / parseInt(limit));

        // Get status counts
        const statusCounts = await Feedback.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                feedback: feedbackList,
                pagination: {
                    current: parseInt(page),
                    total: totalPages,
                    count: totalCount,
                    hasNext: parseInt(page) < totalPages,
                    hasPrev: parseInt(page) > 1
                },
                statusCounts
            }
        });

    } catch (error) {
        console.error('Get feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching feedback'
        });
    }
});

// @route   PUT /api/feedback/:id
// @desc    Update feedback status/priority (admin only)
// @access  Private (Admin)
router.put('/feedback/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        const { id } = req.params;
        const { status, priority } = req.body;

        // Find and update feedback
        const feedback = await Feedback.findById(id);
        
        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        // Update fields if provided
        if (status) {
            feedback.status = status;
        }
        
        if (priority) {
            feedback.priority = priority;
        }

        await feedback.save();

        res.status(200).json({
            success: true,
            message: 'Feedback updated successfully',
            data: feedback
        });

    } catch (error) {
        console.error('Update feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating feedback'
        });
    }
});

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback (admin only)
// @access  Private (Admin)
router.delete('/feedback/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        const { id } = req.params;

        const feedback = await Feedback.findByIdAndDelete(id);
        
        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Feedback deleted successfully'
        });

    } catch (error) {
        console.error('Delete feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting feedback'
        });
    }
});

module.exports = router;

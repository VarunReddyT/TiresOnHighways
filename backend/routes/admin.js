const express = require('express');
const User = require('../models/User');
const TollData = require('../models/TollData');
const GuestData = require('../models/GuestData');
const { auth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin)
router.get('/users', auth, adminAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        let query = {};
        if (search) {
            query = {
                $or: [
                    { username: { $regex: search, $options: 'i' } },
                    { role: { $regex: search, $options: 'i' } },
                    { tollPlaza: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            users,
            totalPages,
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching users'
        });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private (Admin)
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        // Prevent deleting other admins
        if (user.role === 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete admin users'
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting user'
        });
    }
});

// @route   GET /api/admin/toll-operators
// @desc    Get list of toll operators/plazas for dropdown
// @access  Private (Admin)
router.get('/toll-operators', auth, adminAuth, async (req, res) => {
    try {
        const tollOperators = await User.find({ role: 'toll_operator' })
            .select('username tollPlaza')
            .sort({ tollPlaza: 1 });

        const uniquePlazas = [...new Set(tollOperators.map(op => op.tollPlaza))]
            .filter(plaza => plaza) // Remove empty values
            .sort();

        res.status(200).json({
            success: true,
            operators: tollOperators,
            plazas: uniquePlazas
        });
    } catch (error) {
        console.error('Get toll operators error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching toll operators'
        });
    }
});

// @route   GET /api/admin/toll-data
// @desc    Get toll data by toll operator with pagination
// @access  Private (Admin)
router.get('/toll-data', auth, adminAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const tollOperator = req.query.tollOperator || '';
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        let query = {};
        
        if (tollOperator) {
            query.tollPlaza = tollOperator;
        }
        if (search) {
            const searchQuery = {
                $or: [
                    { vehicleNumber: { $regex: search, $options: 'i' } },
                    { userMobileNumber: { $regex: search, $options: 'i' } }
                ]
            };
            
            if (tollOperator) {
                query = { $and: [query, searchQuery] };
            } else {
                query = searchQuery;
            }
        }

        const data = await TollData.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await TollData.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data,
            totalPages,
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get toll data error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching toll data'
        });
    }
});

// @route   GET /api/admin/guest-data
// @desc    Get all guest data with pagination
// @access  Private (Admin)
router.get('/guest-data', auth, adminAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        let query = {};
        if (search) {
            query = {
                $or: [
                    { vehicleNumber: { $regex: search, $options: 'i' } },
                    { userMobileNumber: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const data = await GuestData.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await GuestData.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data,
            totalPages,
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get guest data error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching guest data'
        });
    }
});

// @route   GET /api/admin/statistics
// @desc    Get admin statistics
// @access  Private (Admin)
router.get('/statistics', auth, adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'toll_operator' });
        const totalTollData = await TollData.countDocuments();
        const totalGuestData = await GuestData.countDocuments();
        
        // Get data from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentTollData = await TollData.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });
        
        const recentGuestData = await GuestData.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        // Get tire condition statistics
        const tireConditionStats = await TollData.aggregate([
            { $match: { 'result.tireCondition': { $exists: true } } },
            { $group: { _id: '$result.tireCondition', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            statistics: {
                totalUsers,
                totalTollData,
                totalGuestData,
                recentTollData,
                recentGuestData,
                tireConditionStats
            }
        });
    } catch (error) {
        console.error('Get statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics'
        });
    }
});

module.exports = router;

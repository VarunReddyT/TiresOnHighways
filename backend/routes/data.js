const express = require('express');
const TollData = require('../models/TollData');
const GuestData = require('../models/GuestData');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/data/statistics
// @desc    Get statistics dashboard data
// @access  Private
router.get('/statistics', auth, async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Total records
        const totalTollRecords = await TollData.countDocuments();
        const totalGuestRecords = await GuestData.countDocuments();
        const totalRecords = totalTollRecords + totalGuestRecords;

        // Monthly records
        const monthlyTollRecords = await TollData.countDocuments({
            createdAt: { $gte: startOfMonth }
        });
        const monthlyGuestRecords = await GuestData.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        // Weekly records
        const weeklyTollRecords = await TollData.countDocuments({
            createdAt: { $gte: startOfWeek }
        });
        const weeklyGuestRecords = await GuestData.countDocuments({
            createdAt: { $gte: startOfWeek }
        });

        // Daily records
        const dailyTollRecords = await TollData.countDocuments({
            createdAt: { $gte: startOfDay }
        });
        const dailyGuestRecords = await GuestData.countDocuments({
            createdAt: { $gte: startOfDay }
        });

        // Status distribution for toll data
        const tollStatusDistribution = await TollData.aggregate([
            {
                $group: {
                    _id: '$overallStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Status distribution for guest data
        const guestStatusDistribution = await GuestData.aggregate([
            {
                $group: {
                    _id: '$overallStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Convert status distribution arrays to objects
        const formatStatusDistribution = (statusArray) => {
            const result = { safe: 0, warning: 0, danger: 0, pending: 0 };
            statusArray.forEach(item => {
                if (result.hasOwnProperty(item._id)) {
                    result[item._id] = item.count;
                }
            });
            return result;
        };

        const tollStatusFormatted = formatStatusDistribution(tollStatusDistribution);
        const guestStatusFormatted = formatStatusDistribution(guestStatusDistribution);
        
        // Combined status distribution
        const combinedStatusDistribution = {
            safe: tollStatusFormatted.safe + guestStatusFormatted.safe,
            warning: tollStatusFormatted.warning + guestStatusFormatted.warning,
            danger: tollStatusFormatted.danger + guestStatusFormatted.danger,
            pending: tollStatusFormatted.pending + guestStatusFormatted.pending
        };

        // Recent alerts (danger status)
        const recentAlerts = await TollData.find({
            overallStatus: 'danger',
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
        })
        .select('vehicleNumber userMobileNumber overallStatus createdAt tollOperator')
        .sort({ createdAt: -1 })
        .limit(10);

        // Daily trend for the last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const dailyTrend = await TollData.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 },
                    safe: { $sum: { $cond: [{ $eq: ['$overallStatus', 'safe'] }, 1, 0] } },
                    warning: { $sum: { $cond: [{ $eq: ['$overallStatus', 'warning'] }, 1, 0] } },
                    danger: { $sum: { $cond: [{ $eq: ['$overallStatus', 'danger'] }, 1, 0] } }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalRecords,
                tollRecords: totalTollRecords,
                guestRecords: totalGuestRecords,
                
                monthly: {
                    toll: monthlyTollRecords,
                    guest: monthlyGuestRecords,
                    total: monthlyTollRecords + monthlyGuestRecords
                },
                
                weekly: {
                    toll: weeklyTollRecords,
                    guest: weeklyGuestRecords,
                    total: weeklyTollRecords + weeklyGuestRecords
                },
                
                daily: {
                    toll: dailyTollRecords,
                    guest: dailyGuestRecords,
                    total: dailyTollRecords + dailyGuestRecords
                },
                
                statusDistribution: combinedStatusDistribution,
                statusDistributionDetailed: {
                    toll: tollStatusFormatted,
                    guest: guestStatusFormatted
                },
                
                recentAlerts,
                dailyTrend,
                
                lastUpdated: new Date()
            }
        });

    } catch (error) {
        console.error('Statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics'
        });
    }
});

// @route   GET /api/data/public-statistics
// @desc    Get public statistics (only safety status distribution)
// @access  Public
router.get('/public-statistics', async (req, res) => {
    try {
        // Combined status distribution from both toll and guest data
        const tollStatusDistribution = await TollData.aggregate([
            {
                $group: {
                    _id: '$overallStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        const guestStatusDistribution = await GuestData.aggregate([
            {
                $group: {
                    _id: '$overallStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Convert status distribution arrays to objects
        const formatStatusDistribution = (statusArray) => {
            const result = { safe: 0, warning: 0, danger: 0, pending: 0 };
            statusArray.forEach(item => {
                if (result.hasOwnProperty(item._id)) {
                    result[item._id] = item.count;
                }
            });
            return result;
        };

        const tollStatusFormatted = formatStatusDistribution(tollStatusDistribution);
        const guestStatusFormatted = formatStatusDistribution(guestStatusDistribution);
        
        // Combined status distribution
        const statusDistribution = {
            safe: tollStatusFormatted.safe + guestStatusFormatted.safe,
            warning: tollStatusFormatted.warning + guestStatusFormatted.warning,
            danger: tollStatusFormatted.danger + guestStatusFormatted.danger,
            pending: tollStatusFormatted.pending + guestStatusFormatted.pending
        };

        const totalRecords = statusDistribution.safe + statusDistribution.warning + statusDistribution.danger + statusDistribution.pending;

        res.status(200).json({
            success: true,
            data: {
                statusDistribution,
                totalRecords,
                lastUpdated: new Date()
            }
        });

    } catch (error) {
        console.error('Public statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching public statistics'
        });
    }
});

// @route   GET /api/data/toll-records
// @desc    Get toll records with pagination and search
// @access  Private
router.get('/toll-records', auth, async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '', 
            status = '', 
            startDate = '', 
            endDate = '',
            includeImages = 'false'
        } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { vehicleNumber: { $regex: search, $options: 'i' } },
                { userMobileNumber: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            query.overallStatus = status;
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        let projection = {};
        if (includeImages === 'false') {
            projection = { 'images.base64': 0 };
        }

        const records = await TollData.find(query, projection)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalCount = await TollData.countDocuments(query);
        const totalPages = Math.ceil(totalCount / parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                records,
                pagination: {
                    current: parseInt(page),
                    total: totalPages,
                    count: totalCount,
                    hasNext: parseInt(page) < totalPages,
                    hasPrev: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Toll records error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching toll records'
        });
    }
});

// @route   GET /api/data/toll-record-images/:id
// @desc    Get images for a specific toll record
// @access  Private
router.get('/toll-record-images/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        
        const record = await TollData.findById(id).select('images');
        
        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Record not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                images: record.images
            }
        });

    } catch (error) {
        console.error('Toll record images error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching record images'
        });
    }
});

// @route   GET /api/data/guest-records
// @desc    Get guest records by vehicle number and mobile number with pagination and filters
// @access  Public
router.get('/guest-records', async (req, res) => {
    try {
        const { 
            vehicleNumber, 
            mobileNumber, 
            page = 1, 
            limit = 5, 
            startDate, 
            endDate,
            includeImages = 'false'
        } = req.query;

        if (!vehicleNumber || !mobileNumber) {
            return res.status(400).json({
                success: false,
                message: 'Vehicle number and mobile number are required'
            });
        }

        const query = {
            vehicleNumber: vehicleNumber.toUpperCase(),
            userMobileNumber: mobileNumber
        };

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate + 'T23:59:59.999Z');
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const limitNum = parseInt(limit);

        let selectQuery = includeImages === 'true' ? {} : { 'images.base64': 0 };

        const records = await GuestData.find(query)
            .select(selectQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const totalRecords = await GuestData.countDocuments(query);
        const totalPages = Math.ceil(totalRecords / limitNum);

        if (records.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No records found for the provided details'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                records,
                count: totalRecords,
                totalPages,
                currentPage: parseInt(page),
                hasNext: parseInt(page) < totalPages,
                hasPrev: parseInt(page) > 1
            }
        });

    } catch (error) {
        console.error('Guest records error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching guest records'
        });
    }
});

// @route   GET /api/data/record/:id
// @desc    Get single record details with images
// @access  Private for toll records, Public for guest records
router.get('/record/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { type = 'auto' } = req.query; // 'toll', 'guest', or 'auto'

        let record = null;

        if (type === 'toll' || type === 'auto') {
            record = await TollData.findById(id);
        }

        if (!record && (type === 'guest' || type === 'auto')) {
            record = await GuestData.findById(id);
        }

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Record not found'
            });
        }

        // If it's a toll record and user is not authenticated, deny access
        if (record.constructor.modelName === 'TollData') {
            // Check if user is authenticated
            const authHeader = req.header('Authorization');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required for toll records'
                });
            }
        }

        res.status(200).json({
            success: true,
            data: record
        });

    } catch (error) {
        console.error('Record details error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching record details'
        });
    }
});

module.exports = router;

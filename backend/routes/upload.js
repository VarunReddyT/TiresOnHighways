const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const TollData = require('../models/TollData');
const GuestData = require('../models/GuestData');
const { auth } = require('../middleware/auth');

const router = express.Router();

const analyzeImages = async (base64Images) => {
    try {
        const flaskApiUrl = process.env.FLASK_API_URL || 'http://localhost:5000';
        
        // Create FormData for all images
        const formData = new FormData();
        
        for (let i = 0; i < base64Images.length; i++) {
            // Convert base64 to buffer
            const imageBuffer = Buffer.from(base64Images[i], 'base64');
            
            // Append buffer directly to FormData with proper options
            formData.append('image', imageBuffer, {
                filename: `tire_image_${i}.jpg`,
                contentType: 'image/jpeg'
            });
        }

        // Call Flask API with all images
        const response = await axios.post(`${flaskApiUrl}/classify`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
            timeout: 30000 // 30 seconds timeout
        });
        if (response.data && Array.isArray(response.data)) {
            // Convert Flask response format to expected format
            return response.data.map(result => ({
                prediction: result.class ? result.class.toLowerCase() : 'normal',
                confidence: result.confidence || 0.5
            }));
        } else {
            // Fallback for unexpected response format
            return base64Images.map(() => ({
                prediction: 'normal',
                confidence: 0.5
            }));
        }

    } catch (error) {
        console.error('Flask API error:', error);
        // Return default results if API fails
        return base64Images.map(() => ({
            prediction: 'normal',
            confidence: 0.5
        }));
    }
};

// Helper function to determine overall status
const determineOverallStatus = (analysisResults) => {
    const crackedCount = analysisResults.filter(result => result.prediction === 'cracked').length;
    const highConfidenceCracked = analysisResults.filter(result => 
        result.prediction === 'cracked' && result.confidence > 0.8
    ).length;

    if (highConfidenceCracked > 0) {
        return 'danger';
    } else if (crackedCount > 0) {
        return 'warning';
    } else {
        return 'safe';
    }
};

// @route   POST /api/upload/vehicle-data
// @desc    Upload vehicle data (toll operator)
// @access  Private
router.post('/vehicle-data', auth, async (req, res) => {
    try {
        const { vehicleNumber, userMobileNumber, images, date, tollOperator } = req.body;

        // Validation
        if (!vehicleNumber || !userMobileNumber || !images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required and at least one image must be provided'
            });
        }

        // Vehicle number validation
        const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
        if (!vehicleRegex.test(vehicleNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid vehicle number format'
            });
        }

        // Mobile number validation
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(userMobileNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid mobile number format'
            });
        }

        // Analyze images with Flask API
        const analysisResults = await analyzeImages(images);

        // Determine overall status
        const overallStatus = determineOverallStatus(analysisResults);

        // Prepare images with analysis
        const processedImages = images.map((base64, index) => ({
            base64: base64,
            analysis: analysisResults[index] || { prediction: 'normal', confidence: 0.5 }
        }));

        // Save to database
        const tollData = new TollData({
            vehicleNumber: vehicleNumber.toUpperCase(),
            userMobileNumber,
            date: date ? new Date(date) : new Date(),
            tollOperator: tollOperator || req.user.username,
            tollPlaza: req.user.tollPlaza || 'Unknown',
            images: processedImages,
            overallStatus,
            analysisTimestamp: new Date()
        });

        await tollData.save();

        res.status(201).json({
            success: true,
            message: 'Vehicle data uploaded and analyzed successfully',
            data: {
                id: tollData._id,
                vehicleNumber: tollData.vehicleNumber,
                overallStatus: tollData.overallStatus,
                analysisResults: analysisResults,
                uploadedAt: tollData.createdAt
            }
        });

    } catch (error) {
        console.error('Toll upload error:', error);
        
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
            message: 'Server error during upload'
        });
    }
});

// @route   POST /api/upload/guest-data
// @desc    Upload guest data
// @access  Public
router.post('/guest-data', async (req, res) => {
    try {
        const { vehicleNumber, userMobileNumber, images } = req.body;

        // Validation
        if (!vehicleNumber || !userMobileNumber || !images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required and at least one image must be provided'
            });
        }

        // Vehicle number validation
        const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
        if (!vehicleRegex.test(vehicleNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid vehicle number format'
            });
        }

        // Mobile number validation
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(userMobileNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid mobile number format'
            });
        }

        // Analyze images with Flask API
        const analysisResults = await analyzeImages(images);

        // Determine overall status
        const overallStatus = determineOverallStatus(analysisResults);

        // Prepare images with analysis
        const processedImages = images.map((base64, index) => ({
            base64: base64,
            analysis: analysisResults[index] || { prediction: 'normal', confidence: 0.5 }
        }));

        // Save to database
        const guestData = new GuestData({
            vehicleNumber: vehicleNumber.toUpperCase(),
            userMobileNumber,
            images: processedImages,
            overallStatus,
            analysisTimestamp: new Date(),
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        });

        await guestData.save();

        res.status(201).json({
            success: true,
            message: 'Guest data uploaded and analyzed successfully',
            data: {
                id: guestData._id,
                vehicleNumber: guestData.vehicleNumber,
                overallStatus: guestData.overallStatus,
                analysisResults: analysisResults,
                uploadedAt: guestData.createdAt
            }
        });

    } catch (error) {
        console.error('Guest upload error:', error);
        
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
            message: 'Server error during upload'
        });
    }
});

module.exports = router;

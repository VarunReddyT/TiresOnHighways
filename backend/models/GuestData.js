const mongoose = require('mongoose');

const guestDataSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: [true, 'Vehicle number is required'],
        uppercase: true,
        trim: true,
        match: [/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/, 'Invalid vehicle number format']
    },
    userMobileNumber: {
        type: String,
        required: [true, 'Mobile number is required'],
        match: [/^[0-9]{10}$/, 'Invalid mobile number format']
    },
    images: [{
        base64: {
            type: String,
            required: true
        },
        analysis: {
            prediction: {
                type: String,
                enum: ['normal', 'cracked'],
                required: true
            },
            confidence: {
                type: Number,
                required: true,
                min: 0,
                max: 1
            }
        }
    }],
    overallStatus: {
        type: String,
        enum: ['safe', 'warning', 'danger'],
        required: true
    },
    analysisTimestamp: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        required: false
    },
    userAgent: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


guestDataSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});


guestDataSchema.index({ vehicleNumber: 1, userMobileNumber: 1 });
guestDataSchema.index({ createdAt: -1 });
guestDataSchema.index({ overallStatus: 1 });

module.exports = mongoose.model('GuestData', guestDataSchema);

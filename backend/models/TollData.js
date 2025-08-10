const mongoose = require('mongoose');

const tollDataSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        default: Date.now
    },
    tollOperator: {
        type: String,
        required: [true, 'Toll operator is required']
    },
    tollPlaza: {
        type: String,
        required: false,
        default: 'Unknown'
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

tollDataSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});


tollDataSchema.index({ vehicleNumber: 1, userMobileNumber: 1 });
tollDataSchema.index({ date: -1 });
tollDataSchema.index({ overallStatus: 1 });

module.exports = mongoose.model('TollData', tollDataSchema);

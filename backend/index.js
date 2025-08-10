const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const dataRoutes = require('./routes/data');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));


app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/data', dataRoutes);
app.use('/api', feedbackRoutes);
app.use('/api/admin', adminRoutes);


app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'TOH Backend Server is running',
        timestamp: new Date().toISOString()
    });
});


app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});


app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`TOH Backend Server running on port ${PORT}`);
});

module.exports = app;

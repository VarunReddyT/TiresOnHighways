# TOH Backend API

## Overview
Backend API for Tires On Highways (TOH) application built with Express.js, MongoDB, and Mongoose.

## Features
- User authentication (JWT)
- Tire image analysis integration with Flask API
- File upload handling
- Data analytics and statistics
- Feedback system
- Role-based access control (Admin, Toll Operator)

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Image Analysis**: Flask API integration

## Database Models

### User
- Username, password, role (admin/toll_operator)
- Toll plaza assignment for operators
- Account status and login tracking

### TollData
- Vehicle and user information
- Image data with analysis results
- Toll operator and plaza details
- Overall safety status

### GuestData
- Similar to TollData but for guest users
- IP address and user agent tracking
- No operator assignment

### Feedback
- User feedback with contact information
- Status tracking (pending/reviewed/resolved)
- Priority levels

## Flask API Integration

The backend integrates with a Flask API for tire image analysis:

- **Endpoint**: `POST /classify`
- **Expected URL**: `http://localhost:5000/classify`
- **Input**: FormData with image file
- **Output**: JSON with prediction and confidence

Example response:
```json
{
  "prediction": "normal", // or "cracked"
  "confidence": 0.85
}
```


## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Request size limits

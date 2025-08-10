# Tires On Highways (TOH)

A full-stack web application for intelligent tire safety monitoring and toll management, built with React, Node.js, Express, MongoDB, and Python (for AI/ML image analysis).

## Features

- **Role-based Authentication**: Admin, Toll Operator, and Guest access
- **Toll Data Management**: Upload, search, and review vehicle inspection records
- **Guest Data Search**: Public and admin search for vehicle safety status
- **Admin Dashboard**: User management, toll/guest data search, analytics
- **Statistics & Analytics**: Real-time and historical safety statistics, pie charts, and status breakdowns
- **Image Analysis**: Tire condition detection using AI/ML (Python backend)
- **Professional UI**: Modern, responsive design with Tailwind CSS and Lucide icons

## Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, MongoDB
- **AI/ML**: Python (Flask, MobileNet model)
- **Authentication**: JWT-based

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Python 3.8+ (for AI/ML backend)
- MongoDB

### 1. Clone the repository
```sh
git clone https://github.com/VarunReddyT/TiresOnHighways.git
cd TOH_Updated
```

### 2. Install dependencies
```sh
npm install
cd backend && npm install
```

### 3. Configure Environment
- Copy `.env.example` to `.env` in `backend/` and set your MongoDB URI and JWT secret.

### 4. Start the backend server
```sh
cd backend
node index.js
```

### 5. Start the frontend
```sh
cd ..
npm run dev
```

### 6. Start the AI/ML Flask server
```sh
cd flask
python main.py
```

## Usage
- **Admin**: Manage users, view analytics, search all data
- **Toll Operator**: Upload and review vehicle inspection records
- **Guest/Public**: Search vehicle safety status, view statistics

## License
[MIT](LICENSE)

---

**Team G81**
- Varun, Shiva, Charan, Deepak, Manoj, Gargey

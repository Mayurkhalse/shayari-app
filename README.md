# Shayari Application

A full-stack MERN (MongoDB, Express.js, React, Node.js) application designed for sharing, managing, and discovering Shayaris (a form of poetry).

## Architecture

This project is divided into two main architectural components:
- **shayari-backend**: A robust Node.js and Express.js REST API providing user authentication, Shayari management, and notification services.
- **shayari-frontend**: A responsive, modern React application built with Vite and Tailwind CSS for an optimal user experience.

## Key Features

- **User Authentication**: Secure registration and login using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Privacy Controls**: Users can toggle their account visibility between public and private modes.
- **Social Interaction**: Send follow requests, approve or reject followers, and manage a following network.
- **Shayari Management**: Create, read, update, and delete poetry posts.
- **Notifications**: Real-time management and display of user interactions and system notifications.

## Technology Stack

**Frontend:**
- React
- Vite
- React Router
- Axios
- Tailwind CSS

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT) & Bcryptjs

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB (running locally or a MongoDB Atlas URI)

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Mayurkhalse/shayari-app.git
cd shayari-app
```

### 2. Backend Setup

Navigate to the backend directory and install the necessary dependencies:

```bash
cd shayari-backend
npm install
```

Create a `.env` file in the `shayari-backend` directory with the following configuration:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shayariDB
JWT_SECRET=your_strong_jwt_secret_here
JWT_EXPIRES_IN=7d
```

Start the backend server:

```bash
npm start
```

The backend API will run on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal window, navigate to the frontend directory, and install the required dependencies:

```bash
cd shayari-frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The user interface will be accessible in your browser at `http://localhost:5173`.

## Development Guidelines

- **Linting**: The frontend uses ESLint. To check for code style issues, run `npm run lint` in the `shayari-frontend` directory.
- **Component Architecture**: Frontend components are strictly organized within the `src/components` directory to maintain modularity.
- **Coding Style**: The project enforces a consistent coding style through established ESLint configurations to ensure maintainability.

<div align="center">
  

  <h1>Shayari Application</h1>
  <p>A full-stack MERN application designed for sharing, managing, and discovering Shayaris (a form of poetry).</p>

  <div>
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  </div>
</div>

<hr />

## Table of Contents
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Development Guidelines](#development-guidelines)

## Architecture

This project is divided into two main architectural components to ensure separation of concerns and maintainability:

- **shayari-backend**: A robust Node.js and Express.js REST API providing user authentication, Shayari management, and notification services.
- **shayari-frontend**: A responsive, modern React application built with Vite and Tailwind CSS for an optimal user experience.

<br />

## Key Features

<table width="100%">
  <tr>
    <td width="50%">
      <h3>User Authentication</h3>
      <p>Secure registration and login using JWT (JSON Web Tokens) and bcrypt password hashing.</p>
    </td>
    <td width="50%">
      <h3>Privacy Controls</h3>
      <p>Users can seamlessly toggle their account visibility between public and private modes to control their audience.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>Social Interaction</h3>
      <p>Send follow requests, approve or reject followers, and manage a following network with ease.</p>
    </td>
    <td width="50%">
      <h3>Shayari Management</h3>
      <p>Create, read, update, and delete poetry posts in a user-friendly interface.</p>
    </td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <h3>Notifications</h3>
      <p>Real-time management and display of user interactions and system notifications.</p>
    </td>
  </tr>
</table>

<br />

## Technology Stack

The application leverages a modern technology stack to deliver a fast and scalable experience.

### Frontend
*   **React**: UI Library
*   **Vite**: Build Tool
*   **React Router**: Navigation
*   **Axios**: HTTP Client
*   **Tailwind CSS**: Styling

### Backend
*   **Node.js**: Runtime Environment
*   **Express.js**: Web Framework
*   **MongoDB & Mongoose**: Database & ORM
*   **JSON Web Tokens & Bcryptjs**: Security

<br />

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
*   **Node.js** (v14 or higher)
*   **npm** (Node Package Manager)
*   **MongoDB** (running locally or a MongoDB Atlas URI)

<br />

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
*The backend API will run on `http://localhost:5000`.*

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
*The user interface will be accessible in your browser at `http://localhost:5173`.*

<br />

## Development Guidelines

- **Linting**: The frontend uses ESLint. To check for code style issues, run `npm run lint` in the `shayari-frontend` directory.
- **Component Architecture**: Frontend components are strictly organized within the `src/components` directory to maintain modularity.
- **Coding Style**: The project enforces a consistent coding style through established ESLint configurations to ensure maintainability.

<hr />
<div align="center">
  <p>Built with passion and dedication</p>
</div>

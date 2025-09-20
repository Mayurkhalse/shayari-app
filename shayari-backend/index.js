// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();

// ✅ Middleware
app.use(cors(
  {
    origin: "http://localhost:5173",  // your frontend URL
    credentials: true                 // allow cookies/authorization headers
  }
));
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/shayariDB')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ✅ Routes
const authRoutes = require('./routes/user');
const shayariRoutes = require('./routes/shayari');
const notificationRoutes = require('./routes/notification');
app.use('/api/user', authRoutes);
app.use('/api/shayari', shayariRoutes);
app.use('/api/notifications', notificationRoutes);
// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

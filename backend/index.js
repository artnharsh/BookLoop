const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const http = require('http');
const initSocket = require('./sockets/chatSocket');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express
const app = express();

// Body parser & CORS middleware
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

// Basic health check route
app.get('/', (req, res) => {
  res.send('BookLoop API is running...');
});

// We will mount routes here in later steps
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/listings', require('./routes/listingRoutes'));
// etc...
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));


app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));


// Making the uploads folder publicly accessible via URL
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
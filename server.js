const express = require('express');
const cors = require('cors');
require('dotenv').config();

const bookingRoutes = require('./routes/bookings');
const roomRoutes = require('./routes/rooms');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/rooms', roomRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`-- SERVER v1.1 RUNNING ON PORT ${PORT} --`);
}); 
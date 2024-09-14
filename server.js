const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { auth } = require('express-openid-connect');
require('dotenv').config();

const app = express();
const port = 3000;

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth0 middleware
app.use(auth({
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
}));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Route to serve the profile page
app.get('/profile', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.sendFile(path.join(__dirname, 'public', 'profile.html'));
    } else {
        res.redirect('/');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

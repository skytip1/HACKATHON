const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');

// Replace with your Google Places API key from your .env file
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Function to calculate similarity based on predefined rules
function calculateSimilarity(user1, user2) {
    let score = 0;
    
    // Example rules
    if (user1.location === user2.location) score += 30;
    if (Math.abs(user1.income - user2.income) < 5000) score += 20;
    if (user1.studentStatus === user2.studentStatus) score += 10;
    if (user1.roommates === user2.roommates) score += 10;
    
    return score;
}

// Function to find best matches
function findBestMatches(user, allUsers) {
    return allUsers.map(otherUser => ({
        user: otherUser,
        score: calculateSimilarity(user, otherUser)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Top 3 matches
}

// Route to find apartments based on user ID
router.get('/find-apartments/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { location, salary } = user;

        // Convert address to coordinates using Google Geocoding API
        const geocodeResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: location,
                key: API_KEY
            }
        });

        console.log('Geocode Response:', geocodeResponse.data); // Log geocode response

        const geocodeResults = geocodeResponse.data.results;

        if (!geocodeResults || geocodeResults.length === 0) {
            return res.status(404).json({ message: 'Could not find location for the given address' });
        }

        const { lat, lng } = geocodeResults[0]?.geometry?.location;
        if (!lat || !lng) {
            return res.status(404).json({ message: 'Invalid location coordinates' });
        }

        // Find nearby apartments using Google Places API
        const placesResponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
            params: {
                location: `${lat},${lng}`,
                radius: 5000,
                keyword: 'apartment',
                key: API_KEY
            }
        });

        console.log('Places Response:', placesResponse.data); // Log places response

        const apartments = placesResponse.data.results;

        // Find best matching users
        const allUsers = await User.find({ _id: { $ne: userId } }); // Exclude current user
        const bestMatches = findBestMatches(user, allUsers);

        res.json({ apartments: apartments.slice(0, 3), users: bestMatches.map(match => match.user).slice(0, 3) });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ message: 'Error fetching apartments and users' });
    }
});
// Route to get user profile by Auth0 ID
router.get('/profile', async (req, res) => {
    const auth0Id = req.oidc.user.sub;  // Auth0 ID from the authenticated user

    try {
        const user = await User.findOne({ auth0Id });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

// Route to get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();  // Fetch all users
        res.json(users);  // Return users as JSON
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Error fetching users' });
    }
});
// routes/users.js (New user creation logic)

router.post('/', async (req, res) => {
    const { income, studentStatus, roommates, location, job, salary } = req.body;

    try {
        const newUser = new User({
            auth0Id: req.oidc.user.sub,  // Auth0 user ID
            income,
            studentStatus,
            roommates,
            location,
            job,
            salary
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ message: 'Error creating user' });
    }
});


// Route to create a new user
router.post('/', async (req, res) => {
    const { name, income, studentStatus, roommates, location, job, salary } = req.body;

    try {
        const newUser = new User({
            name,  // Include name field
            income,
            studentStatus,
            roommates,
            location,
            job,
            salary
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ message: 'Error creating user' });
    }
});

module.exports = router;

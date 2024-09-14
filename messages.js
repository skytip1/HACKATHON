const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to send a message to another user
router.post('/send', async (req, res) => {
    const { senderId, recipientId, message } = req.body;

    try {
        const recipient = await User.findById(recipientId);
        const sender = await User.findById(senderId);

        if (!recipient || !sender) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Placeholder for sending message (e.g., email, internal messaging)
        console.log(`Message from ${sender.name} (${sender.email}) to ${recipient.name} (${recipient.email}): ${message}`);

        // Respond with success
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error.message);
        res.status(500).json({ message: 'Error sending message' });
    }
});

module.exports = router;

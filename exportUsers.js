const mongoose = require('mongoose');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const User = require('./models/User'); // Adjust path if necessary

// MongoDB connection
mongoose.connect('mongodb://localhost/college-apartment-finder', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('MongoDB connected');

    // Fetch all users from the database
    const users = await User.find();

    // Create a CSV writer
    const csvWriter = createCsvWriter({
        path: 'UsersData.csv',
        header: [
            { id: 'location', title: 'Location' },
            { id: 'income', title: 'Income' }
        ]
    });

    // Write user data to the CSV file
    await csvWriter.writeRecords(users.map(user => ({
        location: user.location,
        income: user.income
    })));

    console.log('CSV file created successfully.');

    // Close the MongoDB connection
    mongoose.connection.close();
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

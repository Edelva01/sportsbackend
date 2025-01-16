const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection URL
const uri = 'mongodb+srv://eloidelva:IWKlIiMkw5jLTmpn@cluster0.ofujo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB URI
const dbName = 'sportsSignup';
let db;

(async () => {
    try {
        const client = new MongoClient(uri);
        await client.connect(); // Ensure the connection is completed
        db = client.db(dbName); // Initialize the database reference
        console.log(`Connected to database: ${dbName}`);

        // Start the server only after successful DB connection
        app.listen(port, () => {
            console.log(`Server is running on https://sportsbackend-6dsr.onrender.com/api/signups`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1); // Exit the process if the connection fails
    }
})();

// API Endpoint
app.post('/api/signup', async (req, res) => {
    try {
        const { playerName, teamName, shirtNumber, nextGame } = req.body;
        console.log(playerName, teamName, shirtNumber, nextGame);

        if (!db) {
            throw new Error('Database connection is not initialized.');
        }

        const data = {
            playerName,
            team: teamName,
            shirtNumber,
            nextGame: new Date(nextGame)
        };

        const result = await db.collection('signups').insertOne(data);

        res.status(201).json({ message: 'Player signed up successfully!', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while signing up the player.' });
    }
});

// Get all signups
app.get('/api/signups', async (req, res) => {
    try {
        if (!db) {
            throw new Error('Database connection is not initialized.');
        }

        const signups = await db.collection('signups').find().toArray();
        res.status(200).json(signups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching signups.' });
    }
});

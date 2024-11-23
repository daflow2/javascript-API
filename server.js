const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;
const path = require('path');


// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch root requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

// Middleware
app.use(cors()); // Enable cross-origin requests
app.use(bodyParser.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'users', // Replace with your database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else { 
        console.log('Connected to the MySQL database.');
    }
});

// Route to save user details
app.post('/submit', (req, res) => {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
        return res.status(400).send('Name and email are required.');
    }

    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.query(query, [name, email], (err, result) => {
        if (err) {
            console.error('Error saving details:', err);
            res.status(500).send('Failed to save details.');
        } else {
            res.send('Details saved successfully!');
        }
    }); 
});



// server.js dependencies
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Set up port and temp in-memory user store
const app = express();
const PORT = 4000;
const users = [];

// Middleware for parsing request bodies
app.use(bodyParser.json());

// Routes

// Log-in Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Check Password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: 'Invalid username or password'});
    }

    // Create a JWT token
    const token = jwt.sign({ username: user.username }, 'secretkey', { expiresIn: '1hr'});

    // Render dashboard
    res.status(200).json({ message: 'Login Successful', token});
});

// Render sign-up page
app.get('/signup', async (req, res) => {
    res.render('signup')
});

// Handle sign-up form submission
app.post('/signup', async (req, res) => {
    const { email, username, password, confirmPassword } = req.body;

// Basic validation
if (!email || !username || !password !== confirmPassword) {
    return res.status(400).json({ message : 'Invalid input. Please try again.' });
}

//Check if username or email already exists
const existingUser = users.find(user => user.username === username || user.email === email);
if (existingUser) {
    return res.status(400).json({ message : 'Username or email already taken.' });
}

//Hash the password
const hashedPassword = await bcrypt.hash(password, 10);

// Store user data
users.push({ email, username, password: hashedPassword });
res.status(201).json({ message: 'User registered successfully. Please log in.' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// server.js dependencies

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ejs = require('ejs')

// Set up port and temp in-memory user store

const app = express();
const PORT = 4000;
const users = [];

// Set up EJS as templating engine
app.set('view engine', 'ejs');

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

// Routes

// Home route (temp redirct to login)
app.get('/', (req, res) => {
    res.sender('login');
});

// Render login page
app.get('login', (req, res) => {
    res.sender('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.render('login', { message: 'Invalid username or password.' });
    }

    // Check Password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.render('login', { message: 'Invalid username or password'});
    }

    // Create a JWT token
    const token = jwt.sign({ username: user.username }, 'secretkey', { expiresIn: '1hr'});

    // Render dashboard
    res.render('dashboard', {username: user.username });
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
    return res.render('signup', { message : 'Invalid input. Please try again.' });
}

//Check if username or email already exists
const existingUser = users.find(user => user.username === username || user.email === email);
if (existingUser) {
    return res.render('signup', { message : 'Username or email already taken.' });
}

//Hash the password
const hashedPassword = await bcrypt.hash(password, 10);

// Store user data
users.push({ email, username, password: hashedPassword });
res.render('login', { message: 'User registered successfully. Please log in.' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

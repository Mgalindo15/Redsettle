// server.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 4000;

app.use(bodyParser.json());

let highScores = [];

app.get('/', (req, res) => {
    res.send('Hi There');
});

app.post('/save-score', (req, res) => {
    const { username, score } = req.body;

    highScores.push({ username, score });

    if (username && score) {
        res.status(200).json({ message: `Score saved for ${username} with ${score} points.` });
    } else {
        res.status(400).json({ message: 'Invalid data received.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


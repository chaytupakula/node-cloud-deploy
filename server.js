const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

app.use(express.json());

const SECRET_KEY = "mysecretkey";

// Sample user
const user = {
    id: 1,
    username: "admin",
    password: "1234"
};

// Login route
app.post('/login', (req, res) => {

    const { username, password } = req.body;

    if (username === user.username && password === user.password) {

        const token = jwt.sign(
            { id: user.id, username: user.username },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({ token });

    } else {
        res.status(401).send("Invalid credentials");
    }
});

// Middleware to verify token
function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Protected route
app.get('/profile', authenticateToken, (req, res) => {
    res.json({
        message: "Welcome to protected route",
        user: req.user
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
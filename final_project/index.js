const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session management
app.use(session({
    secret: 'fingerprint_customer',
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the user has a session and a token
    if (req.session && req.session.token) {
        try {
            // Verify the JWT token
            const decoded = jwt.verify(req.session.token, 'your_jwt_secret_key');
            req.user = decoded; // Attach the user info to the request object
            next(); // Continue to the next middleware or route handler
        } catch (err) {
            // Token is invalid
            res.status(401).json({ message: 'Unauthorized' });
        }
    } else {
        // No token present
        res.status(401).json({ message: 'Unauthorized' });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

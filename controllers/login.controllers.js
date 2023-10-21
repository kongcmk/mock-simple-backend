const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Username not found' });
        }

        if (user.deactivated === true) { // Check if user.deactivated is equal to true
            throw res.status(401).json({ error: 'User was deleted' });
        }

        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            user.last_login = new Date();
            await user.save();

            const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);
            res.json({ user, token });
        } else {
            return res.status(401).json({ error: 'Username or password is incorrect' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login Error' });
    }
};

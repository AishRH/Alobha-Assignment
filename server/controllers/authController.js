const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    if (role === 'admin') {
        return res.status(403).json({ message: 'Cannot register as admin directly' });
    }

    const user = await User.create({
        username,
        password,
        role: role || 'user' // Default to 'user' if no role is provided
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
};

module.exports = { registerUser, loginUser };

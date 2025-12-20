const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User'); // Import User model
const bcrypt = require('bcryptjs'); // Import bcryptjs

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB Connected');
    seedAdminUser(); // Call the function to seed admin user
})
.catch(err => console.log(err));

// Function to seed admin user
const seedAdminUser = async () => {
    try {
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminUsername || !adminPassword) {
            console.warn('ADMIN_USERNAME or ADMIN_PASSWORD not set in .env. Skipping admin user seeding.');
            return;
        }

        const adminExists = await User.findOne({ username: adminUsername });

        if (!adminExists) {
            await User.create({
                username: adminUsername,
                password: adminPassword,
                role: 'admin',
            });
            console.log('Admin user seeded successfully!');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    phone: { type: String, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    jobRole: { type: String, required: true },
    profilePhoto: { type: String }, // Path to the uploaded file
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);

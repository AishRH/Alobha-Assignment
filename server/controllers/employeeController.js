const Employee = require('../models/Employee');
const fs = require('fs');
const path = require('path');

const getEmployees = async (req, res) => {
    try {
        const pageSize = 5;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};
        
        const departmentFilter = req.query.department ? { department: req.query.department } : {};

        const count = await Employee.countDocuments({ ...keyword, ...departmentFilter });
        const employees = await Employee.find({ ...keyword, ...departmentFilter })
            .populate('department', 'name')
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ employees, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEmployee = async (req, res) => {
    const { name, email, phone, department, jobRole } = req.body;
    const profilePhoto = req.file ? req.file.path.replace(/\\/g, "/") : null;

    // Basic Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!name || !phone || !department || !jobRole) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const employee = new Employee({
            name,
            email,
            phone,
            department,
            jobRole,
            profilePhoto
        });

        const createdEmployee = await employee.save();
        res.status(201).json(createdEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateEmployee = async (req, res) => {
    const { name, email, phone, department, jobRole } = req.body;
    
    // Basic Validation
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
    }

    try {
        const employee = await Employee.findById(req.params.id);

        if (employee) {
            employee.name = name || employee.name;
            employee.email = email || employee.email;
            employee.phone = phone || employee.phone;
            employee.department = department || employee.department;
            employee.jobRole = jobRole || employee.jobRole;
            
            if (req.file) {
                // Delete old photo if exists
                if (employee.profilePhoto) {
                    fs.unlink(employee.profilePhoto, (err) => {
                        if (err) console.error(err);
                    });
                }
                employee.profilePhoto = req.file.path.replace(/\\/g, "/");
            }

            const updatedEmployee = await employee.save();
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (employee) {
            if (employee.profilePhoto) {
                fs.unlink(employee.profilePhoto, (err) => {
                    if (err) console.error(err);
                });
            }
            await employee.deleteOne();
            res.json({ message: 'Employee removed' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee };

const Department = require('../models/Department');

const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createDepartment = async (req, res) => {
    const { name, description } = req.body;
    try {
        const department = new Department({ name, description });
        const createdDepartment = await department.save();
        res.status(201).json(createdDepartment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (department) {
            department.name = req.body.name || department.name;
            department.description = req.body.description || department.description;
            const updatedDepartment = await department.save();
            res.json(updatedDepartment);
        } else {
            res.status(404).json({ message: 'Department not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (department) {
            await department.deleteOne();
            res.json({ message: 'Department removed' });
        } else {
            res.status(404).json({ message: 'Department not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment };

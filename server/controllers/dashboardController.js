const Employee = require('../models/Employee');
const Department = require('../models/Department');

const getDashboardStats = async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        const totalDepartments = await Department.countDocuments();

        const departmentDistribution = await Employee.aggregate([
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'department',
                },
            },
            {
                $unwind: '$department',
            },
            {
                $project: {
                    _id: 1,
                    name: '$department.name',
                    count: 1,
                },
            },
        ]);

        res.json({
            totalEmployees,
            totalDepartments,
            departmentDistribution,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };

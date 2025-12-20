import { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalDepartments: 0,
        departmentDistribution: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/dashboard/stats');
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="text-xl mb-2">Welcome, {user?.username.split('@')[0]}!</h2>
                <p>Role: <span className="font-bold uppercase text-blue-600">{user?.role}</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-100 p-6 rounded shadow flex flex-col items-center">
                    <h3 className="text-lg font-bold mb-2">Total Employees</h3>
                    <p className="text-4xl font-bold text-blue-600">{stats.totalEmployees}</p>
                    <Link to="/employees" className="mt-4 text-blue-500 hover:underline">Manage Employees</Link>
                </div>
                <div className="bg-green-100 p-6 rounded shadow flex flex-col items-center">
                    <h3 className="text-lg font-bold mb-2">Total Departments</h3>
                    <p className="text-4xl font-bold text-green-600">{stats.totalDepartments}</p>
                    <Link to="/departments" className="mt-4 text-green-500 hover:underline">Manage Departments</Link>
                </div>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-xl font-bold mb-4">Employee Distribution by Department</h3>
                {stats.departmentDistribution.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="py-2 px-4 border-b text-left">Department</th>
                                    <th className="py-2 px-4 border-b text-center">Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.departmentDistribution.map((dept) => (
                                    <tr key={dept._id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{dept.name}</td>
                                        <td className="py-2 px-4 border-b text-center">{dept.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">No data available.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

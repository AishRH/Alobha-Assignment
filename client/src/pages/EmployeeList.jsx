import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const EmployeeList = () => {
    const { user } = useContext(AuthContext);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [page, keyword, departmentFilter]);

    const fetchDepartments = async () => {
        try {
            const { data } = await api.get('/departments');
            setDepartments(data);
        } catch (error) {
            console.error('Failed to fetch departments');
        }
    };

    const fetchEmployees = async () => {
        try {
            const { data } = await api.get(`/employees?pageNumber=${page}&keyword=${keyword}&department=${departmentFilter}`);
            setEmployees(data.employees);
            setPages(data.pages);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch employees');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await api.delete(`/employees/${id}`);
                setEmployees(employees.filter(emp => emp._id !== id));
                toast.success('Employee deleted');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Delete failed');
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchEmployees();
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-2xl font-bold">Employees</h1>
                {user?.role === 'admin' && (
                    <Link to="/employees/add" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Add Employee
                    </Link>
                )}
            </div>

            <div className="bg-white p-4 rounded shadow mb-4 flex flex-col md:flex-row gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="p-2 border rounded w-full md:w-1/3"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <select
                    className="p-2 border rounded w-full md:w-1/4"
                    value={departmentFilter}
                    onChange={(e) => {
                        setDepartmentFilter(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                </select>
            </div>

            {loading ? <div>Loading...</div> : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 border-b">Photo</th>
                                    <th className="py-2 px-4 border-b">Name</th>
                                    <th className="py-2 px-4 border-b">Email</th>
                                    <th className="py-2 px-4 border-b">Department</th>
                                    <th className="py-2 px-4 border-b">Job Role</th>
                                    {user?.role === 'admin' && <th className="py-2 px-4 border-b">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp._id} className="text-center">
                                        <td className="py-2 px-4 border-b flex justify-center">
                                            {emp.profilePhoto ? (
                                                <img src={`http://localhost:5000/${emp.profilePhoto}`} alt={emp.name} className="h-10 w-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">N/A</div>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b">{emp.name}</td>
                                        <td className="py-2 px-4 border-b">{emp.email}</td>
                                        <td className="py-2 px-4 border-b">{emp.department?.name || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">{emp.jobRole}</td>
                                        {user?.role === 'admin' && (
                                            <td className="py-2 px-4 border-b">
                                                <Link to={`/employees/edit/${emp._id}`} className="text-blue-500 mr-2 hover:underline">Edit</Link>
                                                <button onClick={() => handleDelete(emp._id)} className="text-red-500 hover:underline">Delete</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pages > 1 && (
                        <div className="flex justify-center mt-4 gap-2">
                            {[...Array(pages).keys()].map(x => (
                                <button
                                    key={x + 1}
                                    onClick={() => setPage(x + 1)}
                                    className={`px-3 py-1 rounded ${page === x + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                >
                                    {x + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default EmployeeList;

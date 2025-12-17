import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const DepartmentList = () => {
    const { user } = useContext(AuthContext);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState({ name: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const { data } = await api.get('/departments');
            setDepartments(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch departments');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/departments/${id}`);
                setDepartments(departments.filter(dept => dept._id !== id));
                toast.success('Department deleted');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Delete failed');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const { data } = await api.put(`/departments/${currentDepartment._id}`, currentDepartment);
                setDepartments(departments.map(dept => dept._id === data._id ? data : dept));
                toast.success('Department updated');
            } else {
                const { data } = await api.post('/departments', currentDepartment);
                setDepartments([...departments, data]);
                toast.success('Department created');
            }
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const openModal = (dept = { name: '', description: '' }) => {
        setCurrentDepartment(dept);
        setIsEditing(!!dept._id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentDepartment({ name: '', description: '' });
        setIsEditing(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Departments</h1>
                {user?.role === 'admin' && (
                    <button onClick={() => openModal()} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Add Department
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Description</th>
                            {user?.role === 'admin' && <th className="py-2 px-4 border-b">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((dept) => (
                            <tr key={dept._id} className="text-center">
                                <td className="py-2 px-4 border-b">{dept.name}</td>
                                <td className="py-2 px-4 border-b">{dept.description}</td>
                                {user?.role === 'admin' && (
                                    <td className="py-2 px-4 border-b">
                                        <button onClick={() => openModal(dept)} className="text-blue-500 mr-2 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(dept._id)} className="text-red-500 hover:underline">Delete</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Department' : 'Add Department'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={currentDepartment.name}
                                    onChange={(e) => setCurrentDepartment({ ...currentDepartment, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Description</label>
                                <textarea
                                    className="w-full p-2 border rounded"
                                    value={currentDepartment.description}
                                    onChange={(e) => setCurrentDepartment({ ...currentDepartment, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentList;

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const EmployeeForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [department, setDepartment] = useState('');
    const [jobRole, setJobRole] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    useEffect(() => {
        fetchDepartments();
        if (isEdit) {
            fetchEmployee();
        }
    }, [id]);

    const fetchDepartments = async () => {
        try {
            const { data } = await api.get('/departments');
            setDepartments(data);
        } catch (error) {
            toast.error('Failed to fetch departments');
        }
    };

    const fetchEmployee = async () => {
        try {
            const { data } = await api.get(`/employees/${id}`);
            setName(data.name);
            setEmail(data.email);
            setPhone(data.phone);
            setDepartment(data.department);
            setJobRole(data.jobRole);
            if (data.profilePhoto) {
                setPreview(`http://localhost:5000/${data.profilePhoto}`);
            }
        } catch (error) {
            toast.error('Failed to fetch employee details');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePhoto(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('department', department);
        formData.append('jobRole', jobRole);
        if (profilePhoto) {
            formData.append('profilePhoto', profilePhoto);
        }

        try {
            if (isEdit) {
                await api.put(`/employees/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Employee updated');
            } else {
                await api.post('/employees', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Employee added');
            }
            navigate('/employees');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 flex justify-center">
            <div className="w-full max-w-lg bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Phone</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Department</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Job Role</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={jobRole}
                            onChange={(e) => setJobRole(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Profile Photo</label>
                        <input
                            type="file"
                            className="w-full p-2 border rounded"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        {preview && (
                            <div className="mt-2">
                                <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded" />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/employees')}
                            className="w-1/2 bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-1/2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeForm;

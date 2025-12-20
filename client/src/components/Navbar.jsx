import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">EMS</Link>
                <div>
                    {user ? (
                        <div className="flex gap-4 items-center">
                            <Link to="/" className="hover:text-gray-300">Dashboard</Link>
                            <Link to="/employees" className="hover:text-gray-300">Employees</Link>
                            <Link to="/departments" className="hover:text-gray-300">Departments</Link>
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded">Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

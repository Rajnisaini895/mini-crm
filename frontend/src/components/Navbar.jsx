import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="text-xl font-bold tracking-tight hover:text-indigo-200 transition-colors">
            🎯 Mini CRM
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/opportunities/new"
              className="bg-white text-indigo-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              + New Opportunity
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm text-indigo-200 hidden sm:block">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm bg-indigo-800 hover:bg-indigo-900 px-3 py-1.5 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

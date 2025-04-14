// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, ChevronDown, Home } from 'lucide-react';
import { useState } from 'react';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (!currentUser) return null;

  return (
    <nav className="fixed mx-auto w-full z-10 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                Nasab Online
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900"
              >
                <Home className="mr-1" size={18} />
                Dashboard
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
                >
                  {currentUser.photoURL ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={currentUser.photoURL}
                      alt="User profile"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center">
                      <User size={18} className="text-blue-600" />
                    </div>
                  )}
                  <ChevronDown size={16} className="ml-1 mt-2 text-gray-500" />
                </button>
              </div>
              {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                  <div className="py-1 bg-white rounded-md shadow-xs">
                    <div className="block px-4 py-3 text-sm text-gray-700 border-b">
                      {currentUser.displayName || currentUser.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center  w-full px-4 py-3 text-sm text-red-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
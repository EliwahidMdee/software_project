/**
 * Navbar Component
 * 
 * Top navigation bar that appears on all pages.
 * Displays user information and logout button.
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getInitials } from '../../utils/helpers';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-600">
              Rental Management System
            </h1>
          </div>
          
          {/* User menu */}
          <div className="flex items-center space-x-4">
            {/* User info */}
            <div className="flex items-center space-x-3">
              {/* User avatar */}
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-600 text-white font-semibold">
                {user?.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt={user.username}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span>{getInitials(user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username)}</span>
                )}
              </div>
              
              {/* User name and role */}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user?.username}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

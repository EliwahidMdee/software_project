/**
 * Sidebar Component
 * 
 * Side navigation menu that appears on all authenticated pages.
 * Shows different menu items based on user role.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  
  // Define menu items for different user roles
  const menuItems = {
    admin: [
      { path: '/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/properties', icon: '🏢', label: 'Properties' },
      { path: '/units', icon: '🏠', label: 'Units' },
      { path: '/tenants', icon: '👥', label: 'Tenants' },
      { path: '/leases', icon: '📝', label: 'Leases' },
      { path: '/payments', icon: '💰', label: 'Payments' },
      { path: '/expenses', icon: '💸', label: 'Expenses' },
      { path: '/documents', icon: '📄', label: 'Documents' },
      { path: '/notifications', icon: '🔔', label: 'Notifications' },
      { path: '/users', icon: '👤', label: 'Users' },
    ],
    landlord: [
      { path: '/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/properties', icon: '🏢', label: 'My Properties' },
      { path: '/units', icon: '🏠', label: 'Units' },
      { path: '/tenants', icon: '👥', label: 'Tenants' },
      { path: '/leases', icon: '📝', label: 'Leases' },
      { path: '/payments', icon: '💰', label: 'Payments' },
      { path: '/expenses', icon: '💸', label: 'Expenses' },
      { path: '/documents', icon: '📄', label: 'Documents' },
      { path: '/notifications', icon: '🔔', label: 'Notifications' },
    ],
    tenant: [
      { path: '/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/my-lease', icon: '📝', label: 'My Lease' },
      { path: '/payments', icon: '💰', label: 'My Payments' },
      { path: '/notifications', icon: '🔔', label: 'Notifications' },
      { path: '/documents', icon: '📄', label: 'Documents' },
    ],
  };
  
  // Get menu items for current user's role
  const items = menuItems[user?.role] || [];
  
  return (
    <aside className="w-64 bg-gray-800 min-h-screen">
      <div className="py-6">
        {/* Menu items */}
        <nav className="space-y-1 px-3">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

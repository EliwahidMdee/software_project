/**
 * Tenants Page
 * 
 * This page manages tenant information and profiles.
 * Tenants are individuals who rent units from landlords.
 * Landlords and admins can view and manage tenant details.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAll, create, update, remove } from '../services/api';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Tenants = () => {
  // Get current authenticated user
  const { user } = useAuth();
  
  // State management for tenants data and UI
  const [tenants, setTenants] = useState([]);           // List of all tenants
  const [users, setUsers] = useState([]);                // List of tenant users for dropdown
  const [loading, setLoading] = useState(true);         // Initial loading state
  const [showModal, setShowModal] = useState(false);    // Modal visibility
  const [editingTenant, setEditingTenant] = useState(null); // Tenant being edited
  const [searchTerm, setSearchTerm] = useState('');     // Search filter
  
  /**
   * Fetch tenants and users when component mounts
   */
  useEffect(() => {
    fetchTenants();
    fetchUsers();
  }, []);
  
  /**
   * Fetch all tenants from the API
   * Gets tenant profiles with associated user information
   */
  const fetchTenants = async () => {
    try {
      const data = await getAll('tenants');
      setTenants(data.results || data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast.error('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Fetch all users to populate dropdown
   * Only users with 'tenant' role should be shown
   */
  const fetchUsers = async () => {
    try {
      const data = await getAll('users');
      // Filter to show only users with tenant role
      const tenantUsers = (data.results || data).filter(u => u.role === 'tenant');
      setUsers(tenantUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  /**
   * Open modal to add a new tenant
   */
  const handleAddNew = () => {
    setEditingTenant(null);
    setShowModal(true);
  };
  
  /**
   * Open modal to edit an existing tenant
   * @param {Object} tenant - The tenant to edit
   */
  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setShowModal(true);
  };
  
  /**
   * Delete a tenant after confirmation
   * @param {number} id - The tenant ID
   * @param {string} name - The tenant name for confirmation dialog
   */
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete tenant "${name}"?`)) {
      try {
        await remove('tenants', id);
        toast.success('Tenant deleted successfully');
        fetchTenants();
      } catch (error) {
        console.error('Error deleting tenant:', error);
        toast.error('Failed to delete tenant');
      }
    }
  };
  
  /**
   * Close modal and clear editing state
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTenant(null);
  };
  
  /**
   * Handle successful save from form
   */
  const handleSaveSuccess = () => {
    handleCloseModal();
    fetchTenants();
  };
  
  /**
   * Get user information by user ID
   * Helper to display user details in the table
   * @param {number} userId - The user ID
   * @returns {Object|null} User object or null
   */
  const getUserInfo = (userId) => {
    return users.find(u => u.id === userId) || null;
  };
  
  /**
   * Filter tenants based on search term
   * Searches in name, phone, email, and ID number
   */
  const filteredTenants = tenants.filter(tenant => {
    const userInfo = getUserInfo(tenant.user);
    const searchLower = searchTerm.toLowerCase();
    
    return (
      (userInfo?.username || '').toLowerCase().includes(searchLower) ||
      (userInfo?.first_name || '').toLowerCase().includes(searchLower) ||
      (userInfo?.last_name || '').toLowerCase().includes(searchLower) ||
      (userInfo?.email || '').toLowerCase().includes(searchLower) ||
      (tenant.phone || '').toLowerCase().includes(searchLower) ||
      (tenant.identification_number || '').toLowerCase().includes(searchLower)
    );
  });
  
  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenants</h1>
          <p className="text-gray-600 mt-1">
            Manage tenant profiles and information
          </p>
        </div>
        {/* Only admins and landlords can add tenants */}
        {(user?.role === 'admin' || user?.role === 'landlord') && (
          <Button onClick={handleAddNew}>
            + Add Tenant
          </Button>
        )}
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="Search tenants by name, email, phone, or ID number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Tenants List or Empty State */}
      {filteredTenants.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tenants found</p>
            {(user?.role === 'admin' || user?.role === 'landlord') && (
              <Button onClick={handleAddNew} className="mt-4">
                Add Your First Tenant
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((tenant) => (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
              userInfo={getUserInfo(tenant.user)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={user?.role === 'admin' || user?.role === 'landlord'}
            />
          ))}
        </div>
      )}
      
      {/* Add/Edit Tenant Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
        size="lg"
      >
        <TenantForm
          tenant={editingTenant}
          users={users}
          onSuccess={handleSaveSuccess}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

/**
 * Tenant Card Component
 * 
 * Displays individual tenant information in a card format
 * Shows user details, contact info, and emergency contact
 * 
 * @param {Object} props
 * @param {Object} props.tenant - Tenant data
 * @param {Object} props.userInfo - Associated user information
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @param {boolean} props.canEdit - Whether user can edit/delete
 */
const TenantCard = ({ tenant, userInfo, onEdit, onDelete, canEdit }) => {
  // Get full name or fallback to username
  const displayName = userInfo 
    ? `${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim() || userInfo.username
    : 'Unknown User';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Card Header with User Icon */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
        <div className="flex items-center">
          <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
            <span className="text-3xl">👤</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{displayName}</h3>
            <p className="text-sm text-primary-100">
              @{userInfo?.username || 'N/A'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Card Body with Contact Information */}
      <div className="p-4">
        {/* Email */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 uppercase">Email</p>
          <p className="text-sm text-gray-900">{userInfo?.email || 'N/A'}</p>
        </div>
        
        {/* Primary Phone */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 uppercase">Phone</p>
          <p className="text-sm text-gray-900">📞 {tenant.phone || 'N/A'}</p>
        </div>
        
        {/* Alternative Phone (if available) */}
        {tenant.alternative_phone && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 uppercase">Alternative Phone</p>
            <p className="text-sm text-gray-900">📱 {tenant.alternative_phone}</p>
          </div>
        )}
        
        {/* Identification Information */}
        {tenant.identification_type && tenant.identification_number && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 uppercase">
              {tenant.identification_type}
            </p>
            <p className="text-sm text-gray-900">{tenant.identification_number}</p>
          </div>
        )}
        
        {/* Emergency Contact (if available) */}
        {tenant.emergency_contact_name && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 uppercase mb-1">Emergency Contact</p>
            <p className="text-sm font-medium text-gray-900">
              {tenant.emergency_contact_name}
            </p>
            {tenant.emergency_contact_phone && (
              <p className="text-sm text-gray-600">
                📞 {tenant.emergency_contact_phone}
              </p>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        {canEdit && (
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(tenant)}
              className="flex-1"
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete(tenant.id, displayName)}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Tenant Form Component
 * 
 * Form for creating or editing tenant profiles.
 * Collects personal info, contact details, and emergency contact.
 * 
 * @param {Object} props
 * @param {Object} props.tenant - Tenant being edited (null for new)
 * @param {Array} props.users - List of tenant users for dropdown
 * @param {Function} props.onSuccess - Success callback
 * @param {Function} props.onCancel - Cancel callback
 */
const TenantForm = ({ tenant, users, onSuccess, onCancel }) => {
  // Initialize form with existing data or defaults
  const [formData, setFormData] = useState({
    user: tenant?.user || '',
    phone: tenant?.phone || '',
    alternative_phone: tenant?.alternative_phone || '',
    identification_type: tenant?.identification_type || '',
    identification_number: tenant?.identification_number || '',
    emergency_contact_name: tenant?.emergency_contact_name || '',
    emergency_contact_phone: tenant?.emergency_contact_phone || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  /**
   * Handle input changes
   * Updates form state and clears field-specific errors
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  /**
   * Validate form before submission
   * Checks required fields and format
   */
  const validateForm = () => {
    const newErrors = {};
    
    // User is required for new tenants
    if (!tenant && !formData.user) {
      newErrors.user = 'User is required';
    }
    
    // Phone is required
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Handle form submission
   * Creates or updates tenant via API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (tenant) {
        // Update existing tenant
        await update('tenants', tenant.id, formData);
        toast.success('Tenant updated successfully');
      } else {
        // Create new tenant
        await create('tenants', formData);
        toast.success('Tenant created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving tenant:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      }
      toast.error('Failed to save tenant');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* User Selection (only for new tenants) */}
      {!tenant && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User Account <span className="text-red-500">*</span>
          </label>
          <select
            name="user"
            value={formData.user}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.user ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
          >
            <option value="">Select a tenant user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username} - {user.email}
              </option>
            ))}
          </select>
          {errors.user && (
            <p className="mt-1 text-sm text-red-500">{errors.user}</p>
          )}
        </div>
      )}
      
      {/* Contact Information Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Contact Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Primary Phone */}
          <Input
            label="Primary Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
            placeholder="e.g., +1234567890"
          />
          
          {/* Alternative Phone */}
          <Input
            label="Alternative Phone"
            name="alternative_phone"
            value={formData.alternative_phone}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>
      </div>
      
      {/* Identification Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Identification
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ID Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Type
            </label>
            <select
              name="identification_type"
              value={formData.identification_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select ID type</option>
              <option value="National ID">National ID</option>
              <option value="Passport">Passport</option>
              <option value="Driver's License">Driver's License</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          {/* ID Number */}
          <Input
            label="ID Number"
            name="identification_number"
            value={formData.identification_number}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>
      </div>
      
      {/* Emergency Contact Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Emergency Contact
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Emergency Contact Name */}
          <Input
            label="Contact Name"
            name="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={handleChange}
            placeholder="Full name"
          />
          
          {/* Emergency Contact Phone */}
          <Input
            label="Contact Phone"
            name="emergency_contact_phone"
            value={formData.emergency_contact_phone}
            onChange={handleChange}
            placeholder="Phone number"
          />
        </div>
      </div>
      
      {/* Form Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : tenant ? 'Update Tenant' : 'Create Tenant'}
        </Button>
      </div>
    </form>
  );
};

export default Tenants;

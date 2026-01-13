/**
 * Leases Page
 * 
 * This page manages lease agreements between landlords and tenants.
 * A lease represents a rental agreement for a specific unit for a defined period.
 * Tracks start/end dates, rent amounts, security deposits, and lease status.
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
import { getStatusColor, formatCurrency, formatDate } from '../utils/helpers';

const Leases = () => {
  // Get authenticated user
  const { user } = useAuth();
  
  // State management
  const [leases, setLeases] = useState([]);                // List of leases
  const [properties, setProperties] = useState([]);        // Properties for dropdown
  const [units, setUnits] = useState([]);                  // Units for dropdown
  const [tenants, setTenants] = useState([]);              // Tenants for dropdown
  const [loading, setLoading] = useState(true);            // Loading state
  const [showModal, setShowModal] = useState(false);       // Modal visibility
  const [editingLease, setEditingLease] = useState(null);  // Lease being edited
  const [searchTerm, setSearchTerm] = useState('');        // Search filter
  const [filterStatus, setFilterStatus] = useState('');    // Status filter
  
  /**
   * Fetch all required data when component mounts
   */
  useEffect(() => {
    fetchLeases();
    fetchProperties();
    fetchUnits();
    fetchTenants();
  }, []);
  
  /**
   * Fetch all leases from the API
   */
  const fetchLeases = async () => {
    try {
      const data = await getAll('leases');
      setLeases(data.results || data);
    } catch (error) {
      console.error('Error fetching leases:', error);
      toast.error('Failed to load leases');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Fetch properties for the form dropdown
   */
  const fetchProperties = async () => {
    try {
      const data = await getAll('properties');
      setProperties(data.results || data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };
  
  /**
   * Fetch units for the form dropdown
   */
  const fetchUnits = async () => {
    try {
      const data = await getAll('units');
      setUnits(data.results || data);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };
  
  /**
   * Fetch tenants for the form dropdown
   */
  const fetchTenants = async () => {
    try {
      const data = await getAll('tenants');
      setTenants(data.results || data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };
  
  /**
   * Open modal to add new lease
   */
  const handleAddNew = () => {
    setEditingLease(null);
    setShowModal(true);
  };
  
  /**
   * Open modal to edit existing lease
   * @param {Object} lease - The lease to edit
   */
  const handleEdit = (lease) => {
    setEditingLease(lease);
    setShowModal(true);
  };
  
  /**
   * Delete a lease after confirmation
   * @param {number} id - The lease ID
   * @param {string} info - Lease info for confirmation
   */
  const handleDelete = async (id, info) => {
    if (window.confirm(`Are you sure you want to delete this lease (${info})?`)) {
      try {
        await remove('leases', id);
        toast.success('Lease deleted successfully');
        fetchLeases();
      } catch (error) {
        console.error('Error deleting lease:', error);
        toast.error('Failed to delete lease');
      }
    }
  };
  
  /**
   * Close modal and reset state
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLease(null);
  };
  
  /**
   * Handle successful save
   */
  const handleSaveSuccess = () => {
    handleCloseModal();
    fetchLeases();
  };
  
  /**
   * Get property name by ID
   * @param {number} propertyId - Property ID
   * @returns {string} Property name or 'N/A'
   */
  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'N/A';
  };
  
  /**
   * Get unit number by ID
   * @param {number} unitId - Unit ID
   * @returns {string} Unit number or 'N/A'
   */
  const getUnitNumber = (unitId) => {
    const unit = units.find(u => u.id === unitId);
    return unit ? unit.unit_number : 'N/A';
  };
  
  /**
   * Get tenant name by ID
   * @param {number} tenantId - Tenant ID
   * @returns {string} Tenant name or 'N/A'
   */
  const getTenantName = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId);
    // Tenant object has a user field, but we may not have full user data here
    return tenant ? `Tenant #${tenantId}` : 'N/A';
  };
  
  /**
   * Filter leases based on search and status
   */
  const filteredLeases = leases.filter(lease => {
    const searchLower = searchTerm.toLowerCase();
    const propertyName = getPropertyName(lease.property).toLowerCase();
    const unitNumber = getUnitNumber(lease.unit).toLowerCase();
    
    // Check search match
    const matchesSearch = 
      propertyName.includes(searchLower) ||
      unitNumber.includes(searchLower);
    
    // Check status filter
    const matchesStatus = !filterStatus || lease.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Show loading spinner
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
          <h1 className="text-3xl font-bold text-gray-900">Leases</h1>
          <p className="text-gray-600 mt-1">
            Manage lease agreements and rental contracts
          </p>
        </div>
        {/* Only admins and landlords can create leases */}
        {(user?.role === 'admin' || user?.role === 'landlord') && (
          <Button onClick={handleAddNew}>
            + Add Lease
          </Button>
        )}
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <Input
            placeholder="Search by property or unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="terminated">Terminated</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </Card>
      
      {/* Leases Table or Empty State */}
      {filteredLeases.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No leases found</p>
            {(user?.role === 'admin' || user?.role === 'landlord') && (
              <Button onClick={handleAddNew} className="mt-4">
                Create Your First Lease
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property / Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lease Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Rent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {(user?.role === 'admin' || user?.role === 'landlord') && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeases.map((lease) => (
                  <tr key={lease.id} className="hover:bg-gray-50">
                    {/* Property and Unit */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getPropertyName(lease.property)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Unit: {getUnitNumber(lease.unit)}
                      </div>
                    </td>
                    
                    {/* Tenant */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getTenantName(lease.tenant)}
                      </div>
                    </td>
                    
                    {/* Lease Period */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(lease.start_date)} to
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(lease.end_date)}
                      </div>
                    </td>
                    
                    {/* Monthly Rent */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(lease.monthly_rent)}
                      </div>
                      {lease.security_deposit > 0 && (
                        <div className="text-xs text-gray-500">
                          Deposit: {formatCurrency(lease.security_deposit)}
                        </div>
                      )}
                    </td>
                    
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lease.status)}`}>
                        {lease.status}
                      </span>
                    </td>
                    
                    {/* Actions */}
                    {(user?.role === 'admin' || user?.role === 'landlord') && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(lease)}
                          className="mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(
                            lease.id,
                            `${getPropertyName(lease.property)} - ${getUnitNumber(lease.unit)}`
                          )}
                        >
                          Delete
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      
      {/* Add/Edit Lease Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingLease ? 'Edit Lease' : 'Add New Lease'}
        size="lg"
      >
        <LeaseForm
          lease={editingLease}
          properties={properties}
          units={units}
          tenants={tenants}
          onSuccess={handleSaveSuccess}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

/**
 * Lease Form Component
 * 
 * Form for creating or editing lease agreements.
 * Collects property, unit, tenant, dates, and financial information.
 * 
 * @param {Object} props
 * @param {Object} props.lease - Lease being edited (null for new)
 * @param {Array} props.properties - Available properties
 * @param {Array} props.units - Available units
 * @param {Array} props.tenants - Available tenants
 * @param {Function} props.onSuccess - Success callback
 * @param {Function} props.onCancel - Cancel callback
 */
const LeaseForm = ({ lease, properties, units, tenants, onSuccess, onCancel }) => {
  const { user } = useAuth();
  
  // Initialize form data
  const [formData, setFormData] = useState({
    property: lease?.property || '',
    unit: lease?.unit || '',
    tenant: lease?.tenant || '',
    landlord: lease?.landlord || user?.id,
    start_date: lease?.start_date || '',
    end_date: lease?.end_date || '',
    monthly_rent: lease?.monthly_rent || '',
    security_deposit: lease?.security_deposit || 0,
    status: lease?.status || 'pending',
    terms_and_conditions: lease?.terms_and_conditions || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Filter units based on selected property
  const [filteredUnits, setFilteredUnits] = useState(units);
  
  /**
   * Update filtered units when property changes
   */
  useEffect(() => {
    if (formData.property) {
      setFilteredUnits(units.filter(u => u.property.toString() === formData.property.toString()));
    } else {
      setFilteredUnits(units);
    }
  }, [formData.property, units]);
  
  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear property-specific unit when property changes
    if (name === 'property') {
      setFormData(prev => ({
        ...prev,
        unit: ''
      }));
    }
    
    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.property) newErrors.property = 'Property is required';
    if (!formData.unit) newErrors.unit = 'Unit is required';
    if (!formData.tenant) newErrors.tenant = 'Tenant is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    if (!formData.monthly_rent) newErrors.monthly_rent = 'Monthly rent is required';
    
    // Date validation
    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) >= new Date(formData.end_date)) {
        newErrors.end_date = 'End date must be after start date';
      }
    }
    
    // Amount validation
    if (formData.monthly_rent && formData.monthly_rent <= 0) {
      newErrors.monthly_rent = 'Monthly rent must be greater than 0';
    }
    if (formData.security_deposit && formData.security_deposit < 0) {
      newErrors.security_deposit = 'Security deposit cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (lease) {
        // Update existing lease
        await update('leases', lease.id, formData);
        toast.success('Lease updated successfully');
      } else {
        // Create new lease
        await create('leases', formData);
        toast.success('Lease created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving lease:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      }
      toast.error('Failed to save lease');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Property and Unit Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Property Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property <span className="text-red-500">*</span>
          </label>
          <select
            name="property"
            value={formData.property}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.property ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
          >
            <option value="">Select property</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
          {errors.property && (
            <p className="mt-1 text-sm text-red-500">{errors.property}</p>
          )}
        </div>
        
        {/* Unit Dropdown (filtered by property) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit <span className="text-red-500">*</span>
          </label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            disabled={!formData.property}
            className={`w-full px-3 py-2 border ${errors.unit ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100`}
          >
            <option value="">Select unit</option>
            {filteredUnits.map(unit => (
              <option key={unit.id} value={unit.id}>
                {unit.unit_number} - {formatCurrency(unit.rent_amount)}/mo
              </option>
            ))}
          </select>
          {errors.unit && (
            <p className="mt-1 text-sm text-red-500">{errors.unit}</p>
          )}
        </div>
      </div>
      
      {/* Tenant Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tenant <span className="text-red-500">*</span>
        </label>
        <select
          name="tenant"
          value={formData.tenant}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.tenant ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
        >
          <option value="">Select tenant</option>
          {tenants.map(tenant => (
            <option key={tenant.id} value={tenant.id}>
              Tenant #{tenant.id} - {tenant.phone}
            </option>
          ))}
        </select>
        {errors.tenant && (
          <p className="mt-1 text-sm text-red-500">{errors.tenant}</p>
        )}
      </div>
      
      {/* Lease Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          name="start_date"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
          error={errors.start_date}
          required
        />
        
        <Input
          label="End Date"
          name="end_date"
          type="date"
          value={formData.end_date}
          onChange={handleChange}
          error={errors.end_date}
          required
        />
      </div>
      
      {/* Financial Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Monthly Rent"
          name="monthly_rent"
          type="number"
          step="0.01"
          value={formData.monthly_rent}
          onChange={handleChange}
          error={errors.monthly_rent}
          required
          placeholder="0.00"
        />
        
        <Input
          label="Security Deposit"
          name="security_deposit"
          type="number"
          step="0.01"
          value={formData.security_deposit}
          onChange={handleChange}
          error={errors.security_deposit}
          placeholder="0.00"
        />
      </div>
      
      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>
      
      {/* Terms and Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Terms and Conditions
        </label>
        <textarea
          name="terms_and_conditions"
          value={formData.terms_and_conditions}
          onChange={handleChange}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter lease terms, rules, and conditions..."
        />
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : lease ? 'Update Lease' : 'Create Lease'}
        </Button>
      </div>
    </form>
  );
};

export default Leases;

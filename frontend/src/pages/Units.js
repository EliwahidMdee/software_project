/**
 * Units Page
 * 
 * This page manages individual rental units within properties.
 * Units represent specific apartments, rooms, or spaces that can be rented.
 * Landlords and admins can create, edit, and delete units.
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
import { getStatusColor, formatCurrency } from '../utils/helpers';

const Units = () => {
  // Get current user from authentication context
  const { user } = useAuth();
  
  // State management for units data and UI
  const [units, setUnits] = useState([]);           // List of all units
  const [properties, setProperties] = useState([]); // List of properties for dropdown
  const [loading, setLoading] = useState(true);     // Loading state for initial fetch
  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [editingUnit, setEditingUnit] = useState(null); // Unit being edited
  const [searchTerm, setSearchTerm] = useState(''); // Search/filter term
  const [filterProperty, setFilterProperty] = useState(''); // Filter by property
  const [filterStatus, setFilterStatus] = useState(''); // Filter by status
  
  /**
   * Fetch units and properties when component mounts
   * This runs once when the page loads
   */
  useEffect(() => {
    fetchUnits();
    fetchProperties();
  }, []);
  
  /**
   * Fetch all units from the API
   * Gets the list of rental units and stores them in state
   */
  const fetchUnits = async () => {
    try {
      const data = await getAll('units');
      // Handle both paginated and non-paginated responses
      setUnits(data.results || data);
    } catch (error) {
      console.error('Error fetching units:', error);
      toast.error('Failed to load units');
    } finally {
      setLoading(false); // Stop showing loading spinner
    }
  };
  
  /**
   * Fetch all properties for the dropdown in the form
   * Needed to associate units with properties
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
   * Open modal to add a new unit
   * Clears any previously edited unit
   */
  const handleAddNew = () => {
    setEditingUnit(null);
    setShowModal(true);
  };
  
  /**
   * Open modal to edit an existing unit
   * @param {Object} unit - The unit to edit
   */
  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setShowModal(true);
  };
  
  /**
   * Delete a unit after confirmation
   * @param {number} id - The unit ID
   * @param {string} unitNumber - The unit number for display in confirmation
   */
  const handleDelete = async (id, unitNumber) => {
    // Show confirmation dialog
    if (window.confirm(`Are you sure you want to delete Unit ${unitNumber}?`)) {
      try {
        await remove('units', id);
        toast.success('Unit deleted successfully');
        fetchUnits(); // Refresh the list
      } catch (error) {
        console.error('Error deleting unit:', error);
        toast.error('Failed to delete unit');
      }
    }
  };
  
  /**
   * Close the modal and clear editing state
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUnit(null);
  };
  
  /**
   * Handle successful save from form
   * Closes modal and refreshes the list
   */
  const handleSaveSuccess = () => {
    handleCloseModal();
    fetchUnits(); // Refresh to show changes
  };
  
  /**
   * Get property name by ID
   * Helper function to display property names in the table
   * @param {number} propertyId - The property ID
   * @returns {string} Property name or 'N/A'
   */
  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'N/A';
  };
  
  /**
   * Filter units based on search term, property, and status
   * Returns only units that match all active filters
   */
  const filteredUnits = units.filter(unit => {
    // Check if unit matches search term (unit number or description)
    const matchesSearch = 
      unit.unit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (unit.description && unit.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Check if unit matches property filter
    const matchesProperty = !filterProperty || unit.property.toString() === filterProperty;
    
    // Check if unit matches status filter
    const matchesStatus = !filterStatus || unit.status === filterStatus;
    
    // Unit must match all active filters
    return matchesSearch && matchesProperty && matchesStatus;
  });
  
  // Show loading spinner while data is being fetched
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
          <h1 className="text-3xl font-bold text-gray-900">Units</h1>
          <p className="text-gray-600 mt-1">
            Manage rental units within your properties
          </p>
        </div>
        {/* Only show Add button for admins and landlords */}
        {(user?.role === 'admin' || user?.role === 'landlord') && (
          <Button onClick={handleAddNew}>
            + Add Unit
          </Button>
        )}
      </div>
      
      {/* Filters Section */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <Input
            placeholder="Search by unit number or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Property Filter Dropdown */}
          <select
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Properties</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
          
          {/* Status Filter Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Under Maintenance</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>
      </Card>
      
      {/* Units Table or Empty State */}
      {filteredUnits.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No units found</p>
            {(user?.role === 'admin' || user?.role === 'landlord') && (
              <Button onClick={handleAddNew} className="mt-4">
                Add Your First Unit
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <Card>
          {/* Responsive table wrapper */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent
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
                {filteredUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    {/* Unit Number */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {unit.unit_number}
                      </div>
                      {unit.floor && (
                        <div className="text-sm text-gray-500">
                          Floor {unit.floor}
                        </div>
                      )}
                    </td>
                    
                    {/* Property Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getPropertyName(unit.property)}
                      </div>
                    </td>
                    
                    {/* Unit Details (Bedrooms/Bathrooms) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        🛏️ {unit.bedrooms} bed{unit.bedrooms !== 1 ? 's' : ''} • 
                        🚿 {unit.bathrooms} bath{unit.bathrooms !== 1 ? 's' : ''}
                      </div>
                    </td>
                    
                    {/* Rent Amount */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(unit.rent_amount)}
                      </div>
                    </td>
                    
                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(unit.status)}`}>
                        {unit.status}
                      </span>
                    </td>
                    
                    {/* Action Buttons (Edit/Delete) */}
                    {(user?.role === 'admin' || user?.role === 'landlord') && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(unit)}
                          className="mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(unit.id, unit.unit_number)}
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
      
      {/* Add/Edit Unit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingUnit ? 'Edit Unit' : 'Add New Unit'}
        size="lg"
      >
        <UnitForm
          unit={editingUnit}
          properties={properties}
          onSuccess={handleSaveSuccess}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

/**
 * Unit Form Component
 * 
 * Form for creating or editing a rental unit.
 * Handles validation and submission to the API.
 * 
 * @param {Object} props
 * @param {Object} props.unit - Unit being edited (null for new unit)
 * @param {Array} props.properties - List of properties for dropdown
 * @param {Function} props.onSuccess - Callback after successful save
 * @param {Function} props.onCancel - Callback to cancel and close form
 */
const UnitForm = ({ unit, properties, onSuccess, onCancel }) => {
  // Form state - initialize with existing unit data or defaults
  const [formData, setFormData] = useState({
    property: unit?.property || '',
    unit_number: unit?.unit_number || '',
    floor: unit?.floor || '',
    bedrooms: unit?.bedrooms || 1,
    bathrooms: unit?.bathrooms || 1,
    rent_amount: unit?.rent_amount || '',
    status: unit?.status || 'available',
    description: unit?.description || '',
  });
  
  const [loading, setLoading] = useState(false); // Submission loading state
  const [errors, setErrors] = useState({});       // Form validation errors
  
  /**
   * Handle input field changes
   * Updates form state and clears validation errors for the field
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  /**
   * Validate form before submission
   * Checks required fields and business rules
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Required field validations
    if (!formData.property) newErrors.property = 'Property is required';
    if (!formData.unit_number.trim()) newErrors.unit_number = 'Unit number is required';
    if (!formData.rent_amount) newErrors.rent_amount = 'Rent amount is required';
    
    // Numeric validations
    if (formData.rent_amount && formData.rent_amount <= 0) {
      newErrors.rent_amount = 'Rent amount must be greater than 0';
    }
    if (formData.bedrooms < 0) newErrors.bedrooms = 'Bedrooms cannot be negative';
    if (formData.bathrooms < 0) newErrors.bathrooms = 'Bathrooms cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Handle form submission
   * Validates, then creates or updates the unit via API
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    setLoading(true); // Show loading state on submit button
    
    try {
      if (unit) {
        // Update existing unit
        await update('units', unit.id, formData);
        toast.success('Unit updated successfully');
      } else {
        // Create new unit
        await create('units', formData);
        toast.success('Unit created successfully');
      }
      onSuccess(); // Close modal and refresh list
    } catch (error) {
      console.error('Error saving unit:', error);
      // Display server-side validation errors if available
      if (error.response?.data) {
        setErrors(error.response.data);
      }
      toast.error('Failed to save unit');
    } finally {
      setLoading(false); // Hide loading state
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Property Selection */}
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
            <option value="">Select a property</option>
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
        
        {/* Unit Number */}
        <Input
          label="Unit Number"
          name="unit_number"
          value={formData.unit_number}
          onChange={handleChange}
          error={errors.unit_number}
          required
          placeholder="e.g., A1, 101, Suite 5"
        />
        
        {/* Floor Number */}
        <Input
          label="Floor"
          name="floor"
          type="number"
          value={formData.floor}
          onChange={handleChange}
          placeholder="Optional"
        />
        
        {/* Bedrooms */}
        <Input
          label="Bedrooms"
          name="bedrooms"
          type="number"
          value={formData.bedrooms}
          onChange={handleChange}
          error={errors.bedrooms}
          min="0"
          required
        />
        
        {/* Bathrooms */}
        <Input
          label="Bathrooms"
          name="bathrooms"
          type="number"
          value={formData.bathrooms}
          onChange={handleChange}
          error={errors.bathrooms}
          min="0"
          required
        />
        
        {/* Rent Amount */}
        <Input
          label="Monthly Rent"
          name="rent_amount"
          type="number"
          step="0.01"
          value={formData.rent_amount}
          onChange={handleChange}
          error={errors.rent_amount}
          required
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
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Under Maintenance</option>
          <option value="reserved">Reserved</option>
        </select>
      </div>
      
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Describe the unit, amenities, special features..."
        />
      </div>
      
      {/* Form Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : unit ? 'Update Unit' : 'Create Unit'}
        </Button>
      </div>
    </form>
  );
};

export default Units;

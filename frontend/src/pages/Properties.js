/**
 * Properties Page
 * 
 * Main page for managing properties.
 * Displays a list of properties and allows landlords to add/edit/delete properties.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAll, create, update, remove, uploadFile } from '../services/api';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getStatusColor } from '../utils/helpers';

const Properties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  /**
   * Fetch properties on component mount
   */
  useEffect(() => {
    fetchProperties();
  }, []);
  
  /**
   * Fetch all properties from API
   */
  const fetchProperties = async () => {
    try {
      const data = await getAll('properties');
      setProperties(data.results || data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Handle opening modal for new property
   */
  const handleAddNew = () => {
    setEditingProperty(null);
    setShowModal(true);
  };
  
  /**
   * Handle opening modal for editing property
   */
  const handleEdit = (property) => {
    setEditingProperty(property);
    setShowModal(true);
  };
  
  /**
   * Handle deleting a property
   */
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await remove('properties', id);
        toast.success('Property deleted successfully');
        fetchProperties(); // Refresh list
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error('Failed to delete property');
      }
    }
  };
  
  /**
   * Handle closing modal
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProperty(null);
  };
  
  /**
   * Handle successful save from form
   */
  const handleSaveSuccess = () => {
    handleCloseModal();
    fetchProperties(); // Refresh list
  };
  
  /**
   * Filter properties based on search term
   */
  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.region.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">
            Manage your rental properties
          </p>
        </div>
        {(user?.role === 'admin' || user?.role === 'landlord') && (
          <Button onClick={handleAddNew}>
            + Add Property
          </Button>
        )}
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="Search properties by name, location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties found</p>
            {(user?.role === 'admin' || user?.role === 'landlord') && (
              <Button onClick={handleAddNew} className="mt-4">
                Add Your First Property
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={user?.role === 'admin' || property.landlord === user?.id}
            />
          ))}
        </div>
      )}
      
      {/* Add/Edit Property Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingProperty ? 'Edit Property' : 'Add New Property'}
        size="lg"
      >
        <PropertyForm
          property={editingProperty}
          onSuccess={handleSaveSuccess}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

/**
 * Property Card Component
 * Displays individual property information
 */
const PropertyCard = ({ property, onEdit, onDelete, canEdit }) => {
  // Get the first image or use placeholder
  const imageUrl = property.images && property.images.length > 0
    ? property.images[0].image
    : '/placeholder-property.jpg';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Property Image */}
      <div className="h-48 bg-gray-200 relative">
        {property.images && property.images.length > 0 ? (
          <img
            src={imageUrl}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-6xl">🏢</span>
          </div>
        )}
        {/* Status Badge */}
        <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(property.status)}`}>
          {property.status}
        </span>
      </div>
      
      {/* Property Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {property.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          📍 {property.street}, {property.district}, {property.region}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          🏠 {property.property_type}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span>🛏️ {property.bedrooms} beds</span>
          <span>🚿 {property.bathrooms} baths</span>
          {property.area_sqft && (
            <span>📐 {property.area_sqft} sqft</span>
          )}
        </div>
        
        {/* Action Buttons */}
        {canEdit && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(property)}
              className="flex-1"
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete(property.id, property.name)}
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
 * Property Form Component
 * Form for adding or editing properties
 */
const PropertyForm = ({ property, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: property?.name || '',
    property_type: property?.property_type || 'residential',
    description: property?.description || '',
    region: property?.region || '',
    district: property?.district || '',
    ward: property?.ward || '',
    street: property?.street || '',
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    area_sqft: property?.area_sqft || '',
    payment_terms: property?.payment_terms || '',
    status: property?.status || 'vacant',
    landlord: property?.landlord || user?.id,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
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
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.region.trim()) newErrors.region = 'Region is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.street.trim()) newErrors.street = 'Street is required';
    
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
      if (property) {
        // Update existing property
        await update('properties', property.id, formData);
        toast.success('Property updated successfully');
      } else {
        // Create new property
        await create('properties', formData);
        toast.success('Property created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving property:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      }
      toast.error('Failed to save property');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Property Name */}
        <Input
          label="Property Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="e.g., Sunset Apartments"
        />
        
        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Type <span className="text-red-500">*</span>
          </label>
          <select
            name="property_type"
            value={formData.property_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="mixed">Mixed Use</option>
          </select>
        </div>
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
          placeholder="Describe the property..."
        />
      </div>
      
      {/* Location Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Region"
          name="region"
          value={formData.region}
          onChange={handleChange}
          error={errors.region}
          required
          placeholder="e.g., California"
        />
        
        <Input
          label="District"
          name="district"
          value={formData.district}
          onChange={handleChange}
          error={errors.district}
          required
          placeholder="e.g., Los Angeles"
        />
        
        <Input
          label="Ward/Neighborhood"
          name="ward"
          value={formData.ward}
          onChange={handleChange}
          placeholder="Optional"
        />
        
        <Input
          label="Street Address"
          name="street"
          value={formData.street}
          onChange={handleChange}
          error={errors.street}
          required
          placeholder="e.g., 123 Main St"
        />
      </div>
      
      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Bedrooms"
          name="bedrooms"
          type="number"
          value={formData.bedrooms}
          onChange={handleChange}
          min="0"
        />
        
        <Input
          label="Bathrooms"
          name="bathrooms"
          type="number"
          value={formData.bathrooms}
          onChange={handleChange}
          min="0"
        />
        
        <Input
          label="Area (sqft)"
          name="area_sqft"
          type="number"
          value={formData.area_sqft}
          onChange={handleChange}
          placeholder="Optional"
        />
      </div>
      
      {/* Payment Terms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Terms
        </label>
        <textarea
          name="payment_terms"
          value={formData.payment_terms}
          onChange={handleChange}
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g., Rent due on 1st of each month..."
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
          <option value="vacant">Vacant</option>
          <option value="occupied">Occupied</option>
          <option value="partially_occupied">Partially Occupied</option>
          <option value="maintenance">Under Maintenance</option>
        </select>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
        </Button>
      </div>
    </form>
  );
};

export default Properties;

/**
 * Documents Page
 * 
 * This page manages document uploads and storage for the rental system.
 * Documents can include lease agreements, receipts, insurance papers, etc.
 * Users can upload, view, and download documents related to properties and leases.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAll, create, remove, uploadFile } from '../services/api';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/helpers';

const Documents = () => {
  // Get authenticated user
  const { user } = useAuth();
  
  // State management
  const [documents, setDocuments] = useState([]);          // List of documents
  const [properties, setProperties] = useState([]);        // Properties for filter/form
  const [loading, setLoading] = useState(true);            // Loading state
  const [showModal, setShowModal] = useState(false);       // Modal visibility
  const [searchTerm, setSearchTerm] = useState('');        // Search filter
  const [filterProperty, setFilterProperty] = useState(''); // Property filter
  const [filterType, setFilterType] = useState('');        // Document type filter
  
  /**
   * Fetch documents and properties on mount
   */
  useEffect(() => {
    fetchDocuments();
    fetchProperties();
  }, []);
  
  /**
   * Fetch all documents from API
   */
  const fetchDocuments = async () => {
    try {
      const data = await getAll('documents');
      setDocuments(data.results || data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Fetch properties for dropdown
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
   * Open modal to upload new document
   */
  const handleAddNew = () => {
    setShowModal(true);
  };
  
  /**
   * Delete a document after confirmation
   * @param {number} id - Document ID
   * @param {string} title - Document title for confirmation
   */
  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await remove('documents', id);
        toast.success('Document deleted successfully');
        fetchDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
        toast.error('Failed to delete document');
      }
    }
  };
  
  /**
   * Close modal
   */
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  /**
   * Handle successful upload
   */
  const handleUploadSuccess = () => {
    handleCloseModal();
    fetchDocuments();
  };
  
  /**
   * Get property name by ID
   * @param {number} propertyId - Property ID
   * @returns {string} Property name
   */
  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'N/A';
  };
  
  /**
   * Get file icon based on file type
   * @param {string} fileName - Name of the file
   * @returns {string} Emoji icon
   */
  const getFileIcon = (fileName) => {
    if (!fileName) return '📄';
    const ext = fileName.split('.').pop().toLowerCase();
    
    const iconMap = {
      pdf: '📕',
      doc: '📘',
      docx: '📘',
      xls: '📗',
      xlsx: '📗',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      txt: '📝',
      zip: '🗜️',
      rar: '🗜️',
    };
    
    return iconMap[ext] || '📄';
  };
  
  /**
   * Filter documents based on search, property, and type
   */
  const filteredDocuments = documents.filter(doc => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search in title and description
    const matchesSearch = 
      (doc.title || '').toLowerCase().includes(searchLower) ||
      (doc.description || '').toLowerCase().includes(searchLower);
    
    // Filter by property
    const matchesProperty = !filterProperty || 
      (doc.property && doc.property.toString() === filterProperty);
    
    // Filter by type
    const matchesType = !filterType || doc.document_type === filterType;
    
    return matchesSearch && matchesProperty && matchesType;
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
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">
            Manage and organize property-related documents
          </p>
        </div>
        {/* Only admins and landlords can upload documents */}
        {(user?.role === 'admin' || user?.role === 'landlord') && (
          <Button onClick={handleAddNew}>
            + Upload Document
          </Button>
        )}
      </div>
      
      {/* Filters Section */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <Input
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Property Filter */}
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
          
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Types</option>
            <option value="lease">Lease Agreement</option>
            <option value="receipt">Receipt</option>
            <option value="insurance">Insurance</option>
            <option value="inspection">Inspection Report</option>
            <option value="maintenance">Maintenance Record</option>
            <option value="other">Other</option>
          </select>
        </div>
      </Card>
      
      {/* Documents Grid or Empty State */}
      {filteredDocuments.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No documents found</p>
            {(user?.role === 'admin' || user?.role === 'landlord') && (
              <Button onClick={handleAddNew} className="mt-4">
                Upload Your First Document
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              propertyName={getPropertyName(doc.property)}
              fileIcon={getFileIcon(doc.file)}
              onDelete={handleDelete}
              canDelete={user?.role === 'admin' || user?.role === 'landlord'}
            />
          ))}
        </div>
      )}
      
      {/* Upload Document Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Upload New Document"
        size="lg"
      >
        <DocumentUploadForm
          properties={properties}
          onSuccess={handleUploadSuccess}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

/**
 * Document Card Component
 * 
 * Displays individual document information in a card format.
 * Shows file icon, title, description, and metadata.
 * 
 * @param {Object} props
 * @param {Object} props.document - Document data
 * @param {string} props.propertyName - Associated property name
 * @param {string} props.fileIcon - File type icon
 * @param {Function} props.onDelete - Delete callback
 * @param {boolean} props.canDelete - Whether user can delete
 */
const DocumentCard = ({ document, propertyName, fileIcon, onDelete, canDelete }) => {
  /**
   * Extract filename from file path
   */
  const getFileName = () => {
    if (!document.file) return 'Unknown';
    return document.file.split('/').pop();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Card Header with File Icon */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white text-center">
        <span className="text-6xl">{fileIcon}</span>
      </div>
      
      {/* Card Body */}
      <div className="p-4">
        {/* Document Type Badge */}
        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mb-2">
          {document.document_type}
        </span>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {document.title}
        </h3>
        
        {/* Description */}
        {document.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {document.description}
          </p>
        )}
        
        {/* Property */}
        {document.property && (
          <div className="mb-2">
            <p className="text-xs text-gray-500 uppercase">Property</p>
            <p className="text-sm text-gray-900">{propertyName}</p>
          </div>
        )}
        
        {/* File Name */}
        <div className="mb-2">
          <p className="text-xs text-gray-500 uppercase">File</p>
          <p className="text-sm text-gray-900 truncate">{getFileName()}</p>
        </div>
        
        {/* Upload Date */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 uppercase">Uploaded</p>
          <p className="text-sm text-gray-900">{formatDate(document.uploaded_at)}</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Download/View Button */}
          <a
            href={document.file}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button size="sm" variant="outline" className="w-full">
              View
            </Button>
          </a>
          
          {/* Delete Button (only for authorized users) */}
          {canDelete && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete(document.id, document.title)}
              className="flex-1"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Document Upload Form Component
 * 
 * Form for uploading new documents.
 * Collects title, description, type, property, and file.
 * 
 * @param {Object} props
 * @param {Array} props.properties - Available properties
 * @param {Function} props.onSuccess - Success callback
 * @param {Function} props.onCancel - Cancel callback
 */
const DocumentUploadForm = ({ properties, onSuccess, onCancel }) => {
  const { user } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    document_type: 'other',
    property: '',
    uploaded_by: user?.id,
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
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
    
    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  /**
   * Handle file selection
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    
    // Clear file error
    if (errors.file) {
      setErrors(prev => ({
        ...prev,
        file: ''
      }));
    }
  };
  
  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!selectedFile) newErrors.file = 'Please select a file to upload';
    
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
      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('document_type', formData.document_type);
      if (formData.property) {
        uploadData.append('property', formData.property);
      }
      uploadData.append('uploaded_by', formData.uploaded_by);
      uploadData.append('file', selectedFile);
      
      // Upload document
      await create('documents', uploadData);
      toast.success('Document uploaded successfully');
      onSuccess();
    } catch (error) {
      console.error('Error uploading document:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      }
      toast.error('Failed to upload document');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <Input
        label="Document Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
        placeholder="e.g., Lease Agreement 2024"
      />
      
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
          placeholder="Optional description of the document..."
        />
      </div>
      
      {/* Document Type and Property */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Document Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Type <span className="text-red-500">*</span>
          </label>
          <select
            name="document_type"
            value={formData.document_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="lease">Lease Agreement</option>
            <option value="receipt">Receipt</option>
            <option value="insurance">Insurance</option>
            <option value="inspection">Inspection Report</option>
            <option value="maintenance">Maintenance Record</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        {/* Property (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property (Optional)
          </label>
          <select
            name="property"
            value={formData.property}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Not associated with property</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          File <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className={`w-full px-3 py-2 border ${errors.file ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
        />
        {errors.file && (
          <p className="mt-1 text-sm text-red-500">{errors.file}</p>
        )}
        {selectedFile && (
          <p className="mt-1 text-sm text-gray-600">
            Selected: {selectedFile.name}
          </p>
        )}
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>
    </form>
  );
};

export default Documents;

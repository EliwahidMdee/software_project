/**
 * Notifications Page
 * 
 * This page manages notifications and messages between tenants and landlords.
 * Tenants can submit maintenance requests, complaints, or general messages.
 * Landlords can view and respond to notifications from their tenants.
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
import { getStatusColor, formatDate } from '../utils/helpers';

const Notifications = () => {
  // Get authenticated user
  const { user } = useAuth();
  
  // State management
  const [notifications, setNotifications] = useState([]);    // List of notifications
  const [properties, setProperties] = useState([]);          // Properties for dropdown
  const [loading, setLoading] = useState(true);              // Loading state
  const [showModal, setShowModal] = useState(false);         // Modal visibility
  const [editingNotification, setEditingNotification] = useState(null); // Notification being edited
  const [searchTerm, setSearchTerm] = useState('');          // Search filter
  const [filterStatus, setFilterStatus] = useState('');      // Status filter
  const [filterType, setFilterType] = useState('');          // Type filter
  
  /**
   * Fetch notifications and properties on mount
   */
  useEffect(() => {
    fetchNotifications();
    fetchProperties();
  }, []);
  
  /**
   * Fetch all notifications from API
   */
  const fetchNotifications = async () => {
    try {
      const data = await getAll('notifications');
      setNotifications(data.results || data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
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
   * Open modal to create new notification
   */
  const handleAddNew = () => {
    setEditingNotification(null);
    setShowModal(true);
  };
  
  /**
   * Open modal to view/edit notification
   * @param {Object} notification - The notification to edit
   */
  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setShowModal(true);
  };
  
  /**
   * Delete a notification after confirmation
   * @param {number} id - Notification ID
   * @param {string} subject - Subject for confirmation
   */
  const handleDelete = async (id, subject) => {
    if (window.confirm(`Are you sure you want to delete "${subject}"?`)) {
      try {
        await remove('notifications', id);
        toast.success('Notification deleted successfully');
        fetchNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
        toast.error('Failed to delete notification');
      }
    }
  };
  
  /**
   * Mark notification as read
   * @param {number} id - Notification ID
   */
  const handleMarkAsRead = async (id) => {
    try {
      await update('notifications', id, { is_read: true });
      toast.success('Marked as read');
      fetchNotifications();
    } catch (error) {
      console.error('Error updating notification:', error);
      toast.error('Failed to update notification');
    }
  };
  
  /**
   * Close modal
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNotification(null);
  };
  
  /**
   * Handle successful save
   */
  const handleSaveSuccess = () => {
    handleCloseModal();
    fetchNotifications();
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
   * Get notification type icon
   * @param {string} type - Notification type
   * @returns {string} Emoji icon
   */
  const getTypeIcon = (type) => {
    const iconMap = {
      maintenance: '🔧',
      complaint: '⚠️',
      inquiry: '❓',
      payment: '💰',
      general: '📢',
    };
    return iconMap[type] || '📩';
  };
  
  /**
   * Filter notifications
   */
  const filteredNotifications = notifications.filter(notif => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search in subject and message
    const matchesSearch = 
      (notif.subject || '').toLowerCase().includes(searchLower) ||
      (notif.message || '').toLowerCase().includes(searchLower);
    
    // Filter by status
    const matchesStatus = !filterStatus || 
      (filterStatus === 'read' ? notif.is_read : !notif.is_read);
    
    // Filter by type
    const matchesType = !filterType || notif.notification_type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  /**
   * Count unread notifications
   */
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
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
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Communication and notification center
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        {/* Tenants can create notifications */}
        {(user?.role === 'tenant' || user?.role === 'landlord' || user?.role === 'admin') && (
          <Button onClick={handleAddNew}>
            + New Notification
          </Button>
        )}
      </div>
      
      {/* Filters Section */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <Input
            placeholder="Search by subject or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Types</option>
            <option value="maintenance">Maintenance</option>
            <option value="complaint">Complaint</option>
            <option value="inquiry">Inquiry</option>
            <option value="payment">Payment</option>
            <option value="general">General</option>
          </select>
        </div>
      </Card>
      
      {/* Notifications List or Empty State */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No notifications found</p>
            {(user?.role === 'tenant' || user?.role === 'landlord') && (
              <Button onClick={handleAddNew} className="mt-4">
                Create Your First Notification
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              propertyName={getPropertyName(notification.property)}
              typeIcon={getTypeIcon(notification.notification_type)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMarkAsRead={handleMarkAsRead}
              userRole={user?.role}
            />
          ))}
        </div>
      )}
      
      {/* Add/Edit Notification Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingNotification ? 'View Notification' : 'New Notification'}
        size="lg"
      >
        <NotificationForm
          notification={editingNotification}
          properties={properties}
          onSuccess={handleSaveSuccess}
          onCancel={handleCloseModal}
          isReadOnly={!!editingNotification}
        />
      </Modal>
    </div>
  );
};

/**
 * Notification Card Component
 * 
 * Displays individual notification in a card format.
 * Shows subject, message, type, status, and actions.
 * 
 * @param {Object} props
 * @param {Object} props.notification - Notification data
 * @param {string} props.propertyName - Property name
 * @param {string} props.typeIcon - Type icon
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @param {Function} props.onMarkAsRead - Mark as read callback
 * @param {string} props.userRole - Current user role
 */
const NotificationCard = ({ 
  notification, 
  propertyName, 
  typeIcon, 
  onEdit, 
  onDelete, 
  onMarkAsRead,
  userRole 
}) => {
  return (
    <Card className={`${!notification.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          {/* Left side - Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {/* Type Icon */}
              <span className="text-2xl">{typeIcon}</span>
              
              {/* Type Badge */}
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                {notification.notification_type}
              </span>
              
              {/* Read/Unread Badge */}
              {!notification.is_read && (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white">
                  New
                </span>
              )}
            </div>
            
            {/* Subject */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {notification.subject}
            </h3>
            
            {/* Message Preview */}
            <p className="text-sm text-gray-600 mb-3">
              {notification.message}
            </p>
            
            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {/* Property */}
              {notification.property && (
                <div>
                  <span className="font-medium">Property:</span> {propertyName}
                </div>
              )}
              
              {/* Date */}
              <div>
                <span className="font-medium">Date:</span> {formatDate(notification.created_at)}
              </div>
            </div>
          </div>
          
          {/* Right side - Actions */}
          <div className="flex flex-col gap-2 ml-4">
            {/* View Details Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(notification)}
            >
              View
            </Button>
            
            {/* Mark as Read (if unread and user is landlord/admin) */}
            {!notification.is_read && (userRole === 'admin' || userRole === 'landlord') && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onMarkAsRead(notification.id)}
              >
                Mark Read
              </Button>
            )}
            
            {/* Delete Button (only for sender or admin) */}
            {(userRole === 'admin') && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(notification.id, notification.subject)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * Notification Form Component
 * 
 * Form for creating new notifications.
 * If readonly, just displays the notification details.
 * 
 * @param {Object} props
 * @param {Object} props.notification - Notification being viewed (null for new)
 * @param {Array} props.properties - Available properties
 * @param {Function} props.onSuccess - Success callback
 * @param {Function} props.onCancel - Cancel callback
 * @param {boolean} props.isReadOnly - Whether form is read-only
 */
const NotificationForm = ({ notification, properties, onSuccess, onCancel, isReadOnly }) => {
  const { user } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    subject: notification?.subject || '',
    message: notification?.message || '',
    notification_type: notification?.notification_type || 'general',
    property: notification?.property || '',
    sender: notification?.sender || user?.id,
    is_read: notification?.is_read || false,
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
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
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
      // Create new notification
      await create('notifications', formData);
      toast.success('Notification sent successfully');
      onSuccess();
    } catch (error) {
      console.error('Error sending notification:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      }
      toast.error('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };
  
  // If readonly, just display the notification
  if (isReadOnly) {
    return (
      <div className="space-y-4">
        {/* Subject */}
        <div>
          <p className="text-sm font-medium text-gray-500">Subject</p>
          <p className="text-lg font-semibold text-gray-900">{notification.subject}</p>
        </div>
        
        {/* Message */}
        <div>
          <p className="text-sm font-medium text-gray-500">Message</p>
          <p className="text-gray-900 whitespace-pre-wrap">{notification.message}</p>
        </div>
        
        {/* Type */}
        <div>
          <p className="text-sm font-medium text-gray-500">Type</p>
          <p className="text-gray-900">{notification.notification_type}</p>
        </div>
        
        {/* Property */}
        {notification.property && (
          <div>
            <p className="text-sm font-medium text-gray-500">Property</p>
            <p className="text-gray-900">
              {properties.find(p => p.id === notification.property)?.name || 'N/A'}
            </p>
          </div>
        )}
        
        {/* Date */}
        <div>
          <p className="text-sm font-medium text-gray-500">Date</p>
          <p className="text-gray-900">{formatDate(notification.created_at)}</p>
        </div>
        
        {/* Status */}
        <div>
          <p className="text-sm font-medium text-gray-500">Status</p>
          <p className="text-gray-900">
            {notification.is_read ? 'Read' : 'Unread'}
          </p>
        </div>
        
        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onCancel}>Close</Button>
        </div>
      </div>
    );
  }
  
  // Create form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Subject */}
      <Input
        label="Subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        error={errors.subject}
        required
        placeholder="e.g., AC not working, Water leak"
      />
      
      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          className={`w-full px-3 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
          placeholder="Describe the issue or inquiry in detail..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
        )}
      </div>
      
      {/* Type and Property */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Notification Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            name="notification_type"
            value={formData.notification_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="general">General</option>
            <option value="maintenance">Maintenance Request</option>
            <option value="complaint">Complaint</option>
            <option value="inquiry">Inquiry</option>
            <option value="payment">Payment Issue</option>
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
            <option value="">Select property</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Notification'}
        </Button>
      </div>
    </form>
  );
};

export default Notifications;

/**
 * Expenses Page
 * 
 * This page manages property-related expenses and costs.
 * Tracks maintenance, repairs, utilities, and other property expenses.
 * Landlords and admins can record and categorize expenses for accounting.
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
import { formatCurrency, formatDate, pluralize } from '../utils/helpers';

const Expenses = () => {
  // Get authenticated user
  const { user } = useAuth();
  
  // State management
  const [expenses, setExpenses] = useState([]);            // List of expenses
  const [properties, setProperties] = useState([]);        // Properties for dropdown
  const [loading, setLoading] = useState(true);            // Loading state
  const [showModal, setShowModal] = useState(false);       // Modal visibility
  const [editingExpense, setEditingExpense] = useState(null); // Expense being edited
  const [searchTerm, setSearchTerm] = useState('');        // Search filter
  const [filterProperty, setFilterProperty] = useState(''); // Property filter
  const [filterCategory, setFilterCategory] = useState(''); // Category filter
  
  /**
   * Fetch expenses and properties on component mount
   */
  useEffect(() => {
    fetchExpenses();
    fetchProperties();
  }, []);
  
  /**
   * Fetch all expenses from the API
   */
  const fetchExpenses = async () => {
    try {
      const data = await getAll('expenses');
      setExpenses(data.results || data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
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
   * Open modal to add new expense
   */
  const handleAddNew = () => {
    setEditingExpense(null);
    setShowModal(true);
  };
  
  /**
   * Open modal to edit expense
   * @param {Object} expense - The expense to edit
   */
  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowModal(true);
  };
  
  /**
   * Delete an expense after confirmation
   * @param {number} id - Expense ID
   * @param {string} description - Expense description for confirmation
   */
  const handleDelete = async (id, description) => {
    if (window.confirm(`Are you sure you want to delete "${description}"?`)) {
      try {
        await remove('expenses', id);
        toast.success('Expense deleted successfully');
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        toast.error('Failed to delete expense');
      }
    }
  };
  
  /**
   * Close modal and reset state
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExpense(null);
  };
  
  /**
   * Handle successful save
   */
  const handleSaveSuccess = () => {
    handleCloseModal();
    fetchExpenses();
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
   * Filter expenses based on search, property, and category
   */
  const filteredExpenses = expenses.filter(expense => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search in description and vendor
    const matchesSearch = 
      (expense.description || '').toLowerCase().includes(searchLower) ||
      (expense.vendor || '').toLowerCase().includes(searchLower);
    
    // Filter by property
    const matchesProperty = !filterProperty || expense.property.toString() === filterProperty;
    
    // Filter by category
    const matchesCategory = !filterCategory || expense.category === filterCategory;
    
    return matchesSearch && matchesProperty && matchesCategory;
  });
  
  /**
   * Calculate total expenses
   */
  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount || 0),
    0
  );
  
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
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">
            Track and manage property-related expenses
          </p>
        </div>
        {/* Only admins and landlords can add expenses */}
        {(user?.role === 'admin' || user?.role === 'landlord') && (
          <Button onClick={handleAddNew}>
            + Add Expense
          </Button>
        )}
      </div>
      
      {/* Filters Section */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <Input
            placeholder="Search by description or vendor..."
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
          
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            <option value="maintenance">Maintenance</option>
            <option value="repair">Repair</option>
            <option value="utility">Utility</option>
            <option value="insurance">Insurance</option>
            <option value="tax">Tax</option>
            <option value="improvement">Improvement</option>
            <option value="other">Other</option>
          </select>
        </div>
      </Card>
      
      {/* Summary Card */}
      {filteredExpenses.length > 0 && (
        <Card className="mb-6 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {filteredExpenses.length} {pluralize(filteredExpenses.length, 'expense')}
            </p>
          </div>
        </Card>
      )}
      
      {/* Expenses Table or Empty State */}
      {filteredExpenses.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No expenses found</p>
            {(user?.role === 'admin' || user?.role === 'landlord') && (
              <Button onClick={handleAddNew} className="mt-4">
                Record Your First Expense
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
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
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
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(expense.date)}
                      </div>
                    </td>
                    
                    {/* Description */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {expense.description}
                      </div>
                      {expense.vendor && (
                        <div className="text-sm text-gray-500">
                          Vendor: {expense.vendor}
                        </div>
                      )}
                    </td>
                    
                    {/* Property */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getPropertyName(expense.property)}
                      </div>
                    </td>
                    
                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {expense.category}
                      </span>
                    </td>
                    
                    {/* Amount */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-red-600">
                        {formatCurrency(expense.amount)}
                      </div>
                    </td>
                    
                    {/* Actions */}
                    {(user?.role === 'admin' || user?.role === 'landlord') && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(expense)}
                          className="mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(expense.id, expense.description)}
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
      
      {/* Add/Edit Expense Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
        size="lg"
      >
        <ExpenseForm
          expense={editingExpense}
          properties={properties}
          onSuccess={handleSaveSuccess}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

/**
 * Expense Form Component
 * 
 * Form for creating or editing expenses.
 * Collects date, description, amount, category, and vendor information.
 * 
 * @param {Object} props
 * @param {Object} props.expense - Expense being edited (null for new)
 * @param {Array} props.properties - Available properties
 * @param {Function} props.onSuccess - Success callback
 * @param {Function} props.onCancel - Cancel callback
 */
const ExpenseForm = ({ expense, properties, onSuccess, onCancel }) => {
  const { user } = useAuth();
  
  // Initialize form data
  const [formData, setFormData] = useState({
    property: expense?.property || '',
    date: expense?.date || new Date().toISOString().split('T')[0],
    category: expense?.category || 'maintenance',
    description: expense?.description || '',
    amount: expense?.amount || '',
    vendor: expense?.vendor || '',
    notes: expense?.notes || '',
    paid_by: expense?.paid_by || user?.id,
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
    if (!formData.property) newErrors.property = 'Property is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    
    // Amount validation
    if (formData.amount && formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
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
      if (expense) {
        // Update existing expense
        await update('expenses', expense.id, formData);
        toast.success('Expense updated successfully');
      } else {
        // Create new expense
        await create('expenses', formData);
        toast.success('Expense recorded successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving expense:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      }
      toast.error('Failed to save expense');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Property and Date */}
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
        
        {/* Date */}
        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
        />
      </div>
      
      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="maintenance">Maintenance</option>
          <option value="repair">Repair</option>
          <option value="utility">Utility</option>
          <option value="insurance">Insurance</option>
          <option value="tax">Tax</option>
          <option value="improvement">Improvement</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      {/* Description */}
      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        required
        placeholder="e.g., AC repair, water bill payment"
      />
      
      {/* Amount and Vendor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amount */}
        <Input
          label="Amount"
          name="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount}
          required
          placeholder="0.00"
        />
        
        {/* Vendor */}
        <Input
          label="Vendor/Payee"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          placeholder="Optional"
        />
      </div>
      
      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Additional details or notes..."
        />
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : expense ? 'Update Expense' : 'Record Expense'}
        </Button>
      </div>
    </form>
  );
};

export default Expenses;

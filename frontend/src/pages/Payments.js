/**
 * Payments Page
 * 
 * Displays and manages payment records.
 * Different views for Admin, Landlord, and Tenant roles.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAll, create, update } from '../services/api';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';

const Payments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  
  useEffect(() => {
    fetchPayments();
  }, []);
  
  const fetchPayments = async () => {
    try {
      const data = await getAll('payments');
      setPayments(data.results || data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddNew = () => {
    setEditingPayment(null);
    setShowModal(true);
  };
  
  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPayment(null);
  };
  
  const handleSaveSuccess = () => {
    handleCloseModal();
    fetchPayments();
  };
  
  // Filter payments by status
  const filteredPayments = filterStatus === 'all'
    ? payments
    : payments.filter(p => p.status === filterStatus);
  
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
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">
            Track and manage payment records
          </p>
        </div>
        {(user?.role === 'admin' || user?.role === 'landlord') && (
          <Button onClick={handleAddNew}>
            + Record Payment
          </Button>
        )}
      </div>
      
      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg ${
            filterStatus === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Payments
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 rounded-lg ${
            filterStatus === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          className={`px-4 py-2 rounded-lg ${
            filterStatus === 'completed'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilterStatus('overdue')}
          className={`px-4 py-2 rounded-lg ${
            filterStatus === 'overdue'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Overdue
        </button>
      </div>
      
      {/* Payments Table */}
      {filteredPayments.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No payments found</p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.tenant_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.property_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(payment.due_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payment.paid_date ? formatDate(payment.paid_date) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(user?.role === 'admin' || user?.role === 'landlord') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(payment)}
                        >
                          Edit
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      
      {/* Payment Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingPayment ? 'Edit Payment' : 'Record Payment'}
        size="lg"
      >
        <PaymentForm
          payment={editingPayment}
          onSuccess={handleSaveSuccess}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

/**
 * Payment Form Component
 */
const PaymentForm = ({ payment, onSuccess, onCancel }) => {
  const [leases, setLeases] = useState([]);
  const [formData, setFormData] = useState({
    tenant: payment?.tenant || '',
    property: payment?.property || '',
    lease: payment?.lease || '',
    amount: payment?.amount || '',
    payment_method: payment?.payment_method || 'bank_transfer',
    transaction_id: payment?.transaction_id || '',
    due_date: payment?.due_date || '',
    paid_date: payment?.paid_date || '',
    status: payment?.status || 'pending',
    notes: payment?.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Fetch leases on mount
  // Note: Empty dependency array means this effect runs only once when component mounts
  // We don't include fetchLeases in dependencies to avoid infinite loops
  useEffect(() => {
    fetchLeases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const fetchLeases = async () => {
    try {
      const data = await getAll('leases');
      setLeases(data.results || data);
      
      // Auto-populate property from lease if lease is selected
      if (formData.lease) {
        const selectedLease = (data.results || data).find(l => l.id === parseInt(formData.lease));
        if (selectedLease) {
          setFormData(prev => ({
            ...prev,
            property: selectedLease.property,
            tenant: selectedLease.tenant,
            amount: selectedLease.monthly_rent,
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching leases:', error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-populate fields when lease is selected
    if (name === 'lease') {
      const selectedLease = leases.find(l => l.id === parseInt(value));
      if (selectedLease) {
        setFormData(prev => ({
          ...prev,
          property: selectedLease.property,
          tenant: selectedLease.tenant,
          amount: selectedLease.monthly_rent,
        }));
      }
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tenant) newErrors.tenant = 'Tenant is required';
    if (!formData.lease) newErrors.lease = 'Lease is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (!formData.due_date) newErrors.due_date = 'Due date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (payment) {
        await update('payments', payment.id, formData);
        toast.success('Payment updated successfully');
      } else {
        await create('payments', formData);
        toast.success('Payment recorded successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving payment:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      }
      toast.error('Failed to save payment');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lease Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lease <span className="text-red-500">*</span>
          </label>
          <select
            name="lease"
            value={formData.lease}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            <option value="">Select a lease</option>
            {leases.map((lease) => (
              <option key={lease.id} value={lease.id}>
                {lease.property_name} - {lease.unit_number} ({lease.tenant_name})
              </option>
            ))}
          </select>
          {errors.lease && <p className="mt-1 text-sm text-red-600">{errors.lease}</p>}
        </div>
        
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
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="check">Check</option>
            <option value="card">Credit/Debit Card</option>
          </select>
        </div>
        
        {/* Transaction ID */}
        <Input
          label="Transaction ID"
          name="transaction_id"
          value={formData.transaction_id}
          onChange={handleChange}
          placeholder="Optional reference number"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Due Date */}
        <Input
          label="Due Date"
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleChange}
          error={errors.due_date}
          required
        />
        
        {/* Paid Date */}
        <Input
          label="Paid Date"
          name="paid_date"
          type="date"
          value={formData.paid_date}
          onChange={handleChange}
          placeholder="Leave empty if not paid"
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
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
          <option value="partial">Partial</option>
          <option value="cancelled">Cancelled</option>
        </select>
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
          placeholder="Additional payment notes..."
        />
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : payment ? 'Update Payment' : 'Record Payment'}
        </Button>
      </div>
    </form>
  );
};

export default Payments;

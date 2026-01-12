/**
 * Dashboard Page
 * 
 * Main dashboard that displays different information based on user role.
 * - Admin: System-wide statistics
 * - Landlord: Their properties and revenue stats
 * - Tenant: Their lease and payment information
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../services/api';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  /**
   * Fetch dashboard statistics on component mount
   */
  useEffect(() => {
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.first_name || user?.username}!
        </p>
      </div>
      
      {/* Dashboard Content based on Role */}
      {user?.role === 'admin' && <AdminDashboard stats={stats} />}
      {user?.role === 'landlord' && <LandlordDashboard stats={stats} />}
      {user?.role === 'tenant' && <TenantDashboard stats={stats} />}
    </div>
  );
};

/**
 * Admin Dashboard Component
 */
const AdminDashboard = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={stats?.total_properties || 0}
          icon="🏢"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Units"
          value={stats?.total_units || 0}
          icon="🏠"
          color="bg-green-500"
        />
        <StatCard
          title="Total Tenants"
          value={stats?.total_tenants || 0}
          icon="👥"
          color="bg-purple-500"
        />
        <StatCard
          title="Active Leases"
          value={stats?.active_leases || 0}
          icon="📝"
          color="bg-orange-500"
        />
      </div>
      
      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.total_revenue || 0)}
          icon="💰"
          color="bg-green-600"
        />
        <StatCard
          title="Completed Payments"
          value={stats?.completed_payments || 0}
          icon="✅"
          color="bg-green-500"
        />
        <StatCard
          title="Pending Payments"
          value={stats?.pending_payments || 0}
          icon="⏳"
          color="bg-yellow-500"
        />
        <StatCard
          title="Overdue Payments"
          value={stats?.overdue_payments || 0}
          icon="⚠️"
          color="bg-red-500"
        />
      </div>
      
      {/* Recent Payments */}
      {stats?.recent_payments && stats.recent_payments.length > 0 && (
        <Card title="Recent Payments">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tenant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recent_payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {payment.tenant_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(payment.due_date)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

/**
 * Landlord Dashboard Component
 */
const LandlordDashboard = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Properties"
          value={stats?.total_properties || 0}
          icon="🏢"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Units"
          value={stats?.total_units || 0}
          icon="🏠"
          color="bg-green-500"
        />
        <StatCard
          title="Occupied Units"
          value={stats?.occupied_units || 0}
          icon="✅"
          color="bg-green-600"
        />
        <StatCard
          title="Available Units"
          value={stats?.available_units || 0}
          icon="🔓"
          color="bg-blue-400"
        />
      </div>
      
      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.total_revenue || 0)}
          icon="💰"
          color="bg-green-600"
        />
        <StatCard
          title="Completed Payments"
          value={stats?.completed_payments || 0}
          icon="✅"
          color="bg-green-500"
        />
        <StatCard
          title="Pending Payments"
          value={stats?.pending_payments || 0}
          icon="⏳"
          color="bg-yellow-500"
        />
        <StatCard
          title="Overdue Payments"
          value={stats?.overdue_payments || 0}
          icon="⚠️"
          color="bg-red-500"
        />
      </div>
      
      {/* Recent Payments */}
      {stats?.recent_payments && stats.recent_payments.length > 0 && (
        <Card title="Recent Payments">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tenant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Property
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recent_payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {payment.tenant_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {payment.property_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

/**
 * Tenant Dashboard Component
 */
const TenantDashboard = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Active Lease Information */}
      {stats?.active_lease ? (
        <Card title="My Active Lease">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Property</p>
              <p className="text-lg font-semibold">{stats.active_lease.property_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Unit</p>
              <p className="text-lg font-semibold">{stats.active_lease.unit_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Rent</p>
              <p className="text-lg font-semibold">{formatCurrency(stats.active_lease.monthly_rent)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lease Period</p>
              <p className="text-lg font-semibold">
                {formatDate(stats.active_lease.start_date)} - {formatDate(stats.active_lease.end_date)}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card title="No Active Lease">
          <p className="text-gray-600">You don't have an active lease at the moment.</p>
        </Card>
      )}
      
      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Paid"
          value={formatCurrency(stats?.total_paid || 0)}
          icon="💰"
          color="bg-green-600"
        />
        <StatCard
          title="Completed Payments"
          value={stats?.completed_payments || 0}
          icon="✅"
          color="bg-green-500"
        />
        <StatCard
          title="Pending Payments"
          value={stats?.pending_payments || 0}
          icon="⏳"
          color="bg-yellow-500"
        />
        <StatCard
          title="Overdue Payments"
          value={stats?.overdue_payments || 0}
          icon="⚠️"
          color="bg-red-500"
        />
      </div>
      
      {/* Recent Payments */}
      {stats?.recent_payments && stats.recent_payments.length > 0 && (
        <Card title="My Recent Payments">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Paid Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recent_payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(payment.due_date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {payment.paid_date ? formatDate(payment.paid_date) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

/**
 * Stat Card Component
 * Reusable component for displaying statistics
 */
const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} text-white text-3xl p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

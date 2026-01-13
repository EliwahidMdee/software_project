/**
 * Main App Component
 * 
 * This is the root component of the application.
 * It sets up routing, authentication context, and toast notifications.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Units from './pages/Units';
import Tenants from './pages/Tenants';
import Leases from './pages/Leases';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import Documents from './pages/Documents';
import Notifications from './pages/Notifications';

/**
 * Protected Route Component
 * 
 * This wraps routes that require authentication.
 * If user is not authenticated, redirects to login page.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

/**
 * Layout Component
 * 
 * Wraps authenticated pages with Navbar and Sidebar.
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

/**
 * Main App Component
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Toast notifications container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          
          {/* Application Routes */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Properties Page */}
            <Route
              path="/properties"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Properties />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Units Page */}
            <Route
              path="/units"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Units />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Tenants Page */}
            <Route
              path="/tenants"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Tenants />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Leases Page */}
            <Route
              path="/leases"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Leases />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Payments />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Expenses Page */}
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Expenses />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Documents Page */}
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Documents />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Notifications Page */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Notifications />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-6">
                      <h1 className="text-3xl font-bold">Users</h1>
                      <p className="text-gray-600 mt-2">Users page coming soon...</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/my-lease"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-6">
                      <h1 className="text-3xl font-bold">My Lease</h1>
                      <p className="text-gray-600 mt-2">Lease details coming soon...</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 Page */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">Page not found</p>
                    <a
                      href="/dashboard"
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Go to Dashboard
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

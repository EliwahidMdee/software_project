/**
 * Helper Utilities
 * 
 * This file contains utility functions used throughout the application
 * for formatting, validation, and other common tasks.
 */

/**
 * Format currency values
 * 
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount || 0);
};

/**
 * Format date values
 * 
 * @param {string|Date} date - The date to format
 * @param {string} format - Format type ('short', 'long', 'medium')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  const options = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
  };
  
  return new Intl.DateTimeFormat('en-US', options[format] || options.short).format(dateObj);
};

/**
 * Get status badge color
 * 
 * @param {string} status - The status value
 * @returns {string} Tailwind CSS classes for status badge
 */
export const getStatusColor = (status) => {
  const statusColors = {
    // Lease/Unit status
    active: 'bg-green-100 text-green-800',
    occupied: 'bg-green-100 text-green-800',
    available: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-red-100 text-red-800',
    terminated: 'bg-gray-100 text-gray-800',
    vacant: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-orange-100 text-orange-800',
    partially_occupied: 'bg-yellow-100 text-yellow-800',
    reserved: 'bg-purple-100 text-purple-800',
    
    // Payment status
    completed: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    partial: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-gray-100 text-gray-800',
    
    // Notification priority
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
    
    // Notification status
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get initials from name
 * 
 * @param {string} name - Full name
 * @returns {string} Initials (e.g., "John Doe" -> "JD")
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  const names = name.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
};

/**
 * Validate email format
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * 
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
export const isValidPhone = (phone) => {
  // Allow digits, spaces, hyphens, plus signs, and parentheses
  const phoneRegex = /^[\d\s+()-]+$/;
  return phone.length >= 10 && phoneRegex.test(phone);
};

/**
 * Calculate days remaining until a date
 * 
 * @param {string|Date} date - Target date
 * @returns {number} Number of days remaining (negative if past)
 */
export const daysUntil = (date) => {
  if (!date) return 0;
  
  const targetDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Truncate text to specified length
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Convert file to base64
 * 
 * @param {File} file - File object
 * @returns {Promise<string>} Base64 encoded file
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Debounce function
 * Delays execution of a function until after a specified time has passed
 * 
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Group array items by a property
 * 
 * @param {Array} array - Array to group
 * @param {string} key - Property to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Calculate occupancy rate
 * 
 * @param {number} occupied - Number of occupied units
 * @param {number} total - Total number of units
 * @returns {number} Occupancy rate percentage
 */
export const calculateOccupancyRate = (occupied, total) => {
  if (total === 0) return 0;
  return Math.round((occupied / total) * 100);
};

/**
 * Pluralize a word based on count
 * Helper function to handle singular/plural forms
 * 
 * @param {number} count - The count to check
 * @param {string} singular - Singular form of the word
 * @param {string} plural - Plural form of the word (optional, defaults to singular + 's')
 * @returns {string} Correctly pluralized word
 */
export const pluralize = (count, singular, plural = null) => {
  if (count === 1) return singular;
  return plural || `${singular}s`;
};

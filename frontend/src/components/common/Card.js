/**
 * Card Component
 * 
 * A reusable card component for displaying content.
 * Used throughout the app for consistent styling.
 * 
 * Props:
 * - title: Card title (optional)
 * - children: Card content
 * - className: Additional CSS classes
 * - actions: Action buttons for the card header (optional)
 */

import React from 'react';

const Card = ({ title, children, className = '', actions }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Card Header - only show if title or actions exist */}
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      
      {/* Card Body */}
      <div className="px-6 py-4">
        {children}
      </div>
    </div>
  );
};

export default Card;

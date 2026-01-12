"""
Custom Permissions for Rental Management System

This file defines custom permission classes for role-based access control.
Different user roles (Admin, Landlord, Tenant) have different permissions.
"""

from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    Permission class that only allows admin users.
    
    Admins have full access to all resources.
    """
    
    def has_permission(self, request, view):
        """
        Check if user is authenticated and has admin role
        """
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsLandlord(permissions.BasePermission):
    """
    Permission class that only allows landlord users.
    
    Landlords can manage their own properties, units, and leases.
    """
    
    def has_permission(self, request, view):
        """
        Check if user is authenticated and has landlord role
        """
        return request.user and request.user.is_authenticated and request.user.role == 'landlord'


class IsTenant(permissions.BasePermission):
    """
    Permission class that only allows tenant users.
    
    Tenants can view their own lease and payment information.
    """
    
    def has_permission(self, request, view):
        """
        Check if user is authenticated and has tenant role
        """
        return request.user and request.user.is_authenticated and request.user.role == 'tenant'


class IsAdminOrLandlord(permissions.BasePermission):
    """
    Permission class that allows admin or landlord users.
    
    Used for resources that both admins and landlords should manage.
    """
    
    def has_permission(self, request, view):
        """
        Check if user is admin or landlord
        """
        return (
            request.user 
            and request.user.is_authenticated 
            and request.user.role in ['admin', 'landlord']
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission class that checks object-level permissions.
    
    Allows owners of an object or admins to access it.
    Useful for ensuring landlords can only access their own properties.
    """
    
    def has_object_permission(self, request, view, obj):
        """
        Check if user is admin or the owner of the object
        """
        # Admin can access everything
        if request.user.role == 'admin':
            return True
        
        # Check if object has a landlord field
        if hasattr(obj, 'landlord'):
            return obj.landlord == request.user
        
        # Check if object has a user field
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False


class ReadOnly(permissions.BasePermission):
    """
    Permission class for read-only access.
    
    Allows GET, HEAD, OPTIONS requests only.
    """
    
    def has_permission(self, request, view):
        """
        Allow read-only methods for authenticated users
        """
        return request.method in permissions.SAFE_METHODS

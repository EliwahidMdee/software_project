"""
URL Configuration for API

This file defines all the URL patterns for the API endpoints.
It routes incoming HTTP requests to the appropriate views.

The API uses Django REST Framework's DefaultRouter which automatically
generates URL patterns for ViewSets (list, create, retrieve, update, delete).
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    # Authentication views
    register_user,
    get_current_user,
    update_user_profile,
    dashboard_stats,
    
    # ViewSets
    UserViewSet,
    PropertyViewSet,
    PropertyImageViewSet,
    UnitViewSet,
    TenantViewSet,
    LeaseViewSet,
    PaymentViewSet,
    ExpenseViewSet,
    DocumentViewSet,
    NotificationViewSet,
    AccountViewSet,
    JournalEntryViewSet,
    JournalEntryLineViewSet,
)

# Create a router and register our viewsets with it
# The router automatically generates URL patterns for us
router = DefaultRouter()

# Register all viewsets
# This creates endpoints like /api/properties/, /api/properties/{id}/, etc.
router.register(r'users', UserViewSet, basename='user')
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'property-images', PropertyImageViewSet, basename='propertyimage')
router.register(r'units', UnitViewSet, basename='unit')
router.register(r'tenants', TenantViewSet, basename='tenant')
router.register(r'leases', LeaseViewSet, basename='lease')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'accounts', AccountViewSet, basename='account')
router.register(r'journal-entries', JournalEntryViewSet, basename='journalentry')
router.register(r'journal-entry-lines', JournalEntryLineViewSet, basename='journalentryline')

# Define URL patterns
urlpatterns = [
    # Authentication endpoints
    # JWT Token endpoints for login
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User registration and profile endpoints
    path('auth/register/', register_user, name='register'),
    path('auth/user/', get_current_user, name='current_user'),
    path('auth/user/update/', update_user_profile, name='update_profile'),
    
    # Dashboard statistics endpoint
    path('dashboard/stats/', dashboard_stats, name='dashboard_stats'),
    
    # Include all router-generated URLs
    # This adds all the viewset endpoints (CRUD operations)
    path('', include(router.urls)),
]

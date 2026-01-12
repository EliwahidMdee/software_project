"""
API Views for Rental Management System

This file defines all the API endpoints (views) for the rental management system.
ViewSets provide CRUD operations (Create, Read, Update, Delete) for each model.

We use Django REST Framework's ViewSets which automatically handle:
- List all objects (GET /api/resource/)
- Create new object (POST /api/resource/)
- Retrieve single object (GET /api/resource/id/)
- Update object (PUT/PATCH /api/resource/id/)
- Delete object (DELETE /api/resource/id/)
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta

from .models import (
    Property, PropertyImage, Unit, Tenant, Lease, Payment,
    Expense, Document, Notification, Account, JournalEntry, JournalEntryLine
)
from .serializers import (
    UserSerializer, UserRegistrationSerializer, PropertySerializer,
    PropertyImageSerializer, UnitSerializer, TenantSerializer, LeaseSerializer,
    PaymentSerializer, ExpenseSerializer, DocumentSerializer, NotificationSerializer,
    AccountSerializer, JournalEntrySerializer, JournalEntryLineSerializer
)
from .permissions import IsAdmin, IsLandlord, IsTenant, IsAdminOrLandlord, IsOwnerOrAdmin

User = get_user_model()


# ==================== AUTHENTICATION VIEWS ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    User Registration Endpoint
    
    Allows new users to register for an account.
    POST /api/auth/register/
    
    Request body should include:
    - username
    - email
    - password
    - password2 (confirmation)
    - first_name
    - last_name
    - role (admin, landlord, tenant)
    - phone
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """
    Get Current User Information
    
    Returns information about the currently authenticated user.
    GET /api/auth/user/
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """
    Update User Profile
    
    Allows users to update their own profile information.
    PUT /api/auth/user/update/
    """
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Profile updated successfully',
            'user': serializer.data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== USER VIEWSET ====================

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User model
    
    Provides CRUD operations for users.
    Only admins can manage all users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'username']


# ==================== PROPERTY VIEWSET ====================

class PropertyViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Property model
    
    Landlords can manage their own properties.
    Admins can manage all properties.
    Tenants can view properties they're leasing.
    """
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['property_type', 'status', 'landlord', 'region', 'district']
    search_fields = ['name', 'description', 'street', 'region', 'district']
    ordering_fields = ['created_at', 'name']
    
    def get_queryset(self):
        """
        Filter properties based on user role.
        
        - Admins see all properties
        - Landlords see only their properties
        - Tenants see properties they're leasing
        """
        user = self.request.user
        if user.role == 'admin':
            return Property.objects.all()
        elif user.role == 'landlord':
            return Property.objects.filter(landlord=user)
        elif user.role == 'tenant':
            # Get properties where tenant has an active lease
            tenant_profile = getattr(user, 'tenant_profile', None)
            if tenant_profile:
                return Property.objects.filter(
                    leases__tenant=tenant_profile
                ).distinct()
            return Property.objects.none()
        return Property.objects.none()
    
    def perform_create(self, serializer):
        """
        Set landlord to current user when creating a property.
        """
        if self.request.user.role == 'landlord':
            serializer.save(landlord=self.request.user)
        else:
            serializer.save()


# ==================== PROPERTY IMAGE VIEWSET ====================

class PropertyImageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for PropertyImage model
    
    Manages property images/photos.
    """
    serializer_class = PropertyImageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter images based on user role and property access.
        """
        user = self.request.user
        if user.role == 'admin':
            return PropertyImage.objects.all()
        elif user.role == 'landlord':
            return PropertyImage.objects.filter(property__landlord=user)
        elif user.role == 'tenant':
            tenant_profile = getattr(user, 'tenant_profile', None)
            if tenant_profile:
                return PropertyImage.objects.filter(
                    property__leases__tenant=tenant_profile
                ).distinct()
            return PropertyImage.objects.none()
        return PropertyImage.objects.none()


# ==================== UNIT VIEWSET ====================

class UnitViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Unit model
    
    Manages individual rental units within properties.
    """
    serializer_class = UnitSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['property', 'status', 'floor']
    search_fields = ['unit_number', 'description']
    ordering_fields = ['created_at', 'unit_number', 'rent_amount']
    
    def get_queryset(self):
        """
        Filter units based on user role and property access.
        """
        user = self.request.user
        if user.role == 'admin':
            return Unit.objects.all()
        elif user.role == 'landlord':
            return Unit.objects.filter(property__landlord=user)
        elif user.role == 'tenant':
            tenant_profile = getattr(user, 'tenant_profile', None)
            if tenant_profile:
                return Unit.objects.filter(
                    property__leases__tenant=tenant_profile
                ).distinct()
            return Unit.objects.none()
        return Unit.objects.none()


# ==================== TENANT VIEWSET ====================

class TenantViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Tenant model
    
    Manages tenant profiles and information.
    """
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['user']
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name', 'phone']
    ordering_fields = ['created_at']
    
    def get_queryset(self):
        """
        Filter tenants based on user role.
        
        - Admins see all tenants
        - Landlords see tenants leasing their properties
        - Tenants see only their own profile
        """
        user = self.request.user
        if user.role == 'admin':
            return Tenant.objects.all()
        elif user.role == 'landlord':
            return Tenant.objects.filter(
                leases__property__landlord=user
            ).distinct()
        elif user.role == 'tenant':
            return Tenant.objects.filter(user=user)
        return Tenant.objects.none()


# ==================== LEASE VIEWSET ====================

class LeaseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Lease model
    
    Manages lease agreements linking tenants to units.
    """
    serializer_class = LeaseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['property', 'unit', 'tenant', 'landlord', 'status']
    search_fields = ['property__name', 'unit__unit_number', 'tenant__user__username']
    ordering_fields = ['created_at', 'start_date', 'end_date']
    
    def get_queryset(self):
        """
        Filter leases based on user role.
        """
        user = self.request.user
        if user.role == 'admin':
            return Lease.objects.all()
        elif user.role == 'landlord':
            return Lease.objects.filter(landlord=user)
        elif user.role == 'tenant':
            tenant_profile = getattr(user, 'tenant_profile', None)
            if tenant_profile:
                return Lease.objects.filter(tenant=tenant_profile)
            return Lease.objects.none()
        return Lease.objects.none()


# ==================== PAYMENT VIEWSET ====================

class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Payment model
    
    Manages rent payments and other financial transactions.
    """
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tenant', 'property', 'lease', 'status', 'payment_method']
    search_fields = ['transaction_id', 'tenant__user__username']
    ordering_fields = ['created_at', 'due_date', 'paid_date', 'amount']
    
    def get_queryset(self):
        """
        Filter payments based on user role.
        """
        user = self.request.user
        if user.role == 'admin':
            return Payment.objects.all()
        elif user.role == 'landlord':
            return Payment.objects.filter(property__landlord=user)
        elif user.role == 'tenant':
            tenant_profile = getattr(user, 'tenant_profile', None)
            if tenant_profile:
                return Payment.objects.filter(tenant=tenant_profile)
            return Payment.objects.none()
        return Payment.objects.none()


# ==================== EXPENSE VIEWSET ====================

class ExpenseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Expense model
    
    Manages property-related expenses.
    """
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated, IsAdminOrLandlord]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['property', 'category']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'date', 'amount']
    
    def get_queryset(self):
        """
        Filter expenses based on user role.
        """
        user = self.request.user
        if user.role == 'admin':
            return Expense.objects.all()
        elif user.role == 'landlord':
            return Expense.objects.filter(property__landlord=user)
        return Expense.objects.none()


# ==================== DOCUMENT VIEWSET ====================

class DocumentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Document model
    
    Manages file uploads and document storage.
    """
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['file_type', 'lease', 'user', 'property']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at']
    
    def get_queryset(self):
        """
        Filter documents based on user role and access.
        """
        user = self.request.user
        if user.role == 'admin':
            return Document.objects.all()
        elif user.role == 'landlord':
            return Document.objects.filter(
                Q(property__landlord=user) | Q(uploaded_by=user)
            )
        elif user.role == 'tenant':
            return Document.objects.filter(
                Q(user=user) | Q(uploaded_by=user)
            )
        return Document.objects.none()
    
    def perform_create(self, serializer):
        """
        Set uploaded_by to current user when creating a document.
        """
        serializer.save(uploaded_by=self.request.user)


# ==================== NOTIFICATION VIEWSET ====================

class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Notification model
    
    Manages communication between tenants and landlords.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['lease', 'category', 'priority', 'status']
    search_fields = ['subject', 'description']
    ordering_fields = ['created_at', 'priority']
    
    def get_queryset(self):
        """
        Filter notifications based on user role.
        """
        user = self.request.user
        if user.role == 'admin':
            return Notification.objects.all()
        elif user.role == 'landlord':
            return Notification.objects.filter(lease__landlord=user)
        elif user.role == 'tenant':
            tenant_profile = getattr(user, 'tenant_profile', None)
            if tenant_profile:
                return Notification.objects.filter(lease__tenant=tenant_profile)
            return Notification.objects.none()
        return Notification.objects.none()
    
    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        """
        Custom action for landlords to respond to notifications.
        
        POST /api/notifications/{id}/respond/
        Body: { "response": "..." }
        """
        notification = self.get_object()
        response_text = request.data.get('response', '')
        
        if not response_text:
            return Response(
                {'error': 'Response text is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        notification.landlord_response = response_text
        notification.responded_by = request.user
        notification.responded_at = timezone.now()
        notification.status = 'in_progress'
        notification.save()
        
        serializer = self.get_serializer(notification)
        return Response(serializer.data)


# ==================== ACCOUNTING VIEWSETS ====================

class AccountViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Account model
    
    Manages chart of accounts for financial tracking.
    """
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated, IsAdminOrLandlord]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['account_type', 'is_active']
    search_fields = ['code', 'name', 'description']
    ordering_fields = ['code', 'name']


class JournalEntryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for JournalEntry model
    
    Manages journal entries for double-entry bookkeeping.
    """
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated, IsAdminOrLandlord]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['entry_date', 'created_by']
    ordering_fields = ['entry_date', 'created_at']
    
    def perform_create(self, serializer):
        """
        Set created_by to current user when creating a journal entry.
        """
        serializer.save(created_by=self.request.user)


class JournalEntryLineViewSet(viewsets.ModelViewSet):
    """
    ViewSet for JournalEntryLine model
    
    Manages individual debit/credit lines in journal entries.
    """
    queryset = JournalEntryLine.objects.all()
    serializer_class = JournalEntryLineSerializer
    permission_classes = [IsAuthenticated, IsAdminOrLandlord]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['journal_entry', 'account']


# ==================== DASHBOARD STATISTICS ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    Dashboard Statistics Endpoint
    
    Returns statistics for the dashboard based on user role.
    GET /api/dashboard/stats/
    
    Returns different statistics for:
    - Admin: System-wide statistics
    - Landlord: Their properties, tenants, payments
    - Tenant: Their lease and payment info
    """
    user = request.user
    
    if user.role == 'admin':
        # Admin sees system-wide statistics
        stats = {
            'total_properties': Property.objects.count(),
            'total_units': Unit.objects.count(),
            'total_tenants': Tenant.objects.count(),
            'total_leases': Lease.objects.count(),
            'active_leases': Lease.objects.filter(status='active').count(),
            'total_payments': Payment.objects.count(),
            'completed_payments': Payment.objects.filter(status='completed').count(),
            'pending_payments': Payment.objects.filter(status='pending').count(),
            'overdue_payments': Payment.objects.filter(status='overdue').count(),
            'total_revenue': Payment.objects.filter(status='completed').aggregate(
                total=Sum('amount')
            )['total'] or 0,
            'recent_payments': PaymentSerializer(
                Payment.objects.order_by('-created_at')[:5], 
                many=True
            ).data,
        }
    
    elif user.role == 'landlord':
        # Landlord sees their property statistics
        properties = Property.objects.filter(landlord=user)
        units = Unit.objects.filter(property__landlord=user)
        leases = Lease.objects.filter(landlord=user)
        payments = Payment.objects.filter(property__landlord=user)
        
        stats = {
            'total_properties': properties.count(),
            'total_units': units.count(),
            'occupied_units': units.filter(status='occupied').count(),
            'available_units': units.filter(status='available').count(),
            'total_tenants': Tenant.objects.filter(leases__landlord=user).distinct().count(),
            'active_leases': leases.filter(status='active').count(),
            'total_payments': payments.count(),
            'completed_payments': payments.filter(status='completed').count(),
            'pending_payments': payments.filter(status='pending').count(),
            'overdue_payments': payments.filter(status='overdue').count(),
            'total_revenue': payments.filter(status='completed').aggregate(
                total=Sum('amount')
            )['total'] or 0,
            'recent_payments': PaymentSerializer(
                payments.order_by('-created_at')[:5], 
                many=True
            ).data,
            'recent_notifications': NotificationSerializer(
                Notification.objects.filter(lease__landlord=user).order_by('-created_at')[:5],
                many=True
            ).data,
        }
    
    elif user.role == 'tenant':
        # Tenant sees their lease and payment info
        tenant_profile = getattr(user, 'tenant_profile', None)
        if tenant_profile:
            leases = Lease.objects.filter(tenant=tenant_profile)
            payments = Payment.objects.filter(tenant=tenant_profile)
            
            stats = {
                'active_lease': LeaseSerializer(
                    leases.filter(status='active').first()
                ).data if leases.filter(status='active').exists() else None,
                'total_payments': payments.count(),
                'completed_payments': payments.filter(status='completed').count(),
                'pending_payments': payments.filter(status='pending').count(),
                'overdue_payments': payments.filter(status='overdue').count(),
                'total_paid': payments.filter(status='completed').aggregate(
                    total=Sum('amount')
                )['total'] or 0,
                'recent_payments': PaymentSerializer(
                    payments.order_by('-created_at')[:5], 
                    many=True
                ).data,
                'my_notifications': NotificationSerializer(
                    Notification.objects.filter(lease__tenant=tenant_profile).order_by('-created_at')[:5],
                    many=True
                ).data,
            }
        else:
            stats = {
                'message': 'No tenant profile found'
            }
    
    else:
        stats = {
            'message': 'Invalid user role'
        }
    
    return Response(stats)

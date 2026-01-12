"""
Serializers for Rental Management System API

Serializers convert Django model instances to JSON format (serialization)
and validate incoming JSON data before creating/updating models (deserialization).

This file contains serializers for all models in the system.
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Property, PropertyImage, Unit, Tenant, Lease, Payment,
    Expense, Document, Notification, Account, JournalEntry, JournalEntryLine
)

User = get_user_model()


# ==================== USER SERIALIZERS ====================
class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    
    Handles user registration and profile information.
    Excludes sensitive password field in responses.
    """
    
    # Write-only field for password (not included in responses)
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone', 'profile_picture', 'password',
            'must_change_password', 'last_login_at', 'created_at'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    def create(self, validated_data):
        """
        Create a new user with hashed password
        
        The password needs to be hashed before storing in database.
        Django's create_user method handles this automatically.
        """
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user
    
    def update(self, instance, validated_data):
        """
        Update user, handling password hashing if password is being changed
        """
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer specifically for user registration
    
    Requires password and password confirmation.
    """
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name', 'role', 'phone'
        ]
    
    def validate(self, attrs):
        """
        Validate that passwords match
        """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs
    
    def create(self, validated_data):
        """
        Create user after removing password2 field
        """
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user


# ==================== PROPERTY SERIALIZERS ====================
class PropertyImageSerializer(serializers.ModelSerializer):
    """
    Serializer for PropertyImage model
    
    Handles image uploads for properties.
    """
    
    class Meta:
        model = PropertyImage
        fields = ['id', 'property', 'image', 'caption', 'is_primary', 'created_at']
        read_only_fields = ['created_at']


class PropertySerializer(serializers.ModelSerializer):
    """
    Serializer for Property model
    
    Includes nested property images and landlord information.
    """
    
    # Nested serializers for related data
    images = PropertyImageSerializer(many=True, read_only=True)
    landlord_name = serializers.CharField(source='landlord.get_full_name', read_only=True)
    
    class Meta:
        model = Property
        fields = [
            'id', 'landlord', 'landlord_name', 'name', 'property_type',
            'description', 'region', 'district', 'ward', 'street',
            'bedrooms', 'bathrooms', 'area_sqft', 'payment_terms',
            'status', 'images', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, attrs):
        """
        Validate property data
        """
        # Ensure landlord has landlord role
        if 'landlord' in attrs and attrs['landlord'].role != 'landlord':
            raise serializers.ValidationError({
                "landlord": "Selected user must have landlord role."
            })
        return attrs


# ==================== UNIT SERIALIZERS ====================
class UnitSerializer(serializers.ModelSerializer):
    """
    Serializer for Unit model
    
    Represents individual rental units within properties.
    """
    
    property_name = serializers.CharField(source='property.name', read_only=True)
    
    class Meta:
        model = Unit
        fields = [
            'id', 'property', 'property_name', 'unit_number', 'floor',
            'bedrooms', 'bathrooms', 'rent_amount', 'status',
            'description', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


# ==================== TENANT SERIALIZERS ====================
class TenantSerializer(serializers.ModelSerializer):
    """
    Serializer for Tenant model
    
    Includes user information and tenant-specific details.
    """
    
    user_details = UserSerializer(source='user', read_only=True)
    tenant_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Tenant
        fields = [
            'id', 'user', 'user_details', 'tenant_name', 'phone',
            'alternative_phone', 'identification_type', 'identification_number',
            'emergency_contact_name', 'emergency_contact_phone',
            'emergency_contact_relationship', 'occupation', 'employer',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, attrs):
        """
        Validate tenant data
        """
        # Ensure user has tenant role
        if 'user' in attrs and attrs['user'].role != 'tenant':
            raise serializers.ValidationError({
                "user": "Selected user must have tenant role."
            })
        return attrs


# ==================== LEASE SERIALIZERS ====================
class LeaseSerializer(serializers.ModelSerializer):
    """
    Serializer for Lease model
    
    Links tenants to units with lease terms.
    """
    
    property_name = serializers.CharField(source='property.name', read_only=True)
    unit_number = serializers.CharField(source='unit.unit_number', read_only=True)
    tenant_name = serializers.CharField(source='tenant.user.get_full_name', read_only=True)
    landlord_name = serializers.CharField(source='landlord.get_full_name', read_only=True)
    
    class Meta:
        model = Lease
        fields = [
            'id', 'property', 'property_name', 'unit', 'unit_number',
            'tenant', 'tenant_name', 'landlord', 'landlord_name',
            'start_date', 'end_date', 'monthly_rent', 'security_deposit',
            'status', 'document', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, attrs):
        """
        Validate lease data
        """
        # Ensure end date is after start date
        if 'start_date' in attrs and 'end_date' in attrs:
            if attrs['end_date'] <= attrs['start_date']:
                raise serializers.ValidationError({
                    "end_date": "End date must be after start date."
                })
        
        # Ensure unit belongs to the property
        if 'property' in attrs and 'unit' in attrs:
            if attrs['unit'].property != attrs['property']:
                raise serializers.ValidationError({
                    "unit": "Selected unit does not belong to the selected property."
                })
        
        return attrs


# ==================== PAYMENT SERIALIZERS ====================
class PaymentSerializer(serializers.ModelSerializer):
    """
    Serializer for Payment model
    
    Tracks rent payments and other financial transactions.
    """
    
    tenant_name = serializers.CharField(source='tenant.user.get_full_name', read_only=True)
    property_name = serializers.CharField(source='property.name', read_only=True)
    lease_info = serializers.CharField(source='lease.__str__', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'tenant', 'tenant_name', 'property', 'property_name',
            'lease', 'lease_info', 'amount', 'payment_method',
            'transaction_id', 'due_date', 'paid_date', 'status',
            'proof_document', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, attrs):
        """
        Validate payment data
        """
        # If status is completed, paid_date should be set
        if attrs.get('status') == 'completed' and not attrs.get('paid_date'):
            raise serializers.ValidationError({
                "paid_date": "Paid date is required when status is completed."
            })
        
        return attrs


# ==================== EXPENSE SERIALIZERS ====================
class ExpenseSerializer(serializers.ModelSerializer):
    """
    Serializer for Expense model
    
    Tracks property-related expenses.
    """
    
    property_name = serializers.CharField(source='property.name', read_only=True)
    
    class Meta:
        model = Expense
        fields = [
            'id', 'property', 'property_name', 'title', 'description',
            'category', 'amount', 'date', 'receipt',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


# ==================== DOCUMENT SERIALIZERS ====================
class DocumentSerializer(serializers.ModelSerializer):
    """
    Serializer for Document model
    
    General document management for various file types.
    """
    
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    
    class Meta:
        model = Document
        fields = [
            'id', 'lease', 'user', 'property', 'title', 'file',
            'file_type', 'description', 'uploaded_by', 'uploaded_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'uploaded_by']


# ==================== NOTIFICATION SERIALIZERS ====================
class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for Notification model
    
    Communication system for tenants and landlords.
    """
    
    lease_info = serializers.CharField(source='lease.__str__', read_only=True)
    responded_by_name = serializers.CharField(source='responded_by.get_full_name', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'lease', 'lease_info', 'category', 'priority',
            'subject', 'description', 'status', 'landlord_response',
            'responded_at', 'responded_by', 'responded_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


# ==================== ACCOUNTING SERIALIZERS ====================
class AccountSerializer(serializers.ModelSerializer):
    """
    Serializer for Account model
    
    Chart of accounts for financial tracking.
    """
    
    parent_account_name = serializers.CharField(source='parent_account.name', read_only=True)
    
    class Meta:
        model = Account
        fields = [
            'id', 'code', 'name', 'account_type', 'description',
            'balance', 'parent_account', 'parent_account_name',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class JournalEntryLineSerializer(serializers.ModelSerializer):
    """
    Serializer for JournalEntryLine model
    
    Individual debit/credit lines in a journal entry.
    """
    
    account_name = serializers.CharField(source='account.name', read_only=True)
    
    class Meta:
        model = JournalEntryLine
        fields = [
            'id', 'journal_entry', 'account', 'account_name',
            'debit', 'credit', 'description', 'created_at'
        ]
        read_only_fields = ['created_at']


class JournalEntrySerializer(serializers.ModelSerializer):
    """
    Serializer for JournalEntry model
    
    Journal entries for double-entry bookkeeping.
    Includes nested lines for debits and credits.
    """
    
    lines = JournalEntryLineSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = JournalEntry
        fields = [
            'id', 'entry_date', 'description', 'reference',
            'created_by', 'created_by_name', 'lines',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by']

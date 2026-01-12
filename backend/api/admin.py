"""
Django Admin Configuration

This file configures how models appear in the Django admin panel.
The admin panel provides a user-friendly interface to manage database records.

Access the admin panel at: http://localhost:8000/admin/
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Property, PropertyImage, Unit, Tenant, Lease, Payment,
    Expense, Document, Notification, Account, JournalEntry, JournalEntryLine
)


# ==================== USER ADMIN ====================
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin configuration for User model
    
    Extends Django's default UserAdmin to include custom fields.
    """
    # Fields to display in the user list
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'is_staff']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    # Add custom fields to the user edit form
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {
            'fields': ('role', 'phone', 'profile_picture', 'must_change_password', 'last_login_at')
        }),
    )
    
    # Add custom fields to the user creation form
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Custom Fields', {
            'fields': ('role', 'phone', 'profile_picture')
        }),
    )


# ==================== PROPERTY ADMIN ====================
class PropertyImageInline(admin.TabularInline):
    """
    Inline admin for PropertyImage
    
    Allows editing property images directly from the property edit page.
    """
    model = PropertyImage
    extra = 1
    fields = ['image', 'caption', 'is_primary']


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    """
    Admin configuration for Property model
    """
    list_display = ['name', 'landlord', 'property_type', 'status', 'region', 'district', 'created_at']
    list_filter = ['property_type', 'status', 'region']
    search_fields = ['name', 'description', 'street', 'region', 'district']
    inlines = [PropertyImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('landlord', 'name', 'property_type', 'description')
        }),
        ('Location', {
            'fields': ('region', 'district', 'ward', 'street')
        }),
        ('Details', {
            'fields': ('bedrooms', 'bathrooms', 'area_sqft', 'payment_terms', 'status')
        }),
    )


# ==================== UNIT ADMIN ====================
@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    """
    Admin configuration for Unit model
    """
    list_display = ['unit_number', 'property', 'floor', 'rent_amount', 'status', 'bedrooms', 'bathrooms']
    list_filter = ['status', 'property']
    search_fields = ['unit_number', 'property__name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('property', 'unit_number', 'floor')
        }),
        ('Unit Details', {
            'fields': ('bedrooms', 'bathrooms', 'rent_amount', 'description')
        }),
        ('Status', {
            'fields': ('status',)
        }),
    )


# ==================== TENANT ADMIN ====================
@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    """
    Admin configuration for Tenant model
    """
    list_display = ['user', 'phone', 'identification_number', 'occupation', 'created_at']
    search_fields = ['user__username', 'user__email', 'phone', 'identification_number']
    
    fieldsets = (
        ('User Account', {
            'fields': ('user',)
        }),
        ('Contact Information', {
            'fields': ('phone', 'alternative_phone')
        }),
        ('Identification', {
            'fields': ('identification_type', 'identification_number')
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship')
        }),
        ('Additional Information', {
            'fields': ('occupation', 'employer', 'notes')
        }),
    )


# ==================== LEASE ADMIN ====================
@admin.register(Lease)
class LeaseAdmin(admin.ModelAdmin):
    """
    Admin configuration for Lease model
    """
    list_display = ['property', 'unit', 'tenant', 'landlord', 'start_date', 'end_date', 'monthly_rent', 'status']
    list_filter = ['status', 'start_date', 'end_date']
    search_fields = ['property__name', 'unit__unit_number', 'tenant__user__username']
    
    fieldsets = (
        ('Parties', {
            'fields': ('property', 'unit', 'tenant', 'landlord')
        }),
        ('Lease Terms', {
            'fields': ('start_date', 'end_date', 'monthly_rent', 'security_deposit', 'status')
        }),
        ('Documentation', {
            'fields': ('document', 'notes')
        }),
    )


# ==================== PAYMENT ADMIN ====================
@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """
    Admin configuration for Payment model
    """
    list_display = ['tenant', 'property', 'amount', 'payment_method', 'due_date', 'paid_date', 'status']
    list_filter = ['status', 'payment_method', 'due_date']
    search_fields = ['tenant__user__username', 'transaction_id']
    
    fieldsets = (
        ('Payment Details', {
            'fields': ('tenant', 'property', 'lease', 'amount', 'payment_method', 'transaction_id')
        }),
        ('Dates and Status', {
            'fields': ('due_date', 'paid_date', 'status')
        }),
        ('Documentation', {
            'fields': ('proof_document', 'notes')
        }),
    )


# ==================== EXPENSE ADMIN ====================
@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    """
    Admin configuration for Expense model
    """
    list_display = ['title', 'property', 'category', 'amount', 'date']
    list_filter = ['category', 'date']
    search_fields = ['title', 'description', 'property__name']
    
    fieldsets = (
        ('Expense Information', {
            'fields': ('property', 'title', 'description', 'category')
        }),
        ('Financial Details', {
            'fields': ('amount', 'date')
        }),
        ('Documentation', {
            'fields': ('receipt',)
        }),
    )


# ==================== DOCUMENT ADMIN ====================
@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    """
    Admin configuration for Document model
    """
    list_display = ['title', 'file_type', 'lease', 'user', 'property', 'uploaded_by', 'created_at']
    list_filter = ['file_type', 'created_at']
    search_fields = ['title', 'description']
    
    fieldsets = (
        ('Document Information', {
            'fields': ('title', 'file', 'file_type', 'description')
        }),
        ('Relationships', {
            'fields': ('lease', 'user', 'property', 'uploaded_by')
        }),
    )


# ==================== NOTIFICATION ADMIN ====================
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """
    Admin configuration for Notification model
    """
    list_display = ['subject', 'lease', 'category', 'priority', 'status', 'created_at']
    list_filter = ['category', 'priority', 'status', 'created_at']
    search_fields = ['subject', 'description']
    
    fieldsets = (
        ('Notification Details', {
            'fields': ('lease', 'category', 'priority', 'subject', 'description', 'status')
        }),
        ('Response', {
            'fields': ('landlord_response', 'responded_by', 'responded_at')
        }),
    )


# ==================== ACCOUNTING ADMIN ====================
@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    """
    Admin configuration for Account model
    """
    list_display = ['code', 'name', 'account_type', 'balance', 'is_active']
    list_filter = ['account_type', 'is_active']
    search_fields = ['code', 'name', 'description']
    
    fieldsets = (
        ('Account Information', {
            'fields': ('code', 'name', 'account_type', 'description')
        }),
        ('Financial', {
            'fields': ('balance', 'parent_account')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )


class JournalEntryLineInline(admin.TabularInline):
    """
    Inline admin for JournalEntryLine
    
    Allows editing journal entry lines directly from the journal entry edit page.
    """
    model = JournalEntryLine
    extra = 2
    fields = ['account', 'debit', 'credit', 'description']


@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    """
    Admin configuration for JournalEntry model
    """
    list_display = ['id', 'entry_date', 'description', 'reference', 'created_by', 'created_at']
    list_filter = ['entry_date', 'created_at']
    search_fields = ['description', 'reference']
    inlines = [JournalEntryLineInline]
    
    fieldsets = (
        ('Entry Information', {
            'fields': ('entry_date', 'description', 'reference', 'created_by')
        }),
    )


# Register PropertyImage separately (not inline)
@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    """
    Admin configuration for PropertyImage model
    """
    list_display = ['property', 'caption', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['property__name', 'caption']

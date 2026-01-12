"""
Database Models for Rental Management System

This file defines all the database tables (models) for the rental management system.
Each class represents a table in the database, and each field represents a column.

Models included:
- User: Custom user model with role-based access (Admin, Landlord, Tenant)
- Property: Rental properties with details and location
- PropertyImage: Multiple images for each property
- Unit: Individual units within a property
- Tenant: Tenant profiles with contact info
- Lease: Lease agreements linking tenants to units
- Payment: Payment records for rent and other fees
- Expense: Property-related expenses
- Document: File storage for various documents
- Notification: Communication system for tenants
- Account: Chart of accounts for accounting
- JournalEntry & JournalEntryLine: Double-entry bookkeeping system
"""

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from decimal import Decimal


# ==================== USER MODEL ====================
class User(AbstractUser):
    """
    Custom User Model extending Django's AbstractUser
    
    This model adds role-based access control and additional fields
    for profile management. Users can be Admin, Landlord, or Tenant.
    """
    
    # User roles for access control
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('landlord', 'Landlord'),
        ('tenant', 'Tenant'),
    ]
    
    # Additional fields beyond Django's default User
    role = models.CharField(
        max_length=20, 
        choices=ROLE_CHOICES, 
        default='tenant',
        help_text="User role determines access permissions"
    )
    profile_picture = models.ImageField(
        upload_to='profile_pictures/', 
        null=True, 
        blank=True,
        help_text="User's profile photo"
    )
    phone = models.CharField(
        max_length=20, 
        null=True, 
        blank=True,
        help_text="Contact phone number"
    )
    must_change_password = models.BooleanField(
        default=False,
        help_text="Force user to change password on next login"
    )
    last_login_at = models.DateTimeField(
        null=True, 
        blank=True,
        help_text="Timestamp of last login"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


# ==================== PROPERTY MODEL ====================
class Property(models.Model):
    """
    Property Model
    
    Represents a rental property (building, house, apartment complex, etc.)
    Each property can have multiple units.
    """
    
    # Property types
    PROPERTY_TYPE_CHOICES = [
        ('residential', 'Residential'),
        ('commercial', 'Commercial'),
        ('mixed', 'Mixed Use'),
    ]
    
    # Property status
    STATUS_CHOICES = [
        ('vacant', 'Vacant'),
        ('occupied', 'Occupied'),
        ('partially_occupied', 'Partially Occupied'),
        ('maintenance', 'Under Maintenance'),
    ]
    
    # Relationships
    landlord = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='properties',
        limit_choices_to={'role': 'landlord'},
        help_text="Property owner/landlord"
    )
    
    # Basic information
    name = models.CharField(max_length=200, help_text="Property name or title")
    property_type = models.CharField(
        max_length=20, 
        choices=PROPERTY_TYPE_CHOICES,
        help_text="Type of property"
    )
    description = models.TextField(
        null=True, 
        blank=True,
        help_text="Detailed description of the property"
    )
    
    # Location details
    region = models.CharField(max_length=100, help_text="Region/State")
    district = models.CharField(max_length=100, help_text="District/County")
    ward = models.CharField(
        max_length=100, 
        null=True, 
        blank=True,
        help_text="Ward/Neighborhood"
    )
    street = models.CharField(max_length=200, help_text="Street address")
    
    # Property details
    bedrooms = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Total number of bedrooms"
    )
    bathrooms = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Total number of bathrooms"
    )
    area_sqft = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        null=True, 
        blank=True,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Total area in square feet"
    )
    
    # Payment and status
    payment_terms = models.TextField(
        null=True, 
        blank=True,
        help_text="Payment terms and conditions"
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='vacant',
        help_text="Current property status"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Property'
        verbose_name_plural = 'Properties'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.street}"


# ==================== PROPERTY IMAGE MODEL ====================
class PropertyImage(models.Model):
    """
    Property Image Model
    
    Stores multiple images for each property.
    This allows property listings to have photo galleries.
    """
    
    property = models.ForeignKey(
        Property, 
        on_delete=models.CASCADE, 
        related_name='images',
        help_text="Property this image belongs to"
    )
    image = models.ImageField(
        upload_to='property_images/',
        help_text="Property photo"
    )
    caption = models.CharField(
        max_length=200, 
        null=True, 
        blank=True,
        help_text="Image caption or description"
    )
    is_primary = models.BooleanField(
        default=False,
        help_text="Primary/featured image for the property"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Property Image'
        verbose_name_plural = 'Property Images'
        ordering = ['-is_primary', '-created_at']
    
    def __str__(self):
        return f"Image for {self.property.name}"


# ==================== UNIT MODEL ====================
class Unit(models.Model):
    """
    Unit Model
    
    Represents individual rental units within a property.
    For example, apartments in an apartment building.
    """
    
    # Unit status
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('occupied', 'Occupied'),
        ('maintenance', 'Under Maintenance'),
        ('reserved', 'Reserved'),
    ]
    
    property = models.ForeignKey(
        Property, 
        on_delete=models.CASCADE, 
        related_name='units',
        help_text="Property this unit belongs to"
    )
    unit_number = models.CharField(
        max_length=50,
        help_text="Unit number or identifier (e.g., 'A1', '101')"
    )
    floor = models.IntegerField(
        null=True, 
        blank=True,
        help_text="Floor number"
    )
    bedrooms = models.IntegerField(
        default=1,
        validators=[MinValueValidator(0)],
        help_text="Number of bedrooms in this unit"
    )
    bathrooms = models.IntegerField(
        default=1,
        validators=[MinValueValidator(0)],
        help_text="Number of bathrooms in this unit"
    )
    rent_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Monthly rent amount"
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='available',
        help_text="Current unit status"
    )
    description = models.TextField(
        null=True, 
        blank=True,
        help_text="Unit description and amenities"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Unit'
        verbose_name_plural = 'Units'
        ordering = ['property', 'unit_number']
        # Ensure unit numbers are unique within a property
        unique_together = ['property', 'unit_number']
    
    def __str__(self):
        return f"{self.property.name} - Unit {self.unit_number}"


# ==================== TENANT MODEL ====================
class Tenant(models.Model):
    """
    Tenant Model
    
    Stores additional information about tenants beyond the User model.
    Links to the User model for authentication and basic info.
    """
    
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='tenant_profile',
        limit_choices_to={'role': 'tenant'},
        help_text="User account for this tenant"
    )
    phone = models.CharField(
        max_length=20,
        help_text="Primary phone number"
    )
    alternative_phone = models.CharField(
        max_length=20, 
        null=True, 
        blank=True,
        help_text="Alternative contact number"
    )
    identification_type = models.CharField(
        max_length=50, 
        null=True, 
        blank=True,
        help_text="Type of ID (e.g., Passport, National ID)"
    )
    identification_number = models.CharField(
        max_length=100, 
        null=True, 
        blank=True,
        help_text="ID number"
    )
    
    # Emergency contact
    emergency_contact_name = models.CharField(
        max_length=200, 
        null=True, 
        blank=True,
        help_text="Emergency contact person's name"
    )
    emergency_contact_phone = models.CharField(
        max_length=20, 
        null=True, 
        blank=True,
        help_text="Emergency contact phone number"
    )
    emergency_contact_relationship = models.CharField(
        max_length=100, 
        null=True, 
        blank=True,
        help_text="Relationship to tenant"
    )
    
    # Additional info
    occupation = models.CharField(
        max_length=200, 
        null=True, 
        blank=True,
        help_text="Tenant's occupation"
    )
    employer = models.CharField(
        max_length=200, 
        null=True, 
        blank=True,
        help_text="Employer name"
    )
    notes = models.TextField(
        null=True, 
        blank=True,
        help_text="Additional notes about the tenant"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Tenant'
        verbose_name_plural = 'Tenants'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username}"


# ==================== LEASE MODEL ====================
class Lease(models.Model):
    """
    Lease Model
    
    Represents a lease agreement between a landlord and tenant for a specific unit.
    Tracks lease dates, rent amount, and status.
    """
    
    # Lease status
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('terminated', 'Terminated'),
        ('pending', 'Pending'),
    ]
    
    property = models.ForeignKey(
        Property, 
        on_delete=models.CASCADE, 
        related_name='leases',
        help_text="Property being leased"
    )
    unit = models.ForeignKey(
        Unit, 
        on_delete=models.CASCADE, 
        related_name='leases',
        help_text="Specific unit being leased"
    )
    tenant = models.ForeignKey(
        Tenant, 
        on_delete=models.CASCADE, 
        related_name='leases',
        help_text="Tenant renting the unit"
    )
    landlord = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='landlord_leases',
        limit_choices_to={'role': 'landlord'},
        help_text="Property landlord"
    )
    
    # Lease details
    start_date = models.DateField(help_text="Lease start date")
    end_date = models.DateField(help_text="Lease end date")
    monthly_rent = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Monthly rent amount"
    )
    security_deposit = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(Decimal('0'))],
        help_text="Security deposit amount"
    )
    
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending',
        help_text="Current lease status"
    )
    
    # Documents and notes
    document = models.FileField(
        upload_to='lease_documents/', 
        null=True, 
        blank=True,
        help_text="Signed lease agreement document"
    )
    notes = models.TextField(
        null=True, 
        blank=True,
        help_text="Additional lease terms and notes"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Lease'
        verbose_name_plural = 'Leases'
        ordering = ['-start_date']
    
    def __str__(self):
        return f"Lease: {self.property.name} - {self.unit.unit_number} - {self.tenant}"


# ==================== PAYMENT MODEL ====================
class Payment(models.Model):
    """
    Payment Model
    
    Tracks all rent payments and other financial transactions.
    Links payments to leases and tenants.
    """
    
    # Payment status
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('overdue', 'Overdue'),
        ('partial', 'Partial'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Payment methods
    METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('bank_transfer', 'Bank Transfer'),
        ('mobile_money', 'Mobile Money'),
        ('check', 'Check'),
        ('card', 'Credit/Debit Card'),
    ]
    
    tenant = models.ForeignKey(
        Tenant, 
        on_delete=models.CASCADE, 
        related_name='payments',
        help_text="Tenant making the payment"
    )
    property = models.ForeignKey(
        Property, 
        on_delete=models.CASCADE, 
        related_name='payments',
        help_text="Property the payment is for"
    )
    lease = models.ForeignKey(
        Lease, 
        on_delete=models.CASCADE, 
        related_name='payments',
        help_text="Associated lease agreement"
    )
    
    # Payment details
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Payment amount"
    )
    payment_method = models.CharField(
        max_length=20, 
        choices=METHOD_CHOICES,
        help_text="How the payment was made"
    )
    transaction_id = models.CharField(
        max_length=200, 
        null=True, 
        blank=True,
        help_text="Transaction reference number"
    )
    
    # Payment dates and status
    due_date = models.DateField(help_text="Payment due date")
    paid_date = models.DateField(
        null=True, 
        blank=True,
        help_text="Actual payment date"
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending',
        help_text="Payment status"
    )
    
    # Documentation
    proof_document = models.FileField(
        upload_to='payment_proofs/', 
        null=True, 
        blank=True,
        help_text="Payment receipt or proof"
    )
    notes = models.TextField(
        null=True, 
        blank=True,
        help_text="Payment notes"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
        ordering = ['-due_date']
    
    def __str__(self):
        return f"Payment: {self.tenant} - {self.amount} - {self.status}"


# ==================== EXPENSE MODEL ====================
class Expense(models.Model):
    """
    Expense Model
    
    Tracks property-related expenses for accounting and reporting.
    """
    
    # Expense categories
    CATEGORY_CHOICES = [
        ('maintenance', 'Maintenance'),
        ('repair', 'Repair'),
        ('utilities', 'Utilities'),
        ('insurance', 'Insurance'),
        ('tax', 'Property Tax'),
        ('cleaning', 'Cleaning'),
        ('security', 'Security'),
        ('other', 'Other'),
    ]
    
    property = models.ForeignKey(
        Property, 
        on_delete=models.CASCADE, 
        related_name='expenses',
        help_text="Property this expense is for"
    )
    title = models.CharField(
        max_length=200,
        help_text="Expense title"
    )
    description = models.TextField(
        null=True, 
        blank=True,
        help_text="Detailed description"
    )
    category = models.CharField(
        max_length=20, 
        choices=CATEGORY_CHOICES,
        help_text="Expense category"
    )
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Expense amount"
    )
    date = models.DateField(help_text="Date of expense")
    
    # Documentation
    receipt = models.FileField(
        upload_to='expense_receipts/', 
        null=True, 
        blank=True,
        help_text="Receipt or invoice"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Expense'
        verbose_name_plural = 'Expenses'
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.title} - {self.property.name} - {self.amount}"


# ==================== DOCUMENT MODEL ====================
class Document(models.Model):
    """
    Document Model
    
    General document storage for various types of files.
    Can be linked to leases, users, or properties.
    """
    
    # Document types
    TYPE_CHOICES = [
        ('contract', 'Contract'),
        ('id', 'Identification'),
        ('receipt', 'Receipt'),
        ('invoice', 'Invoice'),
        ('report', 'Report'),
        ('photo', 'Photo'),
        ('other', 'Other'),
    ]
    
    # Relationships (optional - document can belong to lease, user, or property)
    lease = models.ForeignKey(
        Lease, 
        on_delete=models.CASCADE, 
        related_name='documents',
        null=True, 
        blank=True,
        help_text="Associated lease"
    )
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='documents',
        null=True, 
        blank=True,
        help_text="Associated user"
    )
    property = models.ForeignKey(
        Property, 
        on_delete=models.CASCADE, 
        related_name='documents',
        null=True, 
        blank=True,
        help_text="Associated property"
    )
    
    title = models.CharField(
        max_length=200,
        help_text="Document title"
    )
    file = models.FileField(
        upload_to='documents/',
        help_text="Uploaded file"
    )
    file_type = models.CharField(
        max_length=20, 
        choices=TYPE_CHOICES,
        help_text="Type of document"
    )
    description = models.TextField(
        null=True, 
        blank=True,
        help_text="Document description"
    )
    
    uploaded_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='uploaded_documents',
        help_text="User who uploaded this document"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Document'
        verbose_name_plural = 'Documents'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


# ==================== NOTIFICATION MODEL ====================
class Notification(models.Model):
    """
    Notification Model
    
    Communication system for tenants to report issues and receive updates.
    Landlords can respond to notifications.
    """
    
    # Notification categories
    CATEGORY_CHOICES = [
        ('maintenance', 'Maintenance Request'),
        ('complaint', 'Complaint'),
        ('inquiry', 'Inquiry'),
        ('announcement', 'Announcement'),
        ('payment', 'Payment Related'),
        ('other', 'Other'),
    ]
    
    # Priority levels
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    # Notification status
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    lease = models.ForeignKey(
        Lease, 
        on_delete=models.CASCADE, 
        related_name='notifications',
        help_text="Associated lease"
    )
    category = models.CharField(
        max_length=20, 
        choices=CATEGORY_CHOICES,
        help_text="Notification category"
    )
    priority = models.CharField(
        max_length=10, 
        choices=PRIORITY_CHOICES, 
        default='medium',
        help_text="Priority level"
    )
    subject = models.CharField(
        max_length=200,
        help_text="Notification subject"
    )
    description = models.TextField(help_text="Detailed description")
    
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending',
        help_text="Current status"
    )
    
    # Landlord response
    landlord_response = models.TextField(
        null=True, 
        blank=True,
        help_text="Landlord's response"
    )
    responded_at = models.DateTimeField(
        null=True, 
        blank=True,
        help_text="Response timestamp"
    )
    responded_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='notification_responses',
        help_text="User who responded"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.subject} - {self.status}"


# ==================== ACCOUNTING MODELS ====================
class Account(models.Model):
    """
    Account Model
    
    Chart of accounts for double-entry bookkeeping.
    Tracks financial accounts like assets, liabilities, income, expenses.
    """
    
    # Account types
    TYPE_CHOICES = [
        ('asset', 'Asset'),
        ('liability', 'Liability'),
        ('equity', 'Equity'),
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]
    
    code = models.CharField(
        max_length=20, 
        unique=True,
        help_text="Unique account code"
    )
    name = models.CharField(
        max_length=200,
        help_text="Account name"
    )
    account_type = models.CharField(
        max_length=20, 
        choices=TYPE_CHOICES,
        help_text="Type of account"
    )
    description = models.TextField(
        null=True, 
        blank=True,
        help_text="Account description"
    )
    balance = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0,
        help_text="Current account balance"
    )
    
    parent_account = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='sub_accounts',
        help_text="Parent account for hierarchy"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Is this account active?"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Account'
        verbose_name_plural = 'Accounts'
        ordering = ['code']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class JournalEntry(models.Model):
    """
    Journal Entry Model
    
    Represents a journal entry in double-entry bookkeeping.
    Each entry contains multiple lines (debits and credits).
    """
    
    entry_date = models.DateField(help_text="Date of the journal entry")
    description = models.TextField(help_text="Entry description")
    reference = models.CharField(
        max_length=100, 
        null=True, 
        blank=True,
        help_text="Reference number or document"
    )
    
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True,
        help_text="User who created this entry"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Journal Entry'
        verbose_name_plural = 'Journal Entries'
        ordering = ['-entry_date']
    
    def __str__(self):
        return f"Entry {self.id} - {self.entry_date}"


class JournalEntryLine(models.Model):
    """
    Journal Entry Line Model
    
    Individual debit or credit line in a journal entry.
    Each journal entry must have balanced debits and credits.
    """
    
    journal_entry = models.ForeignKey(
        JournalEntry, 
        on_delete=models.CASCADE, 
        related_name='lines',
        help_text="Parent journal entry"
    )
    account = models.ForeignKey(
        Account, 
        on_delete=models.PROTECT, 
        related_name='journal_lines',
        help_text="Account being debited or credited"
    )
    
    debit = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(Decimal('0'))],
        help_text="Debit amount"
    )
    credit = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(Decimal('0'))],
        help_text="Credit amount"
    )
    
    description = models.TextField(
        null=True, 
        blank=True,
        help_text="Line item description"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Journal Entry Line'
        verbose_name_plural = 'Journal Entry Lines'
    
    def __str__(self):
        return f"{self.account.name} - Dr: {self.debit}, Cr: {self.credit}"

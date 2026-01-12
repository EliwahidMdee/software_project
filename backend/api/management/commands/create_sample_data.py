"""
Django Management Command: Create Sample Data

This command creates sample data for testing the application.
It creates users, properties, units, tenants, leases, and payments.

Usage:
    python manage.py create_sample_data
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import (
    Property, PropertyImage, Unit, Tenant, Lease, Payment, Expense, Notification
)
from datetime import datetime, timedelta
from decimal import Decimal

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates sample data for testing the rental management system'
    
    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample data...')
        
        # Create Users
        self.stdout.write('Creating users...')
        admin = self.create_admin()
        landlords = self.create_landlords()
        tenants = self.create_tenants()
        
        # Create Properties
        self.stdout.write('Creating properties...')
        properties = self.create_properties(landlords)
        
        # Create Units
        self.stdout.write('Creating units...')
        units = self.create_units(properties)
        
        # Create Tenant Profiles
        self.stdout.write('Creating tenant profiles...')
        tenant_profiles = self.create_tenant_profiles(tenants)
        
        # Create Leases
        self.stdout.write('Creating leases...')
        leases = self.create_leases(properties, units, tenant_profiles, landlords)
        
        # Create Payments
        self.stdout.write('Creating payments...')
        self.create_payments(leases, tenant_profiles, properties)
        
        # Create Expenses
        self.stdout.write('Creating expenses...')
        self.create_expenses(properties)
        
        # Create Notifications
        self.stdout.write('Creating notifications...')
        self.create_notifications(leases)
        
        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))
        self.stdout.write('')
        self.stdout.write('Test Login Credentials:')
        self.stdout.write('  Admin: username=admin, password=admin123')
        self.stdout.write('  Landlord: username=landlord1, password=landlord123')
        self.stdout.write('  Tenant: username=tenant1, password=tenant123')
    
    def create_admin(self):
        """Create admin user"""
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@rental.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(f'  Created admin user: {admin.username}')
        return admin
    
    def create_landlords(self):
        """Create landlord users"""
        landlords = []
        landlord_data = [
            {'username': 'landlord1', 'first_name': 'John', 'last_name': 'Smith'},
            {'username': 'landlord2', 'first_name': 'Jane', 'last_name': 'Doe'},
        ]
        
        for data in landlord_data:
            landlord, created = User.objects.get_or_create(
                username=data['username'],
                defaults={
                    'email': f"{data['username']}@rental.com",
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'role': 'landlord',
                }
            )
            if created:
                landlord.set_password('landlord123')
                landlord.save()
                self.stdout.write(f'  Created landlord: {landlord.username}')
            landlords.append(landlord)
        
        return landlords
    
    def create_tenants(self):
        """Create tenant users"""
        tenants = []
        tenant_data = [
            {'username': 'tenant1', 'first_name': 'Alice', 'last_name': 'Johnson'},
            {'username': 'tenant2', 'first_name': 'Bob', 'last_name': 'Williams'},
            {'username': 'tenant3', 'first_name': 'Carol', 'last_name': 'Brown'},
        ]
        
        for data in tenant_data:
            tenant, created = User.objects.get_or_create(
                username=data['username'],
                defaults={
                    'email': f"{data['username']}@rental.com",
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'role': 'tenant',
                }
            )
            if created:
                tenant.set_password('tenant123')
                tenant.save()
                self.stdout.write(f'  Created tenant: {tenant.username}')
            tenants.append(tenant)
        
        return tenants
    
    def create_properties(self, landlords):
        """Create sample properties"""
        properties = []
        property_data = [
            {
                'name': 'Sunset Apartments',
                'property_type': 'residential',
                'description': 'Modern apartment complex with great amenities',
                'region': 'California',
                'district': 'Los Angeles',
                'ward': 'Downtown',
                'street': '123 Sunset Blvd',
                'bedrooms': 24,
                'bathrooms': 24,
                'area_sqft': Decimal('15000'),
                'status': 'partially_occupied',
            },
            {
                'name': 'Commercial Plaza',
                'property_type': 'commercial',
                'description': 'Prime commercial space in business district',
                'region': 'California',
                'district': 'San Francisco',
                'ward': 'Financial District',
                'street': '456 Market Street',
                'bedrooms': 0,
                'bathrooms': 8,
                'area_sqft': Decimal('20000'),
                'status': 'occupied',
            },
            {
                'name': 'Green Valley Homes',
                'property_type': 'residential',
                'description': 'Peaceful residential community',
                'region': 'California',
                'district': 'San Diego',
                'ward': 'Valley View',
                'street': '789 Green Valley Rd',
                'bedrooms': 12,
                'bathrooms': 12,
                'area_sqft': Decimal('12000'),
                'status': 'available',
            },
        ]
        
        for i, data in enumerate(property_data):
            landlord = landlords[i % len(landlords)]
            prop, created = Property.objects.get_or_create(
                name=data['name'],
                landlord=landlord,
                defaults=data
            )
            if created:
                self.stdout.write(f'  Created property: {prop.name}')
            properties.append(prop)
        
        return properties
    
    def create_units(self, properties):
        """Create units for properties"""
        units = []
        
        for prop in properties:
            # Create 3-5 units per property
            num_units = 4
            for i in range(num_units):
                unit, created = Unit.objects.get_or_create(
                    property=prop,
                    unit_number=f'{chr(65+i)}{i+1}',  # A1, B2, C3, etc.
                    defaults={
                        'floor': (i % 3) + 1,
                        'bedrooms': 2,
                        'bathrooms': 1,
                        'rent_amount': Decimal('1200') + (i * 100),
                        'status': 'available' if i >= 2 else 'occupied',
                        'description': f'Unit {chr(65+i)}{i+1} - {prop.name}'
                    }
                )
                if created:
                    self.stdout.write(f'  Created unit: {unit.unit_number} in {prop.name}')
                units.append(unit)
        
        return units
    
    def create_tenant_profiles(self, tenants):
        """Create tenant profiles"""
        profiles = []
        
        for tenant in tenants:
            profile, created = Tenant.objects.get_or_create(
                user=tenant,
                defaults={
                    'phone': f'+1-555-{1000 + tenants.index(tenant):04d}',
                    'identification_type': 'Passport',
                    'identification_number': f'P{10000000 + tenants.index(tenant)}',
                    'emergency_contact_name': 'Emergency Contact',
                    'emergency_contact_phone': '+1-555-9999',
                    'emergency_contact_relationship': 'Family',
                    'occupation': 'Software Engineer',
                }
            )
            if created:
                self.stdout.write(f'  Created tenant profile for: {tenant.username}')
            profiles.append(profile)
        
        return profiles
    
    def create_leases(self, properties, units, tenant_profiles, landlords):
        """Create lease agreements"""
        leases = []
        
        occupied_units = [u for u in units if u.status == 'occupied']
        
        for i, unit in enumerate(occupied_units[:len(tenant_profiles)]):
            if i >= len(tenant_profiles):
                break
            
            tenant_profile = tenant_profiles[i]
            landlord = unit.property.landlord
            
            start_date = datetime.now().date() - timedelta(days=30 * (i + 1))
            end_date = start_date + timedelta(days=365)
            
            lease, created = Lease.objects.get_or_create(
                property=unit.property,
                unit=unit,
                tenant=tenant_profile,
                defaults={
                    'landlord': landlord,
                    'start_date': start_date,
                    'end_date': end_date,
                    'monthly_rent': unit.rent_amount,
                    'security_deposit': unit.rent_amount * 2,
                    'status': 'active',
                    'notes': f'Lease agreement for {tenant_profile.user.get_full_name()}'
                }
            )
            if created:
                self.stdout.write(f'  Created lease for: {tenant_profile.user.username} - {unit.unit_number}')
            leases.append(lease)
        
        return leases
    
    def create_payments(self, leases, tenant_profiles, properties):
        """Create payment records"""
        for lease in leases:
            # Create payments for the last 3 months
            for month_ago in range(3):
                due_date = datetime.now().date() - timedelta(days=30 * month_ago)
                
                # Vary payment status
                if month_ago == 0:
                    status = 'pending'
                    paid_date = None
                elif month_ago == 1:
                    status = 'completed'
                    paid_date = due_date + timedelta(days=2)
                else:
                    status = 'completed'
                    paid_date = due_date - timedelta(days=1)
                
                payment, created = Payment.objects.get_or_create(
                    tenant=lease.tenant,
                    property=lease.property,
                    lease=lease,
                    due_date=due_date,
                    defaults={
                        'amount': lease.monthly_rent,
                        'payment_method': 'bank_transfer',
                        'transaction_id': f'TXN{due_date.strftime("%Y%m%d")}{lease.id}',
                        'paid_date': paid_date,
                        'status': status,
                        'notes': f'Monthly rent payment for {due_date.strftime("%B %Y")}'
                    }
                )
                if created:
                    self.stdout.write(f'  Created payment: {payment.transaction_id}')
    
    def create_expenses(self, properties):
        """Create expense records"""
        for prop in properties:
            expenses_data = [
                {'title': 'Maintenance', 'category': 'maintenance', 'amount': Decimal('500')},
                {'title': 'Utilities', 'category': 'utilities', 'amount': Decimal('300')},
                {'title': 'Insurance', 'category': 'insurance', 'amount': Decimal('800')},
            ]
            
            for data in expenses_data:
                expense, created = Expense.objects.get_or_create(
                    property=prop,
                    title=data['title'],
                    defaults={
                        'category': data['category'],
                        'amount': data['amount'],
                        'date': datetime.now().date(),
                        'description': f'{data["title"]} for {prop.name}'
                    }
                )
                if created:
                    self.stdout.write(f'  Created expense: {expense.title} - {prop.name}')
    
    def create_notifications(self, leases):
        """Create sample notifications"""
        for i, lease in enumerate(leases[:2]):
            notification, created = Notification.objects.get_or_create(
                lease=lease,
                category='maintenance',
                defaults={
                    'priority': 'medium',
                    'subject': 'Maintenance Request',
                    'description': 'Need repair for leaking faucet in bathroom',
                    'status': 'pending' if i == 0 else 'resolved',
                }
            )
            if created:
                self.stdout.write(f'  Created notification for lease: {lease.id}')

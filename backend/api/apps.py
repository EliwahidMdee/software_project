"""
Django App Configuration for the API app

This file configures the 'api' Django application.
"""
from django.apps import AppConfig


class ApiConfig(AppConfig):
    """Configuration for the API app"""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    verbose_name = 'Rental Management API'

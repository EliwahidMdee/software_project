"""
URL Configuration for rental_project

This file defines the URL patterns for the entire Django project.
It routes incoming requests to the appropriate views/endpoints.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Admin panel - accessible at /admin/
    path('admin/', admin.site.urls),
    
    # API endpoints - all API routes are under /api/
    path('api/', include('api.urls')),
]

# Serve media files in development
# Media files are user-uploaded content like images, documents, etc.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

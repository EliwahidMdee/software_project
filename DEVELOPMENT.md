# 🔧 Development Guide

This guide is for developers who want to understand and extend the Rental Management System.

## 📚 Architecture Overview

### Backend Architecture (Django)

```
backend/
├── rental_project/         # Main Django project
│   ├── settings.py        # Configuration (database, apps, middleware)
│   ├── urls.py            # Root URL routing
│   └── wsgi.py            # WSGI server configuration
│
└── api/                   # Main API application
    ├── models.py          # Database models (13 models)
    ├── serializers.py     # DRF serializers for API
    ├── views.py           # API ViewSets and endpoints
    ├── urls.py            # API URL routing
    ├── permissions.py     # Custom permissions for roles
    ├── admin.py           # Django admin configuration
    └── management/
        └── commands/
            └── create_sample_data.py  # Sample data generator
```

#### Key Django Components

**Models (database tables):**
- `User` - Custom user with role field
- `Property` - Rental properties
- `PropertyImage` - Property photos
- `Unit` - Individual rental units
- `Tenant` - Tenant profiles
- `Lease` - Lease agreements
- `Payment` - Payment records
- `Expense` - Property expenses
- `Document` - File storage
- `Notification` - Communication system
- `Account`, `JournalEntry`, `JournalEntryLine` - Accounting

**API Endpoints:**
- Authentication: `/api/auth/login/`, `/api/auth/register/`, `/api/auth/user/`
- Resources: `/api/{resource}/` (properties, units, tenants, leases, payments, etc.)
- Dashboard: `/api/dashboard/stats/`

### Frontend Architecture (React)

```
frontend/src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Modal.js
│   │   ├── Input.js
│   │   └── LoadingSpinner.js
│   └── layout/           # Layout components
│       ├── Navbar.js
│       └── Sidebar.js
│
├── pages/                # Page components
│   ├── Login.js
│   ├── Register.js
│   ├── Dashboard.js
│   ├── Properties.js
│   └── Payments.js
│
├── services/
│   └── api.js            # Axios configuration & API calls
│
├── context/
│   └── AuthContext.js    # Authentication state management
│
├── utils/
│   └── helpers.js        # Helper functions (formatting, etc.)
│
├── App.js                # Main app with routing
└── index.js              # Entry point
```

#### Key React Concepts Used

- **Functional Components** - All components use hooks
- **React Router** - For navigation and protected routes
- **Context API** - For global authentication state
- **Custom Hooks** - useAuth() for authentication
- **Controlled Forms** - Form state managed in React

## 🚀 Adding New Features

### Adding a New Page (Frontend)

Let's add a "Units" page as an example:

**1. Create the page component:**

```jsx
// frontend/src/pages/Units.js
import React, { useState, useEffect } from 'react';
import { getAll, create, update, remove } from '../services/api';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Units = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  
  useEffect(() => {
    fetchUnits();
  }, []);
  
  const fetchUnits = async () => {
    try {
      const data = await getAll('units');
      setUnits(data.results || data);
    } catch (error) {
      console.error('Error fetching units:', error);
      toast.error('Failed to load units');
    } finally {
      setLoading(false);
    }
  };
  
  // ... rest of your component logic
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Units</h1>
      {/* Your UI here */}
    </div>
  );
};

export default Units;
```

**2. Add route in App.js:**

```jsx
import Units from './pages/Units';

// In the Routes section:
<Route
  path="/units"
  element={
    <ProtectedRoute>
      <Layout>
        <Units />
      </Layout>
    </ProtectedRoute>
  }
/>
```

**3. The API endpoint already exists!**
The backend already has `/api/units/` ready to use.

### Adding a New Model (Backend)

If you need a new database table:

**1. Add model in models.py:**

```python
# backend/api/models.py
class NewModel(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'New Model'
        verbose_name_plural = 'New Models'
    
    def __str__(self):
        return self.name
```

**2. Create serializer:**

```python
# backend/api/serializers.py
class NewModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewModel
        fields = '__all__'
```

**3. Create ViewSet:**

```python
# backend/api/views.py
class NewModelViewSet(viewsets.ModelViewSet):
    queryset = NewModel.objects.all()
    serializer_class = NewModelSerializer
    permission_classes = [IsAuthenticated]
```

**4. Register in URLs:**

```python
# backend/api/urls.py
router.register(r'newmodels', NewModelViewSet, basename='newmodel')
```

**5. Run migrations:**

```bash
python manage.py makemigrations
python manage.py migrate
```

## 🔑 Authentication Flow

### How JWT Authentication Works

1. **Login:**
   - User submits username/password
   - Backend validates and returns access + refresh tokens
   - Frontend stores tokens in localStorage
   - Frontend stores user data in AuthContext

2. **API Requests:**
   - Axios interceptor adds `Authorization: Bearer {token}` header
   - Backend validates token
   - Backend checks user permissions
   - Returns data or error

3. **Token Refresh:**
   - If access token expires (401 error)
   - Axios automatically uses refresh token
   - Gets new access token
   - Retries original request

4. **Logout:**
   - Clears tokens from localStorage
   - Clears user from AuthContext
   - Redirects to login

### Role-Based Access Control

**Backend permissions (api/permissions.py):**
```python
class IsLandlord(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'landlord'
```

**Usage in views:**
```python
class PropertyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminOrLandlord]
    
    def get_queryset(self):
        if self.request.user.role == 'landlord':
            return Property.objects.filter(landlord=self.request.user)
        return Property.objects.all()
```

## 🎨 Styling Guide

### Using Tailwind CSS

**Common patterns used:**

```jsx
// Container padding
<div className="p-6">

// Card styling
<div className="bg-white rounded-lg shadow-md p-6">

// Button (primary)
<button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg">

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Responsive text
<h1 className="text-2xl md:text-3xl font-bold">
```

### Color Scheme

- **Primary:** Blue (`primary-600`, etc.)
- **Success:** Green (`green-600`)
- **Warning:** Yellow (`yellow-600`)
- **Danger:** Red (`red-600`)
- **Neutral:** Gray (`gray-600`)

## 📊 Database Relationships

```
User (role: admin/landlord/tenant)
  ↓
  ├─→ Property (owned by landlord)
  │     ├─→ PropertyImage (multiple images)
  │     ├─→ Unit (multiple units per property)
  │     ├─→ Expense (property expenses)
  │     └─→ Document (property documents)
  │
  └─→ Tenant (tenant profile)
        └─→ Lease (links tenant to unit)
              ├─→ Payment (rent payments)
              ├─→ Document (lease documents)
              └─→ Notification (communications)
```

## 🧪 Testing Your Changes

### Backend Testing

```bash
# Test API endpoint
curl -X GET http://localhost:8000/api/properties/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test authentication
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Frontend Testing

1. Open browser console (F12)
2. Check for JavaScript errors
3. Check Network tab for API calls
4. Verify data loads correctly
5. Test form submissions

### Using Django Admin

1. Go to `http://localhost:8000/admin/`
2. Login with superuser credentials
3. Manually add/edit/delete data
4. Verify relationships work
5. Check model string representations

## 🔍 Debugging Tips

### Backend Issues

**Check Django logs:**
```bash
# Terminal where Django is running shows all requests and errors
```

**Use Django shell:**
```bash
python manage.py shell

>>> from api.models import Property
>>> Property.objects.all()
>>> # Test queries interactively
```

**Enable debug toolbar:**
```python
# settings.py
INSTALLED_APPS += ['debug_toolbar']
```

### Frontend Issues

**Check browser console:**
- Open DevTools (F12)
- Look for red error messages
- Check Network tab for failed requests

**Add console.log statements:**
```jsx
console.log('State:', myState);
console.log('API response:', data);
```

**React DevTools:**
- Install React Developer Tools extension
- Inspect component props and state

## 🚦 Common Patterns

### CRUD Operations Pattern

```jsx
// List
const [items, setItems] = useState([]);
const fetchItems = async () => {
  const data = await getAll('resource');
  setItems(data.results || data);
};

// Create
const handleCreate = async (formData) => {
  await create('resource', formData);
  fetchItems(); // Refresh list
};

// Update
const handleUpdate = async (id, formData) => {
  await update('resource', id, formData);
  fetchItems(); // Refresh list
};

// Delete
const handleDelete = async (id) => {
  await remove('resource', id);
  fetchItems(); // Refresh list
};
```

### Form Handling Pattern

```jsx
const [formData, setFormData] = useState({
  field1: '',
  field2: ''
});
const [errors, setErrors] = useState({});

const handleChange = (e) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await create('resource', formData);
    toast.success('Success!');
  } catch (error) {
    setErrors(error.response?.data || {});
    toast.error('Failed');
  }
};
```

## 📝 Code Style Guidelines

### Python (Backend)

- Use 4 spaces for indentation
- Follow PEP 8 style guide
- Add docstrings to functions
- Use descriptive variable names
- Keep functions focused and small

### JavaScript (Frontend)

- Use 2 spaces for indentation
- Use const/let, not var
- Use arrow functions
- Add JSDoc comments for complex functions
- Keep components under 300 lines

## 🔐 Security Best Practices

1. **Never commit .env files**
2. **Always validate user input**
3. **Use Django's CSRF protection**
4. **Sanitize file uploads**
5. **Check permissions on all endpoints**
6. **Use HTTPS in production**
7. **Keep dependencies updated**

## 📦 Deployment Checklist

Before deploying to production:

- [ ] Set DEBUG=False
- [ ] Change SECRET_KEY
- [ ] Use strong database password
- [ ] Configure ALLOWED_HOSTS
- [ ] Setup static files serving
- [ ] Configure media files
- [ ] Setup HTTPS
- [ ] Enable database backups
- [ ] Setup error logging
- [ ] Use production web server (Gunicorn)
- [ ] Setup reverse proxy (Nginx)

## 🤝 Contributing

When adding new features:

1. **Follow existing patterns**
2. **Add inline comments** for beginners
3. **Test thoroughly**
4. **Update documentation**
5. **Keep it simple** - this is a learning project

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [JWT Authentication](https://jwt.io/introduction)

Happy coding! 🎉

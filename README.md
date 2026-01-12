# Rental Management System

A full-stack rental property management application built with **React** and **Django** for beginners learning web development.

## 🌟 Features

### Core Functionality
- **Property & Unit Management** - Add and manage rental properties and individual units
- **Tenant Management** - Track tenant information, contacts, and history
- **Lease Management** - Create and manage lease agreements with documents
- **Payment Tracking** - Monitor rent payments, track overdue amounts
- **Expense Tracking** - Record property-related expenses
- **Document Management** - Upload and manage contracts, receipts, and other files
- **Notifications System** - Communication between tenants and landlords
- **Multi-Role Dashboard** - Different views for Admin, Landlord, and Tenant roles
- **Accounting Module** - Double-entry bookkeeping with chart of accounts

### User Roles
- **Admin** - Full system access and management
- **Landlord** - Manage their properties, tenants, and finances
- **Tenant** - View lease details, make payments, submit notifications

## 🛠️ Tech Stack

**Frontend:**
- React 18+ with functional components and hooks
- React Router for navigation
- Axios for API calls
- Tailwind CSS for modern, responsive design
- React Hook Form for form handling
- React Toastify for notifications

**Backend:**
- Django 5.x with Django REST Framework
- JWT authentication (djangorestframework-simplejwt)
- MySQL database via XAMPP
- Django CORS headers for frontend communication
- Pillow for image handling
- Django Filter for API filtering

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.10 or higher** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18 or higher** - [Download Node.js](https://nodejs.org/)
- **XAMPP** - [Download XAMPP](https://www.apachefriends.org/) (for MySQL database)

## 🚀 Setup Instructions

### Step 1: XAMPP Setup

1. **Install XAMPP** and start the application
2. **Start Apache and MySQL services** from XAMPP Control Panel
3. **Open phpMyAdmin** by going to `http://localhost/phpmyadmin` in your browser
4. **Create a new database:**
   - Click "New" in the left sidebar
   - Database name: `rental_management`
   - Collation: `utf8mb4_general_ci`
   - Click "Create"
5. Leave the user as `root` with **no password** (XAMPP default)

### Step 2: Backend Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd software_project
   ```

2. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

3. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

4. **Activate the virtual environment:**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **Mac/Linux:**
     ```bash
     source venv/bin/activate
     ```

5. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

6. **Create `.env` file** in the backend folder:
   ```bash
   # Copy the example file
   cp .env.example .env
   ```
   
   Or create a new `.env` file with the following content:
   ```
   SECRET_KEY=django-insecure-your-secret-key-here-change-this
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   
   # MySQL Database Configuration (XAMPP)
   DB_ENGINE=django.db.backends.mysql
   DB_NAME=rental_management
   DB_USER=root
   DB_PASSWORD=
   DB_HOST=localhost
   DB_PORT=3306
   ```

7. **Run migrations** to create database tables:
   ```bash
   python manage.py migrate
   ```

8. **Create a superuser** (admin account):
   ```bash
   python manage.py createsuperuser
   ```
   
   Follow the prompts to set:
   - Username (e.g., `admin`)
   - Email (e.g., `admin@example.com`)
   - Password (enter twice)

9. **Start the development server:**
   ```bash
   python manage.py runserver
   ```
   
   The backend will be running at: **http://localhost:8000**

10. **Access Django Admin** (optional):
    - Go to: `http://localhost:8000/admin/`
    - Login with your superuser credentials
    - You can manage all data from here

### Step 3: Frontend Setup

1. **Open a new terminal window** (keep the backend running)

2. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Create `.env` file** in the frontend folder:
   ```bash
   # Copy the example file
   cp .env.example .env
   ```
   
   Or create a new `.env` file with:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

5. **Start the development server:**
   ```bash
   npm start
   ```
   
   The frontend will be running at: **http://localhost:3000**

6. The app should **automatically open in your browser**. If not, navigate to `http://localhost:3000`

## 🎯 Getting Started

### First Login

1. **Open your browser** and go to `http://localhost:3000`
2. **Click "Register here"** to create a new account
3. Fill in your information and select a role:
   - Choose **Landlord** if you want to manage properties
   - Choose **Tenant** if you want to rent a property
   - Choose **Admin** if you need full system access
4. After registration, **login with your credentials**
5. You'll be redirected to the dashboard based on your role

### Using the Admin Account

The superuser you created can be used to:
- Access the Django admin panel at `http://localhost:8000/admin/`
- Have full access to all features in the React frontend
- Manage users, properties, leases, and all other data

## 📁 Project Structure

```
rental-management/
├── backend/                    # Django backend
│   ├── rental_project/        # Main Django project settings
│   │   ├── settings.py       # Configuration file
│   │   ├── urls.py           # URL routing
│   │   └── wsgi.py           # WSGI configuration
│   ├── api/                   # API application
│   │   ├── models.py         # Database models
│   │   ├── serializers.py    # API serializers
│   │   ├── views.py          # API views/endpoints
│   │   ├── urls.py           # API URL routing
│   │   ├── admin.py          # Admin panel configuration
│   │   └── permissions.py    # Custom permissions
│   ├── manage.py             # Django management script
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables
│
└── frontend/                  # React frontend
    ├── public/               # Public assets
    │   └── index.html       # HTML template
    ├── src/                  # Source code
    │   ├── components/      # React components
    │   │   ├── common/     # Reusable components
    │   │   └── layout/     # Layout components (Navbar, Sidebar)
    │   ├── pages/          # Page components
    │   ├── services/       # API service (Axios)
    │   ├── context/        # React Context (Auth)
    │   ├── utils/          # Helper functions
    │   ├── App.js          # Main app component
    │   ├── index.js        # Entry point
    │   └── index.css       # Global styles
    ├── package.json         # Node dependencies
    ├── tailwind.config.js   # Tailwind CSS config
    └── .env                 # Environment variables
```

## 🐛 Troubleshooting

### MySQL Connection Issues

**Problem:** Backend can't connect to MySQL database

**Solutions:**
1. ✅ Make sure XAMPP MySQL service is **running** (check XAMPP Control Panel)
2. ✅ Verify the database `rental_management` exists in phpMyAdmin
3. ✅ Check that the database user is `root` with **no password**
4. ✅ Ensure port `3306` is not blocked by firewall
5. ✅ Try restarting MySQL service in XAMPP

### Backend Issues

**Problem:** Python package installation errors

**Solutions:**
1. ✅ Make sure virtual environment is **activated** (you should see `(venv)` in terminal)
2. ✅ Update pip: `python -m pip install --upgrade pip`
3. ✅ Install packages one by one if bulk install fails
4. ✅ For mysqlclient errors on Windows, install Visual C++ Build Tools

**Problem:** Migration errors

**Solutions:**
1. ✅ Make sure MySQL service is running
2. ✅ Check `.env` file has correct database credentials
3. ✅ Delete migrations if needed and recreate: `python manage.py makemigrations`
4. ✅ Try: `python manage.py migrate --run-syncdb`

### Frontend Issues

**Problem:** npm install fails

**Solutions:**
1. ✅ Delete `node_modules` and `package-lock.json`: `rm -rf node_modules package-lock.json`
2. ✅ Clear npm cache: `npm cache clean --force`
3. ✅ Install again: `npm install`
4. ✅ Try using `npm install --legacy-peer-deps` if dependency conflicts exist

**Problem:** Can't connect to backend API

**Solutions:**
1. ✅ Verify backend is running at `http://localhost:8000`
2. ✅ Check `.env` file has correct `REACT_APP_API_URL`
3. ✅ Open browser console (F12) to see actual error messages
4. ✅ Check CORS settings in Django `settings.py`

### Port Already in Use

**Problem:** Port 3000 or 8000 is already in use

**Solutions:**
1. ✅ **Kill the process using the port:**
   - Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
   - Mac/Linux: `lsof -ti:3000 | xargs kill -9`
2. ✅ **Use a different port:**
   - Frontend: `PORT=3001 npm start`
   - Backend: `python manage.py runserver 8001`

## 🔒 Security Notes

⚠️ **Important for Production:**

1. **Change the SECRET_KEY** in `.env` to a strong, random key
2. **Set DEBUG=False** in production
3. **Use a strong database password** instead of empty password
4. **Configure ALLOWED_HOSTS** properly
5. **Use environment variables** for all sensitive data
6. **Enable HTTPS** in production
7. **Keep dependencies updated** regularly

## 📚 Learning Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)

## 🤝 Contributing

This is a learning project. Feel free to:
- Fork the repository
- Create feature branches
- Submit pull requests
- Report issues
- Suggest improvements

## 📝 License

This project is open source and available for educational purposes.

## 💡 Tips for Beginners

1. **Start with the Django admin panel** to understand the data structure
2. **Use browser DevTools (F12)** to debug API calls and see errors
3. **Read the inline comments** in the code - they explain what each part does
4. **Test one feature at a time** before moving to the next
5. **Check the Django server logs** for backend errors
6. **Check the browser console** for frontend errors
7. **Use print() statements** in Python for debugging
8. **Use console.log()** in JavaScript for debugging

## 🎓 What You'll Learn

By working with this project, you'll learn:

### Backend (Django)
- Setting up Django projects and apps
- Creating database models with relationships
- Building REST APIs with Django REST Framework
- JWT authentication and authorization
- Role-based access control
- File upload handling
- Database migrations
- Django admin customization

### Frontend (React)
- React functional components and hooks
- React Router for navigation
- Context API for state management
- API integration with Axios
- Form handling and validation
- Responsive design with Tailwind CSS
- Protected routes
- User authentication flow

### Full-Stack Concepts
- API design and consumption
- Authentication with JWT tokens
- CORS configuration
- Environment variables
- Project structure and organization
- Debugging techniques

## 📧 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the error messages carefully
3. Check browser console and Django logs
4. Search for the error message online
5. Open an issue in the repository

Happy coding! 🚀
# 🚀 Quick Setup Guide

This guide will help you get the Rental Management System up and running quickly.

## Prerequisites Check

Before starting, make sure you have:
- ✅ Python 3.10+ installed (`python --version`)
- ✅ Node.js 18+ installed (`node --version`)
- ✅ XAMPP installed and running

## 🎯 Quick Start (5 Minutes)

### 1. XAMPP Setup (1 minute)

1. Start XAMPP Control Panel
2. Click "Start" for Apache and MySQL
3. Click "Admin" next to MySQL (opens phpMyAdmin)
4. Create database: Click "New" → Name: `rental_management` → Click "Create"

### 2. Backend Setup (2 minutes)

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser
# Enter: username=admin, email=admin@test.com, password=admin123

# Create sample data (optional but recommended)
python manage.py create_sample_data

# Start server
python manage.py runserver
```

Backend will run at: http://localhost:8000

### 3. Frontend Setup (2 minutes)

Open a NEW terminal window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm start
```

Frontend will run at: http://localhost:3000

## 🎉 You're Done!

The app should automatically open in your browser at http://localhost:3000

### Test Login Credentials

After running `create_sample_data`, you can login with:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Landlord Account:**
- Username: `landlord1`
- Password: `landlord123`

**Tenant Account:**
- Username: `tenant1`
- Password: `tenant123`

## 📱 What to Try First

1. **Login** with one of the test accounts
2. **View Dashboard** - See statistics and recent activity
3. **Navigate Sidebar** - Explore different sections
4. **Add a Property** (Landlord/Admin):
   - Click "Properties" in sidebar
   - Click "+ Add Property" button
   - Fill in the form
   - Click "Create Property"
5. **View Lease Information** (Tenant):
   - Dashboard shows active lease details
   - Navigate to "My Payments" to see payment history

## 🔧 Common Issues

### MySQL Connection Error

**Error:** "Can't connect to MySQL server"

**Fix:**
1. Open XAMPP Control Panel
2. Make sure MySQL is running (green highlight)
3. If not, click "Start" button next to MySQL
4. Restart backend server: Stop (Ctrl+C) and run `python manage.py runserver`

### Port 3000 Already in Use

**Error:** "Something is already running on port 3000"

**Fix:**
- Kill existing process: `npx kill-port 3000`
- Or use different port: `PORT=3001 npm start`

### "Module not found" Error

**Fix:**
```bash
# Backend
pip install -r requirements.txt

# Frontend
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

1. Read the full [README.md](./README.md) for detailed documentation
2. Explore the Django Admin Panel at http://localhost:8000/admin
3. Check the API documentation at http://localhost:8000/api/
4. Modify the code and see changes in real-time
5. Create your own properties, tenants, and leases

## 🆘 Need Help?

- Check [README.md](./README.md) Troubleshooting section
- Review inline code comments (they explain everything!)
- Check browser console (F12) for frontend errors
- Check terminal output for backend errors

Happy coding! 🎉

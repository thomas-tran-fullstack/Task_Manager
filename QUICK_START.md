# Quick Start Checklist

Use this checklist to get your Task Manager application running locally.

## ✅ Prerequisites Check
- [ ] Node.js v16+ installed (verify: `node --version`)
- [ ] npm v8+ installed (verify: `npm --version`)
- [ ] MySQL 8.0+ installed (verify: `mysql --version`)
- [ ] Git installed (verify: `git --version`)
- [ ] Text editor/IDE (VS Code recommended)

## 📦 Step 1: Database Setup (First!)

```bash
# Start MySQL
mysql -u root -p

# In MySQL command line:
CREATE DATABASE task_manager;
USE task_manager;
SOURCE path/to/database/schema.sql;
EXIT;
```

- [ ] Database created: `task_manager`
- [ ] All tables created successfully
- [ ] Schema imported without errors

## 🔧 Step 2: Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your credentials:
# - MYSQL_PASSWORD: your MySQL password
# - JWT_SECRET: Generate random string
```

- [ ] .env file created and configured
- [ ] MySQL credentials updated

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

- [ ] npm dependencies installed
- [ ] Backend running on port 5000
- [ ] Health check: http://localhost:5000/health

## ⚛️ Step 3: Frontend Setup (New Terminal)

```bash
cd frontend

# Copy environment file
cp .env.example .env

# Update .env if needed (API URL should be correct by default)
```

- [ ] .env file created

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

- [ ] npm dependencies installed
- [ ] Frontend running on port 5173
- [ ] Browser opens automatically

## 🧪 Step 4: Verification

- [ ] Backend API responds: http://localhost:5000/health
- [ ] Frontend loads: http://localhost:5173
- [ ] Authentication page displays with hero banner
- [ ] No console errors in browser

## 🚀 Step 5: GitHub Setup (Optional but Required)

```bash
# From project root
git init
git add .
git commit -m "Initial commit: Project structure and setup"
git remote add origin https://github.com/thomas-tran-fullstack/Task_Manager.git
git push -u origin main
```

- [ ] GitHub repository created (public)
- [ ] Code pushed with clear commit history
- [ ] README visible on GitHub

## ✨ Next: Development

After everything is working:

1. **Read These Files First:**
   - [ ] `SETUP.md` - Detailed setup guide
   - [ ] `DEVELOPMENT.md` - Coding standards
   - [ ] `STATUS.md` - Project status and roadmap

2. **Implement Features (In Order):**
   - [ ] Backend authentication endpoints
   - [ ] Frontend auth integration
   - [ ] Task CRUD endpoints
   - [ ] Task UI components
   - [ ] Search and filters
   - [ ] Statistics dashboard
   - [ ] OTP/Google OAuth
   - [ ] Animations and polish

3. **References:**
   - [ ] `backend/IMPLEMENTATION.md` - Backend examples
   - [ ] `frontend/IMPLEMENTATION.md` - Frontend examples
   - [ ] `TODO.md` - Complete feature checklist

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=5001  # Use different port
```

### MySQL Connection Error
```bash
# Verify MySQL is running and accessible
mysql -u root -p -e "SELECT 1"

# Check your .env credentials
# Make sure database exists
```

### Module Not Found
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### .env Not Loading
```bash
# Verify file exists
ls -la .env  # Mac/Linux
dir .env    # Windows

# Restart dev server after creating/editing .env
```

## 📝 Key Files to Know

```
task-manager/
├── README.md           ← Main documentation
├── SETUP.md           ← Detailed setup guide
├── DEVELOPMENT.md     ← Coding standards
├── STATUS.md          ← Project status
├── TODO.md            ← Feature checklist
├── database/schema.sql ← Database setup
├── frontend/src/main.jsx ← React entry
└── backend/src/server.js ← Express entry
```

## 🎯 Success Indicators

You'll know everything is working when:

1. ✅ Backend server starts without errors
2. ✅ Frontend page loads with hero banner
3. ✅ No console errors in browser
4. ✅ API health check returns OK
5. ✅ Database contains all tables

## 🆘 Need Help?

1. Check `SETUP.md` troubleshooting section
2. Review browser console for errors
3. Check terminal output for error messages
4. Search error message online
5. Ask in team chat or create GitHub issue

## 📞 Common Steps

### View Backend Logs
```bash
cd backend
npm run dev
```
Logs appear in terminal

### View Frontend Errors
Open browser DevTools (F12) → Console tab

### Restart Everything
```bash
# Kill dev servers (Ctrl+C in both terminals)
# Close any other apps using ports 5000, 5173
# Start both servers again
```

### Reset Database
```bash
mysql -u root -p task_manager < database/schema.sql
# OR manually:
DROP DATABASE task_manager;
CREATE DATABASE task_manager;
USE task_manager;
SOURCE database/schema.sql;
```

---

## ⏱️ Expected Timeline

If everything is set up correctly:
- Initial setup: **5-10 minutes**
- Verification: **2-3 minutes**
- Backend auth: **3-4 hours**
- Frontend integration: **2-3 hours**
- Task features: **3-4 hours**
- Polish & deploy: **2-3 hours**

**Total Estimated Time:** 10-14 hours of focused work

---

## 🎉 Ready to Code?

Once you see both servers running:
1. Open `STATUS.md` for feature roadmap
2. Start with `backend/IMPLEMENTATION.md`
3. Follow the priority order in `TODO.md`
4. Check `DEVELOPMENT.md` for code standards

**Good luck! You've got this! 🚀**

---

Last updated: March 25, 2026

# 🔧 TROUBLESHOOTING GUIDE - Task Manager

**Quick reference for common issues and solutions**

---

## 🚀 Startup Issues

### Issue: "Cannot find module 'express'"
**Problem:** Dependencies not installed  
**Solution:**
```bash
# Install dependencies
cd backend
npm install

# Or in frontend
cd frontend
npm install
```

---

### Issue: "Error: connect ECONNREFUSED 127.0.0.1:3306"
**Problem:** MySQL server not running  
**Solution:**

**Windows:**
```bash
# Start MySQL service
net start MySQL80
# Or use Services app: Services → MySQL80 → Start
```

**macOS:**
```bash
# Using Homebrew
brew services start mysql
# Or
mysql.server start
```

**Linux:**
```bash
sudo service mysql start
# Or
sudo systemctl start mysql
```

**Verify MySQL is running:**
```bash
mysql -u root -p
# If successful, you'll see: mysql>
exit
```

---

### Issue: "Error: Access denied for user 'root'@'localhost'"
**Problem:** MySQL password is incorrect in .env  
**Solution:**

1. Open `backend/.env`
2. Check the password matches your MySQL root password
3. If you forgot the password, reset it:
   ```bash
   # Windows
   mysqld --skip-grant-tables
   # Then connect: mysql -u root
   # Execute: FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
   ```

4. Restart MySQL service after password change
5. Update backend/.env with new password
6. Restart backend server

---

### Issue: "Error: Unknown database 'task_manager'"
**Problem:** Database schema not created  
**Solution:**
```bash
# Connect to MySQL
mysql -u root -p

# Run these commands:
CREATE DATABASE IF NOT EXISTS task_manager;
USE task_manager;
SOURCE database/schema.sql;

# Verify tables were created:
SHOW TABLES;
# Should show: 9 tables including users, tasks, otp_verification, etc.

# Exit MySQL
exit
```

---

### Issue: "EADDRINUSE: address already in use :::5000"
**Problem:** Port 5000 already in use (another server running)  
**Solution:**

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with number from above)
taskkill /PID 12345 /F

# Or change backend port in .env:
PORT=5001
```

**macOS/Linux:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or change backend port in .env:
PORT=5001
```

---

### Issue: "EADDRINUSE: address already in use :::5173"
**Problem:** Port 5173 already in use (another Vite server running)  
**Solution:**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID [PID] /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9

# Or change in frontend:
npm run dev -- --port 5174
```

---

## 🔑 Environment Variable Issues

### Issue: "TypeError: Cannot read property 'VITE_API_URL' of undefined"
**Problem:** Frontend .env file not configured  
**Solution:**

1. Create `frontend/.env` from template:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

2. Edit and verify:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here (optional)
   ```

3. Restart frontend: `npm run dev`

---

### Issue: Backend not responding when frontend tries to call API
**Problem:** VITE_API_URL or FRONTEND_URL mismatch  
**Solution:**

1. In `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

2. In `backend/.env`:
   ```env
   FRONTEND_URL=http://localhost:5173
   PORT=5000
   ```

3. Verify both are correct (not localhost vs 127.0.0.1 mismatch)
4. Restart both servers

---

### Issue: "Error: JWT_SECRET or JWT_EXPIRE not set"
**Problem:** .env variables missing  
**Solution:**

1. Open `backend/.env`
2. Generate JWT_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Output will be something like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

3. Add to backend/.env:
   ```env
   JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
   JWT_EXPIRE=24h
   ```

4. Restart backend server

---

## 🔌 Frontend Connection Issues

### Issue: "TypeError: api is not a function" or API errors in console
**Problem:** Axios configuration issue  
**Solution:**

1. Verify `frontend/.env` has correct `VITE_API_URL`
2. Check backend is running: `http://localhost:5000/health`
3. Check browser console (F12) for exact error
4. Restart frontend: `Ctrl+C` and `npm run dev`

---

### Issue: CORS Error - "Access to XMLHttpRequest blocked by CORS policy"
**Problem:** CORS not configured correctly  
**Solution:**

1. In `backend/.env`, verify:
   ```env
   FRONTEND_URL=http://localhost:5173
   ```

2. If using non-standard port:
   ```env
   FRONTEND_URL=http://localhost:5174
   ```

3. Restart backend to apply changes
4. Clear browser cache (Ctrl+Shift+Del)
5. Try in incognito/private window

---

### Issue: "Cannot read property 'Authorization' of undefined"
**Problem:** API interceptor issue  
**Solution:**

1. Check browser DevTools → Application → Local Storage
2. Should have 'token' stored after login
3. If missing, try logging in again and check for error messages
4. Clear local storage and try again:
   ```javascript
   // In browser console:
   localStorage.clear()
   ```

---

## 🗄️ Database Issues

### Issue: "error: ER_SYNTAX: You have an error in your SQL syntax"
**Problem:** Old version of schema.sql or MySQL version incompatibility  
**Solution:**

1. Delete all old tables (if testing):
   ```bash
   mysql -u root -p task_manager
   DROP TABLE IF EXISTS task_history;
   DROP TABLE IF EXISTS login_activity;
   DROP TABLE IF EXISTS password_reset_tokens;
   DROP TABLE IF EXISTS otp_verification;
   DROP TABLE IF EXISTS user_settings;
   DROP TABLE IF EXISTS tasks;
   DROP TABLE IF EXISTS users;
   ```

2. Re-run schema.sql:
   ```bash
   mysql -u root -p task_manager < database/schema.sql
   ```

3. Verify tables created:
   ```bash
   mysql -u root -p
   USE task_manager;
   SHOW TABLES;
   ```

---

### Issue: "Cannot find module '@/...' or similar path issues"
**Problem:** Path alias not working  
**Solution:**

**Frontend:**
1. Verify `vite.config.js` has:
   ```javascript
   resolve: {
     alias: {
       '@': fileURLToPath(new URL('./src', import.meta.url))
     }
   }
   ```

2. Or change imports from `@/` to relative paths:
   ```javascript
   // Instead of: import { useAuth } from '@/hooks/useAuth'
   // Use: import { useAuth } from './hooks/useAuth'
   ```

**Backend:**
1. Check `jsconfig.json` or `vite.config.js` alias configuration
2. Or use relative paths instead

---

### Issue: "node_modules installation fails"
**Problem:** npm registry issue or Node version  
**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Update npm
npm install -g npm@latest

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still failing, try different registry:
npm install --registry https://registry.npmmirror.com
```

---

## 🔐 Authentication Issues

### Issue: "Login says success but page doesn't load"
**Problem:** Token not being stored or context not updating  
**Solution:**

1. Check browser console for errors (F12)
2. Check Local Storage for 'token' (F12 → Application → Local Storage)
3. If token exists but page still shows login:
   - Clear browser cache: Ctrl+Shift+Delete
   - Try incognito window
   - Restart frontend: Ctrl+C and `npm run dev`

4. Verify AuthContext is receiving token:
   - Add console.log in AuthContext.jsx to debug

---

### Issue: "Google Login button not showing"
**Problem:** Google OAuth not configured  
**Solution:**

1. Get Google Client ID from [Google Cloud Console](https://console.cloud.google.com/)
2. Add to `frontend/.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   ```

3. Make sure frontend .env is loaded (restart dev server)
4. If still not showing, check browser console for errors

---

### Issue: "Forgot password OTP page shows but email not received"
**Problem:** SMTP not configured (optional feature)  
**Solution:**

1. Note: OTP testing works without SMTP setup
2. If you want to test email functionality, configure in `backend/.env`:
   ```env
   SMTP_SERVICE=gmail
   SMTP_EMAIL=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```

3. For Gmail, use App Password (not regular password)
4. Restart backend to apply settings

---

## 🎯 Testing Issues

### Issue: "Register works but Login fails"
**Problem:** User not actually created or password issue  
**Solution:**

1. Check database:
   ```bash
   mysql -u root -p task_manager
   SELECT * FROM users;
   ```

2. If user exists but login fails:
   - Password might not be hashing correctly
   - Try registering again with simple password
   - Check authController for password hashing logic

3. Clear browser data and try registering with new email:
   ```javascript
   // In browser console:
   localStorage.clear()
   ```

---

### Issue: "Task creation works but task doesn't appear"
**Problem:** Page not refreshing or task not saving to DB  
**Solution:**

1. Check browser console for errors
2. Manually refresh page (F5)
3. Check database if task was actually saved:
   ```bash
   mysql -u root -p task_manager
   SELECT * FROM tasks;
   ```

4. Check if user_id is correct
5. Verify API returned success before navigating

---

### Issue: "Search/Filter not working"
**Problem:** Frontend filtering or API response  
**Solution:**

1. Create multiple tasks first
2. Check browser console for errors
3. Verify tasks are in database:
   ```bash
   mysql -u root -p task_manager
   SELECT COUNT(*) FROM tasks;
   ```

4. Try manual API call to test:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        http://localhost:5000/api/tasks?search=test
   ```

---

## 📊 Performance/Slowness Issues

### Issue: "Page loading very slow"
**Problem:** Network latency or large dataset  
**Solution:**

1. Check Network tab in DevTools (F12 → Network)
2. Look for slow API calls
3. If backend is slow, check:
   - MySQL query performance
   - Check if indexes were created
   - Run ANALYZE TABLE on tables

4. If frontend is slow:
   - Check for console errors (F12 → Console)
   - Clear browser cache
   - Check for memory leaks in DevTools

---

### Issue: "Dashboard statistics showing wrong numbers"
**Problem:** TaskContext not updating properly  
**Solution:**

1. Refresh page (F5)
2. Check database to verify actual numbers:
   ```bash
   mysql -u root -p task_manager
   SELECT status, COUNT(*) FROM tasks WHERE user_id = 1 GROUP BY status;
   ```

3. Check browser console for API errors
4. Verify user ID is correct

---

## 🐛 Error Messages Guide

### "ValidationError: Invalid email"
**Solution:** Use valid email format: `user@example.com`

### "ValidationError: Password must be at least 8 characters"
**Solution:** Use password with 8+ characters

### "ValidationError: Email already registered"
**Solution:** Use different email or login instead

### "ERR_INVALID_ARG_TYPE"
**Solution:** Check parameter types, usually in API calls

### "Undefined variable or function"
**Solution:** Check all imports are correct, restart dev server

---

## 🔍 Debugging Tips

### Check if backend is running:
```bash
curl http://localhost:5000/health
# Should return: {"status":"OK","timestamp":"..."}
```

### Check if frontend is running:
```bash
# Open browser to http://localhost:5173
# Should load login page
```

### View backend logs:
Look at terminal where you ran `npm run dev` for backend

### View frontend logs:
Press F12 in browser → Console tab

### Check database connection:
```bash
mysql -h localhost -u root -p task_manager
SHOW TABLES;
```

### Monitor API calls:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform action
4. See all HTTP requests and responses

---

## 📞 Still Having Issues?

1. **Check all three are running:**
   - ✓ MySQL server: `mysql -u root -p`
   - ✓ Backend: `npm run dev` in backend folder
   - ✓ Frontend: `npm run dev` in frontend folder

2. **Check error messages carefully:**
   - Browser console (F12)
   - Backend terminal output
   - MySQL output

3. **Verify .env files:**
   - `backend/.env` exists with all required variables
   - `frontend/.env` exists with VITE_API_URL

4. **Clear everything and restart:**
   ```bash
   # Stop servers: Ctrl+C
   # Clear browser: Ctrl+Shift+Delete
   # Restart: npm run dev in both folders
   ```

5. **Check logs:**
   - Browser DevTools: F12 → Console
   - Backend terminal: scroll up for error messages
   - Database: Check with `SHOW TABLES;`

---

**Most issues are caused by:**
1. Missing MySQL setup (40%)
2. Incorrect .env configuration (30%)
3. Software not running (20%)
4. Browser cache (10%)

**If problem persists:**
- Write down exact error message
- Screenshot of error
- Steps to reproduce
- Share backend and frontend terminal output

---

Good luck! 🚀

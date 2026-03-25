# Setup Guide - Task Manager Application

Complete setup instructions for development and production environments.

## Prerequisites

- Node.js v16+ (Download: https://nodejs.org/)
- npm v8+ (included with Node.js)
- MySQL 8.0+ (Download: https://dev.mysql.com/downloads/mysql/)
- Git (Download: https://git-scm.com/)
- VS Code or preferred code editor

## Initial Setup (Windows)

### 1. Clone & Navigate to Project
```bash
git clone https://github.com/thomas-tran-fullstack/Task_Manager.git
cd task-manager
```

### 2. Setup MySQL Database

#### Option A: Using MySQL Command Line
```bash
# Open MySQL Command Line
mysql -u root -p

# Enter your root password, then run:
CREATE DATABASE task_manager;
USE task_manager;
SOURCE database/schema.sql;
EXIT;
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Create new schema: `task_manager`
4. File > Open SQL Script > Select `database/schema.sql`
5. Execute script

### 3. Backend Setup
```bash
cd backend

# Copy example env file
copy .env.example .env

# Edit .env with your MySQL credentials
# Open .env and update:
# - MYSQL_PASSWORD=your_password
# - JWT_SECRET=**** **** ****
# - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

# Install dependencies
npm install

# Start development server
npm run dev
```

The backend will be available at `http://localhost:5000`

### 4. Frontend Setup
```bash
cd ../frontend

# Copy example env file
copy .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 5. Verify Everything Works

1. Open browser to `http://localhost:5173`
2. Check backend health: `http://localhost:5000/health`
3. You should see the authentication page

## Environment Variables Configuration

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=paste_your_google_client_id
```

### Backend (.env)
```
PORT=5000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_database_password
MYSQL_DATABASE=task_manager
JWT_SECRET=generate_a_random_secret_key
GOOGLE_CLIENT_ID=paste_your_google_client_id
GOOGLE_CLIENT_SECRET=paste_your_google_client_secret
SMTP_USER=thomastran.fullstack@gmail.com
SMTP_PASSWORD=**** **** ****
```

## Setup Google OAuth (Optional but Recommended)

### Create Google OAuth Credentials
1. Go to: https://console.cloud.google.com/
2. Create a new project
3. Enable Google+ API
4. Go to Credentials > Create OAuth 2.0 Client ID
5. Select "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `http://localhost:5173`
7. Copy Client ID and Client Secret
8. Paste into backend `.env`

## Setup Email Service (Gmail)

### Enable Gmail SMTP
1. Enable 2-Factor Authentication on your Gmail account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Copy the 16-character password
4. Add to backend `.env`:
   ```
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=16_character_password (without spaces)
   ```

## Database Schema

The project automatically creates all required tables:
- `users` - User accounts
- `tasks` - Tasks data
- `otp_verification` - OTP codes for verification
- `password_reset_tokens` - Password reset tokens
- `login_activity` - Login audit trail
- `user_settings` - User preferences

## Troubleshooting

### MySQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306

Solution:
1. Check MySQL is running: services.msc (Windows)
2. Verify credentials in .env
3. Check database exists: CREATE DATABASE task_manager;
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000

Solution:
1. Change PORT in .env to different number (5001, 5002, etc.)
2. Or kill process: lsof -ti:5000 | xargs kill -9 (Mac/Linux)
```

### Module Not Found
```
Error: Cannot find module

Solution:
1. Delete node_modules folder
2. Delete package-lock.json
3. Run: npm install
```

### Google OAuth Not Working
```
Error: Invalid client configuration

Solution:
1. Check Client ID in .env matches Google Console
2. Verify redirect URI in Google Console matches app
3. Clear browser cache and local storage
```

## Development Workflow

### Starting Development

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Project Structure
```
task-manager/
├── frontend/         # React UI
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
├── backend/          # Node.js API
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── config/
│   └── package.json
├── database/
│   └── schema.sql    # Database schema
└── README.md
```

## Production Deployment

### Frontend (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy
vercel --prod
```

### Backend (Heroku/Railway)
```bash
# Add Procfile
echo "web: node src/server.js" > Procfile

# Deploy
git push heroku main
```

### Environment Variables for Production
- Set all `.env` variables in deployment platform settings
- Use strong JWT_SECRET
- Update FRONTEND_URL to production domain
- Update API_URL in frontend

## Performance Optimization

- Enable caching in production
- Use CDN for static assets
- Database query optimization with proper indexing
- API response compression
- Frontend code splitting and lazy loading

## Security Checklist

- [ ] Change JWT_SECRET to strong unique key
- [ ] Setup HTTPS for production
- [ ] Enable CORS properly (don't use *)
- [ ] Use environment variables for sensitive data
- [ ] Database backups configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)

## Next Steps

1. Read [DEVELOPMENT.md](./DEVELOPMENT.md) for coding guidelines
2. Check [IMPLEMENTATION.md](./backend/IMPLEMENTATION.md) for backend architecture
3. Review [COMPONENTS.md](./frontend/COMPONENTS.md) for frontend structure

## Support

For issues and questions:
- Check troubleshooting section above
- Review backend logs: `backend/logs/`
- Check browser console for frontend errors
- Read API documentation: `backend/API.md`

---

Happy coding! 🚀

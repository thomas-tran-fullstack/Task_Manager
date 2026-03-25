# Task Manager - Personal Task Management Application

> A modern, responsive React-based Single Page Application (SPA) for efficient personal task management with stunning UI/UX, authentication, and database integration.

## 📸 Features Overview

### Core Features
- ✅ **Add, Edit, Delete Tasks** - Full CRUD operations for task management
- 📊 **Task Status Management** - Organize tasks by TODO, In Progress, Done
- 🔍 **Search & Filter** - Search by name/description and filter by status, priority, deadline
- ⏰ **Deadline System** - Set deadlines for tasks with visual warnings for approaching/overdue tasks
- 📈 **Statistics Dashboard** - Quick overview of total tasks, completed, and overdue tasks
- 💾 **Data Persistence** - LocalStorage backup + MySQL database storage
- 📱 **Responsive Design** - Beautiful on mobile, tablet, and desktop
- 🎨 **Modern UI** - Tailwind CSS with animations, 3D effects, and hero banners

### Authentication Features
- 🔐 **User Registration & Login** - Secure authentication with JWT
- 🔑 **Google OAuth 2.0** - One-click Google login
  - If email exists: Direct login
  - If email not exists: Automatic account creation with OTP verification
- 🔄 **Forgot Password** - Password recovery with 6-digit OTP via email
- 📧 **Email OTP Verification** - 6-character OTP with 5-minute expiration
- 🎨 **Auth Page** - Split layout with hero banner and login/register card

### UI/UX Features
- 🔔 **PopMessage** - Toast notifications (success/error) at top-right, auto-dismiss in 3 seconds
- ⚡ **Loading Animations** - Modern, unique loading effects
- 🎪 **Hero Banners** - Prominent project showcases with animations
- 🌟 **Modern Effects** - Smooth animations, 3D transforms, glass-morphism, gradients
- 🎯 **Micro-interactions** - Intuitive hover effects and transitions

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MySQL (v8 or higher)
- Git

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### 3. Backend Setup
```bash
cd backend
npm install
```

#### 4. Database Setup
```bash
# Create MySQL database
mysql -u root -p < database/schema.sql

# Or manually:
# 1. Open MySQL
# 2. Create database: CREATE DATABASE task_manager;
# 3. Use database: USE task_manager;
# 4. Import schema: source path/to/schema.sql;
```

#### 5. Environment Configuration

**Backend (.env)**
```
PORT=5000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=task_manager
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

#### 6. Start Development Server
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

## 📖 Usage Guide

### Authentication
1. **Sign Up**: Create account with email and password
2. **Login**: Use registered email and password
3. **Google OAuth**: Click "Login with Google" for instant access
4. **Forgot Password**: Click "Forgot Password" → Enter email → Verify with OTP → Reset password

### Task Management
1. **Add Task**: Click "Add Task" button → Fill form → Set deadline → Submit
2. **Edit Task**: Click task card → Click edit icon → Modify → Save
3. **Delete Task**: Click task card → Click delete icon → Confirm
4. **Change Status**: Drag task between columns or click status button
5. **Set Deadline**: Select date/time when creating or editing task

### Filtering & Search
1. **Search**: Use search bar to find tasks by name/description
2. **Filter by Status**: Use status filter dropdown
3. **Filter by Priority**: Use priority filter dropdown
4. **Filter by Deadline**: Select time range (Today, This Week, Overdue)
5. **Reset Filters**: Click "Reset" button to clear all filters

### Notifications
- **Success**: Green popup appears for 3 seconds
- **Error**: Red popup appears for 3 seconds
- **Overdue**: Red badge on task card
- **Approaching**: Yellow badge on task card (24 hours before deadline)

## 🏗️ Project Structure

```
task-manager/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   ├── HeroBanner.jsx
│   │   │   │   ├── OTPVerification.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── Task/
│   │   │   │   ├── TaskCard.jsx
│   │   │   │   ├── TaskForm.jsx
│   │   │   │   ├── TaskBoard.jsx
│   │   │   │   ├── TaskFilter.jsx
│   │   │   │   └── TaskSearch.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── StatisticsWidget.jsx
│   │   │   │   └── ProgressChart.jsx
│   │   │   ├── Common/
│   │   │   │   ├── PopMessage.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── HeroBanner.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   └── Layout/
│   │   │       ├── MainLayout.jsx
│   │   │       └── AuthLayout.jsx
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TasksPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── taskService.js
│   │   │   ├── storageService.js
│   │   │   └── toastService.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── TaskContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useTasks.js
│   │   │   ├── useForm.js
│   │   │   └── useToast.js
│   │   ├── utils/
│   │   │   ├── validation.js
│   │   │   ├── formatters.js
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── animations.css
│   │   │   └── tailwind.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── tasks.js
│   │   │   └── user.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── taskController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Task.js
│   │   │   └── OTPVerification.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── taskService.js
│   │   │   ├── emailService.js
│   │   │   └── tokenService.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── googleOAuth.js
│   │   ├── index.js
│   │   └── server.js
│   ├── database/
│   │   └── schema.sql
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── database/
│   └── schema.sql
│
├── .gitignore
├── README.md
└── TODO.md
```

## 🛠️ Technical Decisions

### Frontend Framework
- **React 18** with Vite for fast development and optimized builds
- **Reason**: Excellent component reusability, large ecosystem, optimal for SPA

### Styling
- **Tailwind CSS** with custom animations and configurations
- **Reason**: Utility-first approach enables rapid UI development, highly customizable, excellent for responsive design

### State Management
- **React Context API** for global state (Auth, Tasks, Toast)
- **Reason**: Lightweight, built-in, sufficient for this project scope

### Database
- **MySQL** for robust, relational data storage
- **Reason**: Reliable, scalable, excellent for structured data like tasks and users

### Authentication
- **JWT (JSON Web Tokens)** for session management
- **Google OAuth 2.0** for third-party authentication
- **OTP via Email** for secure verification
- **Reason**: Industry standard, secure, supports both traditional and OAuth2 flows

### API Communication
- **Axios** with interceptors for automatic token refresh
- **Reason**: Better error handling than Fetch, supports request/response interceptors

### Backend
- **Express.js** with Node.js
- **Reason**: Lightweight, high performance, excellent for REST APIs

### Storage Strategy
- **LocalStorage** for offline task backup
- **MySQL Database** for primary data storage
- **Reason**: Ensures data persistence and enables offline functionality

## 📊 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "User Name"
}

Response (200):
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Google OAuth
```
POST /api/auth/google
Content-Type: application/json

{
  "idToken": "google_id_token_here"
}

Response (200):
{
  "success": true,
  "isNewUser": false,
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Forgot Password
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "message": "OTP sent to email"
}
```

#### Verify OTP
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}

Response (200):
{
  "success": true,
  "resetToken": "temporary_token_here"
}
```

#### Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "resetToken": "temporary_token_here",
  "newPassword": "newSecurePassword123"
}

Response (200):
{
  "success": true,
  "message": "Password reset successfully"
}
```

### Task Endpoints

#### Get All Tasks
```
GET /api/tasks
Authorization: Bearer jwt_token

Query Parameters:
  - status: TODO|In Progress|Done
  - priority: Low|Medium|High
  - search: search_term
  - sortBy: createdAt|deadline|priority

Response (200):
{
  "success": true,
  "tasks": [ ... ]
}
```

#### Create Task
```
POST /api/tasks
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task Description",
  "priority": "Medium",
  "deadline": "2024-12-31T23:59:59Z",
  "status": "TODO"
}

Response (201):
{
  "success": true,
  "task": { ... }
}
```

#### Update Task
```
PUT /api/tasks/:id
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated Description",
  "priority": "High",
  "deadline": "2024-12-31T23:59:59Z",
  "status": "In Progress"
}

Response (200):
{
  "success": true,
  "task": { ... }
}
```

#### Delete Task
```
DELETE /api/tasks/:id
Authorization: Bearer jwt_token

Response (200):
{
  "success": true,
  "message": "Task deleted successfully"
}
```

#### Get Statistics
```
GET /api/tasks/statistics
Authorization: Bearer jwt_token

Response (200):
{
  "success": true,
  "statistics": {
    "totalTasks": 25,
    "completedTasks": 10,
    "overdueTasks": 3,
    "inProgressTasks": 12,
    "completionRate": 40
  }
}
```

## 🎨 UI/UX Components

### PopMessage Component
Toast notifications displayed at top-right corner
```javascript
// Usage
const { showMessage } = useToast();
showMessage('Task created successfully', 'success');
showMessage('Error creating task', 'error');
```

### Loading Animation
Unique, modern loading effect while fetching data

### Hero Banner
Split layout with project logo, description, and authentication card

### Task Card
Modern card with 3D hover effect, deadline indicators, and action buttons

## 🚀 Performance Optimizations

- Code splitting and lazy loading for routes
- Image optimization with proper formats
- MinifiedCSS and JavaScript in production
- Efficient database queries with indexing
- LocalStorage sync to reduce API calls
- Debounced search and filter operations

## 🔒 Security Measures

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication with 24-hour expiration
- Refresh token rotation for enhanced security
- Email verification for account recovery
- OTP time-based expiration (5 minutes)
- CORS enabled only for allowed origins
- Input validation and sanitization on all endpoints
- Protected API endpoints with middleware
- Secure HTTP headers with helmet.js

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Database Connection Error
```
Error: Unable to connect to database
Solution: 
1. Verify MySQL is running
2. Check credentials in .env
3. Ensure database exists: CREATE DATABASE task_manager;
```

### Google OAuth Not Working
```
Error: Invalid client configuration
Solution:
1. Verify Google Client ID in .env
2. Check redirect URI in Google Console
3. Ensure .env variables are loaded
```

### OTP Not Received
```
Error: Email not sending
Solution:
1. Check SMTP credentials in .env
2. Enable "Less secure app access" for Gmail
3. Use app password instead of regular password
4. Check email spam folder
```

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS
Solution:
1. Verify backend CORS is configured
2. Check frontend VITE_API_URL
3. Ensure API URL matches backend origin
```

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variables
4. Deploy with `npm run build`

### Backend Deployment (Heroku/Railway)
1. Configure Procfile
2. Set environment variables
3. Deploy with Git push
4. Run migrations: `npm run migrate`

## 📈 Future Improvements

- **Email Notifications**: Send reminders 24 hours before deadline
- **Task Sharing**: Share tasks with other users or teams
- **Recurring Tasks**: Support for daily/weekly/monthly recurring tasks
- **Subtasks**: Break down tasks into smaller subtasks
- **File Attachments**: Attach files to tasks
- **Task Comments**: Collaborate with comments on tasks
- **Activity History**: Track all changes to tasks
- **Dark Mode**: Full dark mode support
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Task completion trends, productivity insights
- **Calendar View**: Kanban and calendar view options
- **Integration**: Sync with Google Calendar, Slack notifications
- **Offline Sync**: Better offline support with Service Workers
- **Tagging System**: Add tags/labels to tasks
- **Priority Levels**: More granular priority system
- **Time Tracking**: Track time spent on tasks
- **Team Management**: Multi-user support and collaboration

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For support email: support@taskmanager.com

---

**Last Updated**: March 25, 2026
**Version**: 1.0.0
**Developer**: Your Name

# Backend Implementation Guide

Complete implementation instructions for all backend features.

## Authentication Implementation

### 1. Register Endpoint (`POST /api/auth/register`)

```javascript
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '@/config/database'

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields required' })
    }

    const conn = await pool.getConnection()

    try {
      // Check if user exists
      const [existing] = await conn.query('SELECT id FROM users WHERE email = ?', [email])
      if (existing.length > 0) {
        return res.status(400).json({ message: 'Email already registered' })
      }

      // Hash password
      const hashedPassword = await bcryptjs.hash(password, 10)

      // Insert user
      const [result] = await conn.query(
        'INSERT INTO users (email, name, password_hash, is_verified) VALUES (?, ?, ?, ?)',
        [email, name, hashedPassword, false]
      )

      const userId = result.insertId

      // Generate tokens
      const token = jwt.sign(
        { id: userId, email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
      )

      res.status(201).json({
        success: true,
        token,
        user: { id: userId, email, name }
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
```

### 2. Login Endpoint (`POST /api/auth/login`)

Similar to register, but:
- Check if user exists
- Compare password hash with bcryptjs.compare()
- Return existing user data

### 3. Google OAuth (`POST /api/auth/google`)

```javascript
import { OAuth2Client } from 'google-auth-library'

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
)

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body

    // Verify token
    const ticket = await oauth2Client.verifyIdToken({ idToken })
    const payload = ticket.getPayload()

    const { email, name, picture } = payload
    const conn = await pool.getConnection()

    try {
      // Check if user exists
      const [existing] = await conn.query('SELECT * FROM users WHERE google_id = ? OR email = ?', [payload.sub, email])

      let user, token, isNewUser = false

      if (existing.length > 0) {
        user = existing[0]
      } else {
        // Create new user
        const [result] = await conn.query(
          'INSERT INTO users (email, name, google_id, profile_picture, is_verified) VALUES (?, ?, ?, ?, ?)',
          [email, name, payload.sub, picture, true]
        )
        user = { id: result.insertId, email, name, google_id: payload.sub }
        isNewUser = true
      }

      token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' })

      res.json({
        success: true,
        isNewUser,
        token,
        user
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid Google token' })
  }
}
```

### 4. OTP Verification

```javascript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
})

export const requestOTP = async (req, res) => {
  try {
    const { email, purpose } = req.body
    
    // Generate 6-digit OTP
    const otp = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
    
    const conn = await pool.getConnection()
    try {
      // Store OTP in database
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      
      await conn.query(
        'INSERT INTO otp_verification (email, otp_code, purpose, expires_at) VALUES (?, ?, ?, ?)',
        [email, otp, purpose, expiresAt]
      )

      // Send email
      await transporter.sendMail({
        to: email,
        subject: 'TaskFlow - OTP Verification',
        html: `<p>Your OTP is: <strong>${otp}</strong></p><p>Valid for 5 minutes</p>`
      })

      res.json({ success: true, message: 'OTP sent to email' })
    } finally {
      conn.release()
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body
    
    const conn = await pool.getConnection()
    try {
      // Check OTP
      const [records] = await conn.query(
        'SELECT * FROM otp_verification WHERE email = ? AND otp_code = ? AND purpose = ? AND is_used = FALSE AND expires_at > NOW()',
        [email, otp, purpose]
      )

      if (records.length === 0) {
        return res.status(400).json({ message: 'Invalid or expired OTP' })
      }

      // Mark OTP as used
      await conn.query('UPDATE otp_verification SET is_used = TRUE, used_at = NOW() WHERE id = ?', [records[0].id])

      // Generate reset token
      const resetToken = jwt.sign({ email, purpose }, process.env.JWT_SECRET, { expiresIn: '15m' })

      res.json({ success: true, resetToken })
    } finally {
      conn.release()
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
```

## Task Management Implementation

### Create Task

```javascript
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, deadline, status } = req.body
    const userId = req.user.id

    const conn = await pool.getConnection()
    try {
      const [result] = await conn.query(
        'INSERT INTO tasks (user_id, title, description, priority, deadline, status) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, title, description, priority, deadline, status]
      )

      res.status(201).json({
        success: true,
        task: {
          id: result.insertId,
          user_id: userId,
          title,
          description,
          priority,
          deadline,
          status,
          created_at: new Date()
        }
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
```

### Get All Tasks with Filters

```javascript
export const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id
    const { status, priority, search, sortBy } = req.query

    let query = 'SELECT * FROM tasks WHERE user_id = ? AND is_deleted = FALSE'
    const params = [userId]

    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }

    if (priority) {
      query += ' AND priority = ?'
      params.push(priority)
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    // Sorting
    const sortOptions = {
      'createdAt': 'created_at DESC',
      'deadline': 'deadline ASC',
      'priority': 'FIELD(priority, "High", "Medium", "Low")',
      'status': 'status ASC'
    }
    query += ` ORDER BY ${sortOptions[sortBy] || 'created_at DESC'}`

    const conn = await pool.getConnection()
    try {
      const [tasks] = await conn.query(query, params)
      res.json({ success: true, tasks })
    } finally {
      conn.release()
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
```

### Get Statistics

```javascript
export const getStatistics = async (req, res) => {
  try {
    const userId = req.user.id
    const conn = await pool.getConnection()

    try {
      const [stats] = await conn.query(
        `SELECT 
          COUNT(*) as totalTasks,
          SUM(CASE WHEN status = "Done" THEN 1 ELSE 0 END) as completedTasks,
          SUM(CASE WHEN status = "In Progress" THEN 1 ELSE 0 END) as inProgressTasks,
          SUM(CASE WHEN deadline < NOW() AND status != "Done" THEN 1 ELSE 0 END) as overdueTasks
        FROM tasks
        WHERE user_id = ? AND is_deleted = FALSE`,
        [userId]
      )

      res.json({ success: true, statistics: stats[0] })
    } finally {
      conn.release()
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
```

## Rate Limiting

```javascript
import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, try again later'
})

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 // 100 requests per 15 minutes
})

// Use in routes
app.post('/api/auth/login', authLimiter, loginHandler)
```

## Database Queries

### Stored Procedure for Statistics
```sql
DELIMITER //
CREATE PROCEDURE GetUserStatistics(IN userId INT)
BEGIN
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN status = 'Done' THEN 1 ELSE 0 END) as completed,
    SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
    SUM(CASE WHEN deadline < NOW() AND status != 'Done' THEN 1 ELSE 0 END) as overdue
  FROM tasks
  WHERE user_id = userId AND is_deleted = FALSE;
END //
DELIMITER ;
```

## Error Handling

```javascript
class AppError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

// Usage
if (!user) {
  throw new AppError('User not found', 404)
}
```

## Input Validation

```javascript
import { body, validationResult } from 'express-validator'

export const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[A-Z])(?=.*[0-9])/),
  body('name').trim().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]
```

---

See [SETUP.md](../SETUP.md) for database setup and [DEVELOPMENT.md](../DEVELOPMENT.md) for code standards.

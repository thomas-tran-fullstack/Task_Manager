import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getConnection } from '../config/database.js'
import { validateEmail, validatePassword } from '../utils/validation.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here'
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h'

// Generate JWT Token
const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  )
}

// Register Handler
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      })
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      })
    }

    const conn = await getConnection()
    try {
      // Check if user already exists
      const [existing] = await conn.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      )

      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        })
      }

      // Hash password
      const hashedPassword = await bcryptjs.hash(password, 10)

      // Insert user
      const [result] = await conn.query(
        'INSERT INTO users (email, name, password_hash, is_verified, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [email, name, hashedPassword, false]
      )

      const userId = result.insertId

      // Create default user settings
      await conn.query(
        'INSERT INTO user_settings (user_id) VALUES (?)',
        [userId]
      )

      // Generate token
      const token = generateToken(userId, email)

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: userId,
          email,
          name,
          profilePicture: null
        }
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    })
  }
}

// Login Handler
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    const conn = await getConnection()
    try {
      // Check if user exists
      const [users] = await conn.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      )

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
      }

      const user = users[0]

      // Check if user has password hash (not OAuth user)
      if (!user.password_hash) {
        return res.status(401).json({
          success: false,
          message: 'This account uses OAuth login'
        })
      }

      // Verify password
      const isPasswordValid = await bcryptjs.compare(password, user.password_hash)

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
      }

      // Update last login
      await conn.query(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [user.id]
      )

      // Generate token
      const token = generateToken(user.id, user.email)

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profilePicture: user.profile_picture
        }
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
}

// Logout Handler
export const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    })
  }
}

// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const conn = await getConnection()
    try {
      const [users] = await conn.query(
        'SELECT id, email, name, profile_picture FROM users WHERE id = ?',
        [req.user.id]
      )

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      const user = users[0]
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profilePicture: user.profile_picture
        }
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old password and new password are required'
      })
    }

    const conn = await getConnection()
    try {
      const [users] = await conn.query(
        'SELECT password_hash FROM users WHERE id = ?',
        [req.user.id]
      )

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      // Verify old password
      const isValid = await bcryptjs.compare(oldPassword, users[0].password_hash)
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Old password is incorrect'
        })
      }

      // Hash new password
      const hashedPassword = await bcryptjs.hash(newPassword, 10)

      // Update password
      await conn.query(
        'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
        [hashedPassword, req.user.id]
      )

      res.json({
        success: true,
        message: 'Password changed successfully'
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

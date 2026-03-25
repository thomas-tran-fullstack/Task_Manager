import { getConnection } from '@/config/database.js'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Helper function to generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  )
}

// Google OAuth Handler - Verify token và login
export const handleGoogleOAuth = async (req, res) => {
  try {
    const { idToken } = req.body

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token is required'
      })
    }

    // Verify token từ Google
    let ticket
    try {
      ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      })
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token'
      })
    }

    const payload = ticket.getPayload()
    const { sub: googleId, email, name, picture } = payload

    const conn = await getConnection()
    try {
      // Check nếu user đã tồn tại
      const [existingUsers] = await conn.query(
        'SELECT id, email, name, profile_picture FROM users WHERE email = ? OR google_id = ?',
        [email, googleId]
      )

      let user
      let isNewUser = false

      if (existingUsers.length > 0) {
        // User tồn tại - cập nhật google_id và profile picture
        user = existingUsers[0]
        if (!user.google_id) {
          await conn.query(
            'UPDATE users SET google_id = ?, profile_picture = ? WHERE id = ?',
            [googleId, picture, user.id]
          )
        }
      } else {
        // User mới - tạo account
        const [result] = await conn.query(
          `INSERT INTO users (email, name, google_id, profile_picture, is_verified, created_at, updated_at, last_login, is_active)
           VALUES (?, ?, ?, ?, TRUE, NOW(), NOW(), NOW(), TRUE)`,
          [email, name, googleId, picture]
        )

        const userId = result.insertId
        isNewUser = true

        // Auto-create user settings
        await conn.query(
          `INSERT INTO user_settings (user_id, theme, notification_enabled, email_notifications, created_at, updated_at)
           VALUES (?, 'light', TRUE, TRUE, NOW(), NOW())`,
          [userId]
        )

        user = { id: userId, email, name, profile_picture: picture }
      }

      // Generate token
      const token = generateToken(user.id, user.email)

      // Update last login
      await conn.query(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [user.id]
      )

      res.json({
        success: true,
        message: isNewUser ? 'Account created successfully' : 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profilePicture: user.profile_picture
        },
        token
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error('Google OAuth error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

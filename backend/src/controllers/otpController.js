import { getConnection } from '../config/database.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

// Setup email transporter (cần user config email settings)
const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
})

// Generate OTP (6 chữ số)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Request OTP - Gửi mã OTP qua email để xác thực hoặc reset password
export const requestOTP = async (req, res) => {
  try {
    const { email, purpose } = req.body
    // purpose: 'email_verification', 'password_reset'

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    if (!purpose) {
      return res.status(400).json({
        success: false,
        message: 'Purpose is required'
      })
    }

    const conn = await getConnection()
    try {
      // Check if email exists
      const [users] = await conn.query('SELECT id FROM users WHERE email = ?', [email])

      if (users.length === 0 && purpose === 'password_reset') {
        return res.status(404).json({
          success: false,
          message: 'Email not registered'
        })
      }

      // Generate OTP
      const otp = generateOTP()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 phút hết hạn

      // Delete old OTP nếu có
      await conn.query('DELETE FROM otp_verification WHERE email = ? AND purpose = ?', [email, purpose])

      // Insert new OTP
      await conn.query(
        `INSERT INTO otp_verification (email, otp_code, purpose, is_used, expires_at, created_at, attempt_count)
         VALUES (?, ?, ?, FALSE, ?, NOW(), 0)`,
        [email, otp, purpose, expiresAt]
      )

      // Gửi email
      try {
        await transporter.sendMail({
          from: process.env.SMTP_EMAIL,
          to: email,
          subject: purpose === 'password_reset' 
            ? 'Xác nhận reset mật khẩu - Task Manager'
            : 'Xác nhận email - Task Manager',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
              <h2 style="color: #333;">Mã xác nhận của bạn</h2>
              <p style="font-size: 16px; color: #666;">
                ${purpose === 'password_reset' 
                  ? 'Mã xác nhận để reset mật khẩu:' 
                  : 'Mã xác nhận email của bạn:'}
              </p>
              <div style="background-color: #0066cc; color: white; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: #999; font-size: 12px;">Mã này sẽ hết hạn trong 10 phút</p>
            </div>
          `
        })
      } catch (emailError) {
        console.error('Email send error:', emailError)
        // Không throw error, vẫn trả về success nhưng log error
      }

      res.json({
        success: true,
        message: 'OTP sent to email',
        // Không return OTP thực tế trong production
        // Chỉ return cho development/testing
        ...(process.env.NODE_ENV === 'development' && { otp })
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error('Request OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Verify OTP - Kiểm tra mã OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body

    if (!email || !otp || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP and purpose are required'
      })
    }

    const conn = await getConnection()
    try {
      // Tìm OTP record
      const [records] = await conn.query(
        `SELECT id, is_used, attempt_count, expires_at FROM otp_verification 
         WHERE email = ? AND purpose = ? 
         ORDER BY created_at DESC LIMIT 1`,
        [email, purpose]
      )

      if (records.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'OTP not found'
        })
      }

      const record = records[0]

      // Check nếu đã hết hạn
      if (new Date() > new Date(record.expires_at)) {
        return res.status(400).json({
          success: false,
          message: 'OTP expired'
        })
      }

      // Check nếu đã sử dụng
      if (record.is_used) {
        return res.status(400).json({
          success: false,
          message: 'OTP already used'
        })
      }

      // Check attempt count
      if (record.attempt_count >= 5) {
        return res.status(400).json({
          success: false,
          message: 'Too many failed attempts'
        })
      }

      // Verify OTP
      const [otpData] = await conn.query(
        'SELECT otp_code FROM otp_verification WHERE id = ?',
        [record.id]
      )

      if (otpData.length === 0 || otpData[0].otp_code !== otp) {
        // Increment attempt count
        await conn.query(
          'UPDATE otp_verification SET attempt_count = attempt_count + 1 WHERE id = ?',
          [record.id]
        )

        return res.status(400).json({
          success: false,
          message: 'Invalid OTP'
        })
      }

      // Mark as used
      await conn.query('UPDATE otp_verification SET is_used = TRUE WHERE id = ?', [record.id])

      res.json({
        success: true,
        message: 'OTP verified successfully',
        isVerified: true
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error('Verify OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Forgot Password - Bước 1: Request reset token
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    const conn = await getConnection()
    try {
      // Check nếu email tồn tại
      const [users] = await conn.query('SELECT id FROM users WHERE email = ?', [email])

      if (users.length === 0) {
        // Security: Không reveal email không tồn tại
        return res.json({
          success: true,
          message: 'If email exists, password reset link has been sent'
        })
      }

      const userId = users[0].id

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 giờ hết hạn

      // Insert token vào database
      await conn.query(
        `INSERT INTO password_reset_tokens (user_id, reset_token, is_used, expires_at, created_at)
         VALUES (?, ?, FALSE, ?, NOW())`,
        [userId, resetToken, expiresAt]
      )

      // Tăng OTP cho email confirmation
      const otp = generateOTP()
      await conn.query(
        `INSERT INTO otp_verification (email, otp_code, purpose, is_used, expires_at, created_at, attempt_count)
         VALUES (?, ?, 'password_reset', FALSE, DATE_ADD(NOW(), INTERVAL 10 MINUTE), NOW(), 0)`,
        [email, otp]
      )

      // Gửi email reset password
      try {
        await transporter.sendMail({
          from: process.env.SMTP_EMAIL,
          to: email,
          subject: 'Reset mật khẩu - Task Manager',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
              <h2 style="color: #333;">Reset mật khẩu</h2>
              <p style="font-size: 16px; color: #666;">Bạn yêu cầu reset mật khẩu cho tài khoản Task Manager.</p>
              <p style="font-size: 14px; color: #666;">Mã xác nhận: <strong>${otp}</strong></p>
              <p style="color: #999; font-size: 12px;">Mã này sẽ hết hạn trong 10 phút. Nếu không phải bạn yêu cầu, hãy bỏ qua email này.</p>
            </div>
          `
        })
      } catch (emailError) {
        console.error('Email send error:', emailError)
      }

      res.json({
        success: true,
        message: 'Password reset OTP has been sent to email'
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Reset Password - Bước 2: Reset sau khi verify OTP
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP and new password are required'
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      })
    }

    const conn = await getConnection()
    try {
      // Verify OTP đầu tiên
      const [records] = await conn.query(
        `SELECT id FROM otp_verification 
         WHERE email = ? AND otp_code = ? AND purpose = 'password_reset' 
         AND is_used = FALSE 
         AND expires_at > NOW()`,
        [email, otp]
      )

      if (records.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        })
      }

      // Get user
      const [users] = await conn.query('SELECT id FROM users WHERE email = ?', [email])

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      const userId = users[0].id

      // Hash password
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Update password
      await conn.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, userId])

      // Mark OTP as used
      await conn.query(
        `UPDATE otp_verification SET is_used = TRUE 
         WHERE email = ? AND otp_code = ? AND purpose = 'password_reset'`,
        [email, otp]
      )

      res.json({
        success: true,
        message: 'Password reset successfully'
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

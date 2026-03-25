import express from 'express'
import authenticateToken from '../middleware/auth.js'
import {
  register,
  login,
  logout,
  getCurrentUser,
  changePassword
} from '../controllers/authController.js'
import {
  requestOTP,
  verifyOTP,
  forgotPassword,
  resetPassword
} from '../controllers/otpController.js'
import {
  handleGoogleOAuth
} from '../controllers/googleOAuthController.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)

// OTP routes (public)
router.post('/request-otp', requestOTP)
router.post('/verify-otp', verifyOTP)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// Google OAuth (public)
router.post('/google', handleGoogleOAuth)

// Protected routes
router.get('/me', authenticateToken, getCurrentUser)
router.post('/logout', authenticateToken, logout)
router.post('/change-password', authenticateToken, changePassword)

// TODO: Implement in Priority 3
// router.post('/refresh-token', refreshToken)

export default router

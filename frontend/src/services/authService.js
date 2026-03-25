import api from './api'

export const authService = {
  // Register new user
  register: async (email, password, name) => {
    return api.post('/auth/register', { email, password, name })
  },

  // Login with email and password
  login: async (email, password) => {
    return api.post('/auth/login', { email, password })
  },

  // Google OAuth login
  googleLogin: async (idToken) => {
    return api.post('/auth/google', { idToken })
  },

  // Logout
  logout: async () => {
    return api.post('/auth/logout')
  },

  // Request OTP for verification
  requestOTP: async (email, purpose = 'email_verification') => {
    return api.post('/auth/request-otp', { email, purpose })
  },

  // Verify OTP
  verifyOTP: async (email, otp, purpose = 'email_verification') => {
    return api.post('/auth/verify-otp', { email, otp, purpose })
  },

  // Forgot password - send OTP
  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email })
  },

  // Reset password using reset token
  resetPassword: async (resetToken, newPassword) => {
    return api.post('/auth/reset-password', { resetToken, newPassword })
  },

  // Refresh token
  refreshToken: async () => {
    return api.post('/auth/refresh-token')
  },

  // Get current user
  getCurrentUser: async () => {
    return api.get('/auth/me')
  },

  // Update profile
  updateProfile: async (profileData) => {
    return api.put('/user/profile', profileData)
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    return api.post('/auth/change-password', { oldPassword, newPassword })
  },

  // Delete account
  deleteAccount: async () => {
    return api.delete('/user/account')
  }
}

export default authService

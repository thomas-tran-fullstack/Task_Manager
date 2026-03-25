// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
export const validatePassword = (password) => {
  // Minimum 8 characters
  return password && password.length >= 8
}

// Name validation
export const validateName = (name) => {
  return name && name.trim().length > 0 && name.length <= 255
}

// Task title validation
export const validateTaskTitle = (title) => {
  return title && title.trim().length > 0 && title.length <= 255
}

// Priority validation
export const validatePriority = (priority) => {
  const validPriorities = ['Low', 'Medium', 'High']
  return validPriorities.includes(priority)
}

// Status validation
export const validateStatus = (status) => {
  const validStatuses = ['TODO', 'In Progress', 'Done']
  return validStatuses.includes(status)
}

// Deadline validation
export const validateDeadline = (deadline) => {
  if (!deadline) return true // Optional field
  const date = new Date(deadline)
  return !isNaN(date.getTime())
}

// OTP validation
export const validateOTP = (otp) => {
  const otpRegex = /^\d{6}$/
  return otpRegex.test(otp)
}

// Purpose validation for OTP
export const validateOTPPurpose = (purpose) => {
  const validPurposes = ['email_verification', 'password_reset', 'login_otp']
  return validPurposes.includes(purpose)
}

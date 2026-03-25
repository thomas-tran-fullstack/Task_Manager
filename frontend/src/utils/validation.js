export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validatePassword = (password) => {
  // Password should be at least 8 characters with uppercase, lowercase, number and special char
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return regex.test(password)
}

export const validatePasswordStrength = (password) => {
  let strength = 0
  
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[@$!%*?&]/.test(password)) strength++
  
  return {
    score: strength,
    label: ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength]
  }
}

export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp)
}

export const validateTaskTitle = (title) => {
  return title && title.trim().length > 0 && title.trim().length <= 255
}

export const validateDeadline = (deadline) => {
  if (!deadline) return true
  const date = new Date(deadline)
  return date > new Date()
}

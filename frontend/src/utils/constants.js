export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done'
}

export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
}

export const PRIORITY_COLORS = {
  'Low': 'bg-blue-100 text-blue-800 border-blue-300',
  'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'High': 'bg-red-100 text-red-800 border-red-300'
}

export const STATUS_COLORS = {
  'TODO': 'bg-gray-100 text-gray-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Done': 'bg-green-100 text-green-800'
}

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const TOAST_DURATION = 3000

export const OTP_LENGTH = 6

export const OTP_EXPIRY_MINUTES = 5

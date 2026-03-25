export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export const formatDateTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return formatDate(date)
}

export const getDeadlineStatus = (deadline, status) => {
  if (status === 'Done') return 'completed'
  if (!deadline) return 'no-deadline'
  
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'overdue'
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'tomorrow'
  if (diffDays <= 3) return 'soon'
  
  return 'upcoming'
}

export const truncateText = (text, length = 100) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export const capitalizeFirst = (text) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const formatTaskCount = (count) => {
  if (count === 0) return 'No tasks'
  if (count === 1) return '1 task'
  return `${count} tasks`
}

export const getCompletionPercentage = (completed, total) => {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

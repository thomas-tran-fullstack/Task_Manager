import api from './api'

export const taskService = {
  // Get all tasks
  getAllTasks: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.priority) params.append('priority', filters.priority)
    if (filters.search) params.append('search', filters.search)
    if (filters.sortBy) params.append('sortBy', filters.sortBy)
    
    return api.get(`/tasks?${params.toString()}`)
  },

  // Get single task
  getTask: async (id) => {
    return api.get(`/tasks/${id}`)
  },

  // Create new task
  createTask: async (taskData) => {
    return api.post('/tasks', taskData)
  },

  // Update task
  updateTask: async (id, taskData) => {
    return api.put(`/tasks/${id}`, taskData)
  },

  // Update task status
  updateTaskStatus: async (id, status) => {
    return api.put(`/tasks/${id}/status`, { status })
  },

  // Delete task
  deleteTask: async (id) => {
    return api.delete(`/tasks/${id}`)
  },

  // Get task statistics
  getStatistics: async () => {
    return api.get('/tasks/statistics')
  },

  // Search tasks
  searchTasks: async (query) => {
    return api.get(`/tasks/search?q=${query}`)
  },

  // Get tasks by status
  getTasksByStatus: async (status) => {
    return api.get(`/tasks?status=${status}`)
  },

  // Get overdue tasks
  getOverdueTasks: async () => {
    return api.get('/tasks/overdue')
  },

  // Bulk update tasks
  bulkUpdateTasks: async (updates) => {
    return api.post('/tasks/bulk-update', { updates })
  },

  // Bulk delete tasks
  bulkDeleteTasks: async (taskIds) => {
    return api.post('/tasks/bulk-delete', { taskIds })
  },

  // Export tasks
  exportTasks: async (format = 'csv') => {
    return api.get(`/tasks/export?format=${format}`)
  },

  // Import tasks
  importTasks: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/tasks/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export default taskService

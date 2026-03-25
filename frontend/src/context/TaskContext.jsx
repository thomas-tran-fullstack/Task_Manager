import React, { createContext, useState, useCallback, useEffect } from 'react'
import { useToast } from '@/hooks/useToast'
import { taskService } from '@/services/taskService'

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    status: null,
    priority: null,
    search: '',
    deadline: null
  })
  const [statistics, setStatistics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    inProgressTasks: 0
  })
  const { showMessage } = useToast()

  // Load tasks from API on mount
  useEffect(() => {
    fetchTasks()
    fetchStatistics()
  }, [])

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await taskService.getAllTasks(filters)
      if (response.success) {
        setTasks(response.tasks || [])
      }
    } catch (error) {
      console.error('Failed to load tasks:', error)
      showMessage('Failed to load tasks', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [filters, showMessage])

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await taskService.getStatistics()
      if (response.success) {
        setStatistics(response.statistics || {
          totalTasks: 0,
          completedTasks: 0,
          overdueTasks: 0,
          inProgressTasks: 0
        })
      }
    } catch (error) {
      console.error('Failed to load statistics:', error)
    }
  }, [])

  const addTask = useCallback(async (taskData) => {
    try {
      setIsLoading(true)
      const response = await taskService.createTask(taskData)
      if (response.success) {
        setTasks(prev => [...prev, response.task])
        showMessage('Task created successfully', 'success')
        await fetchStatistics()
        return response.task
      } else {
        showMessage(response.message || 'Failed to create task', 'error')
      }
    } catch (error) {
      showMessage(error.message || 'Failed to create task', 'error')
      console.error('Create task error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [showMessage, fetchStatistics])

  const updateTask = useCallback(async (id, updates) => {
    try {
      setIsLoading(true)
      const response = await taskService.updateTask(id, updates)
      if (response.success) {
        setTasks(prev =>
          prev.map(task =>
            task.id === id
              ? { ...task, ...updates }
              : task
          )
        )
        showMessage('Task updated successfully', 'success')
        await fetchStatistics()
      } else {
        showMessage(response.message || 'Failed to update task', 'error')
      }
    } catch (error) {
      showMessage(error.message || 'Failed to update task', 'error')
      console.error('Update task error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [showMessage, fetchStatistics])

  const updateTaskStatus = useCallback(async (id, status) => {
    try {
      const response = await taskService.updateTaskStatus(id, status)
      if (response.success) {
        setTasks(prev =>
          prev.map(task =>
            task.id === id
              ? { ...task, status }
              : task
          )
        )
        showMessage('Task status updated', 'success')
        await fetchStatistics()
      }
    } catch (error) {
      showMessage(error.message || 'Failed to update task status', 'error')
    }
  }, [showMessage, fetchStatistics])

  const deleteTask = useCallback(async (id) => {
    try {
      const response = await taskService.deleteTask(id)
      if (response.success) {
        setTasks(prev => prev.filter(task => task.id !== id))
        showMessage('Task deleted successfully', 'success')
        await fetchStatistics()
      } else {
        showMessage(response.message || 'Failed to delete task', 'error')
      }
    } catch (error) {
      showMessage(error.message || 'Failed to delete task', 'error')
    }
  }, [showMessage, fetchStatistics])

  const getFilteredTasks = useCallback(() => {
    return tasks.filter(task => {
      if (filters.status && task.status !== filters.status) return false
      if (filters.priority && task.priority !== filters.priority) return false
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!task.title?.toLowerCase().includes(searchLower) &&
            !task.description?.toLowerCase().includes(searchLower)) {
          return false
        }
      }
      return true
    })
  }, [tasks, filters])

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      status: null,
      priority: null,
      search: '',
      deadline: null
    })
  }, [])

  const value = {
    tasks,
    isLoading,
    filters,
    statistics,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getFilteredTasks,
    updateFilters,
    resetFilters,
    fetchTasks,
    fetchStatistics
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}


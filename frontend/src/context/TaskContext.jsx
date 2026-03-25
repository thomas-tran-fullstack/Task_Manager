import React, { createContext, useState, useCallback, useEffect } from 'react'
import { useToast } from '@/hooks/useToast'

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

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (error) {
        console.error('Failed to load tasks from storage:', error)
      }
    }
  }, [])

  // Update localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
    updateStatistics()
  }, [tasks])

  const updateStatistics = useCallback(() => {
    const stats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'Done').length,
      overdueTasks: tasks.filter(t => {
        if (t.status === 'Done') return false
        if (!t.deadline) return false
        return new Date(t.deadline) < new Date()
      }).length,
      inProgressTasks: tasks.filter(t => t.status === 'In Progress').length
    }
    setStatistics(stats)
  }, [tasks])

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setTasks(prev => [...prev, newTask])
    showMessage('Task created successfully', 'success')
    return newTask
  }, [showMessage])

  const updateTask = useCallback((id, updates) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    )
    showMessage('Task updated successfully', 'success')
  }, [showMessage])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id))
    showMessage('Task deleted successfully', 'success')
  }, [showMessage])

  const getFilteredTasks = useCallback(() => {
    return tasks.filter(task => {
      if (filters.status && task.status !== filters.status) return false
      if (filters.priority && task.priority !== filters.priority) return false
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!task.title.toLowerCase().includes(searchLower) &&
            !task.description?.toLowerCase().includes(searchLower)) {
          return false
        }
      }
      if (filters.deadline) {
        const now = new Date()
        const taskDate = new Date(task.deadline)
        
        switch (filters.deadline) {
          case 'today':
            if (taskDate.toDateString() !== now.toDateString()) return false
            break
          case 'week':
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
            if (taskDate > weekFromNow) return false
            break
          case 'overdue':
            if (taskDate >= now || task.status === 'Done') return false
            break
          default:
            break
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
    deleteTask,
    getFilteredTasks,
    updateFilters,
    resetFilters
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}

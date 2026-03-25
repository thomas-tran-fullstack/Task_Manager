import React, { createContext, useState, useCallback, useEffect } from 'react'
import { useToast } from '@/hooks/useToast'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { showMessage } = useToast()

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        
        if (token && userStr) {
          setUser(JSON.parse(userStr))
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = useCallback((userData, token) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    showMessage('Logged in successfully', 'success')
  }, [showMessage])

  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    showMessage('Logged out successfully', 'success')
  }, [showMessage])

  const updateUser = useCallback((userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }, [])

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

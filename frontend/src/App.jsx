import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from '@/context/AuthContext'
import { TaskProvider } from '@/context/TaskContext'
import { ToastProvider } from '@/context/ToastContext'
import PopMessage from '@/components/Common/PopMessage'
import LoadingSpinner from '@/components/Common/LoadingSpinner'
import ErrorBoundary from '@/components/Common/ErrorBoundary'

// Lazy load pages
const AuthPage = lazy(() => import('@/pages/AuthPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const TasksPage = lazy(() => import('@/pages/TasksPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  if (isLoading) return <LoadingSpinner fullScreen />
  return isAuthenticated ? children : <Navigate to="/auth" replace />
}

function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ToastProvider>
        <AuthProvider>
          <TaskProvider>
            <Router>
              <Routes>
              <Route
                path="/auth"
                element={
                  <Suspense fallback={<LoadingSpinner fullScreen />}>
                    <AuthPage />
                  </Suspense>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <Suspense fallback={<LoadingSpinner fullScreen />}>
                    <ForgotPasswordPage />
                  </Suspense>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner fullScreen />}>
                      <DashboardPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner fullScreen />}>
                      <TasksPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="*"
                element={
                  <Suspense fallback={<LoadingSpinner fullScreen />}>
                    <NotFoundPage />
                  </Suspense>
                }
              />
            </Routes>
          </Router>
          <PopMessage />
        </TaskProvider>
      </AuthProvider>
    </ToastProvider>
    </GoogleOAuthProvider>
    </ErrorBoundary>
  )
}

export default App

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LogOut, Menu, X, Settings, User as UserIcon } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  const handleToTasks = () => {
    navigate('/tasks')
  }

  const handleToDashboard = () => {
    navigate('/dashboard')
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleToDashboard}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">TM</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={handleToDashboard}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={handleToTasks}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Tasks
            </button>

            {/* User Profile Dropdown */}
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slideInDown">
            <button
              onClick={() => {
                handleToDashboard()
                setIsOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                handleToTasks()
                setIsOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Tasks
            </button>
            <div className="px-4 py-3 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
              <button
                onClick={() => {
                  handleLogout()
                  setIsOpen(false)
                }}
                className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

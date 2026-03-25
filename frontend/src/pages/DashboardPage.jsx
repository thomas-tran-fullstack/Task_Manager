import React from 'react'
import { useTasks } from '@/hooks/useTasks'
import { TrendingUp, Zap, AlertCircle, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Common/Navbar'

const DashboardPage = () => {
  const { statistics } = useTasks()

  const completionRate = statistics.totalTasks > 0 
    ? Math.round((statistics.completedTasks / statistics.totalTasks) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideInDown">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your task overview.</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tasks */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow animate-slideInUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{statistics.totalTasks}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow animate-slideInUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{statistics.completedTasks}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow animate-slideInUp" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">In Progress</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{statistics.inProgressTasks}</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Overdue */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow animate-slideInUp" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Overdue</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{statistics.overdueTasks}</h3>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-xl shadow-lg p-8 animate-slideInUp" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Completion Rate</h2>
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-600 text-sm">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{completionRate}%</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Tasks Remaining</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{statistics.totalTasks - statistics.completedTasks}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Tasks Due</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{statistics.overdueTasks}</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

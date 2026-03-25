import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="text-center animate-slideInDown">
        <div className="mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            404
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-xl text-gray-600">Sorry, the page you're looking for doesn't exist.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        <div className="mb-8">
          <svg className="w-64 h-64 mx-auto opacity-50" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" stroke="#3b82f6" strokeWidth="2" opacity="0.3" />
            <circle cx="100" cy="100" r="60" stroke="#8b5cf6" strokeWidth="2" opacity="0.3" />
            <circle cx="100" cy="100" r="40" stroke="#ec4899" strokeWidth="2" opacity="0.3" />
          </svg>
        </div>

        <p className="text-gray-600 max-w-md mx-auto">
          If you think this is an error, please contact support or go back to continue managing your tasks.
        </p>
      </div>
    </div>
  )
}

export default NotFoundPage

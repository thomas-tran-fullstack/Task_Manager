# Frontend Implementation Guide

Complete implementation instructions for React components and features.

## Component Development

### 1. Task Card Component

```javascript
// src/components/Task/TaskCard.jsx
import React from 'react'
import { Edit2, Trash2, Calendar, Flag } from 'lucide-react'
import { formatDate, getDeadlineStatus } from '@/utils/formatters'

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const deadlineStatus = getDeadlineStatus(task.deadline, task.status)
  
  const getStatusColor = () => {
    switch (deadlineStatus) {
      case 'overdue': return 'bg-red-100 text-red-700 border-red-300'
      case 'today': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'soon': return 'bg-orange-100 text-orange-700 border-orange-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(task)} className="p-2 hover:bg-blue-100 rounded transition">
            <Edit2 className="w-4 h-4 text-blue-600" />
          </button>
          <button onClick={() => onDelete(task.id)} className="p-2 hover:bg-red-100 rounded transition">
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          task.priority === 'High' ? 'bg-red-100 text-red-800' :
          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {task.priority}
        </span>
        
        {task.deadline && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor()}`}>
            <Calendar className="w-3 h-3" />
            {formatDate(task.deadline)}
          </span>
        )}
      </div>

      <select
        value={task.status}
        onChange={(e) => onStatusChange(task.id, e.target.value)}
        className="w-full px-3 py-2 border-2 border-gray-200 rounded text-sm font-medium focus:border-blue-500 outline-none transition-colors"
      >
        <option value="TODO">TODO</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
    </div>
  )
}

export default TaskCard
```

### 2. Task Form Component

```javascript
// src/components/Task/TaskForm.jsx
import React, { useState, useEffect } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { useToast } from '@/hooks/useToast'

const TaskForm = ({ task = null, onClose }) => {
  const { addTask, updateTask } = useTasks()
  const { showMessage } = useToast()
  
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'Medium',
    deadline: task?.deadline || '',
    status: task?.status || 'TODO'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      showMessage('Title is required', 'error')
      return
    }

    if (task) {
      updateTask(task.id, formData)
    } else {
      addTask(formData)
    }
    
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md animate-slideInDown">
        <h2 className="text-2xl font-bold mb-6">{task ? 'Edit' : 'Create'} Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Task title"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Task description"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none min-h-24"
            />
          </div>

          {/* Priority & Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {task ? 'Update' : 'Create'} Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm
```

### 3. Authentication Modal (OTP Verification)

```javascript
// src/components/Auth/OTPInput.jsx
import React, { useState, useRef, useEffect } from 'react'

const OTPInput = ({ length = 6, onComplete, isLoading }) => {
  const [otp, setOtp] = useState(Array(length).fill(''))
  const inputRefs = useRef([])

  const handleChange = (e, index) => {
    const value = e.target.value.slice(-1) // Only last character
    if (!/^\d*$/.test(value)) return // Only numbers

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if complete
    if (newOtp.every(v => v !== '')) {
      onComplete(newOtp.join(''))
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="flex gap-3 justify-center mb-6">
      {otp.map((value, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          value={value}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          maxLength="1"
          disabled={isLoading}
          className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100"
        />
      ))}
    </div>
  )
}

export default OTPInput
```

## State Management Examples

### Using Context API

```javascript
// src/context/AppContext.jsx
import React, { createContext, useState, useCallback } from 'react'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    tasks: [],
    notifications: []
  })

  const updateUser = useCallback((user) => {
    setState(prev => ({ ...prev, user }))
  }, [])

  const updateTasks = useCallback((tasks) => {
    setState(prev => ({ ...prev, tasks }))
  }, [])

  return (
    <AppContext.Provider value={{ state, updateUser, updateTasks }}>
      {children}
    </AppContext.Provider>
  )
}
```

## API Integration Examples

### Async Task Loading

```javascript
// useEffect in component
useEffect(() => {
  const loadTasks = async () => {
    try {
      const response = await taskService.getAllTasks()
      setTasks(response.data)
    } catch (error) {
      showMessage(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  loadTasks()
}, [])
```

## Animations with Tailwind

### Custom Animations

```javascript
// tailwind.config.js - Already configured
const tailwindConfig = {
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in',
        slideInUp: 'slideInUp 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  }
}

// Usage in components
<div className="animate-slideInUp">Content</div>
```

## Form Handling

### Custom useForm Hook

```javascript
// src/hooks/useForm.js
import { useState, useCallback } from 'react'

export const useForm = (initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    try {
      await onSubmit(values)
    } catch (error) {
      setErrors(error.validation || {})
    }
  }, [values, onSubmit])

  return { values, errors, handleChange, handleSubmit, setValues }
}

// Usage
const { values, handleChange, handleSubmit } = useForm(
  { email: '', password: '' },
  async (data) => await authService.login(data.email, data.password)
)
```

## Performance Optimization

### Memoization

```javascript
import { memo } from 'react'

// Prevent unnecessary re-renders
const TaskCard = memo(({ task, onEdit, onDelete }) => {
  return <div>{/* Component */}</div>
}, (prevProps, nextProps) => {
  return prevProps.task.id === nextProps.task.id
})
```

### Code Splitting

```javascript
// Lazy load heavy components
const TaskBoard = lazy(() => import('@/components/Task/TaskBoard'))

<Suspense fallback={<LoadingSpinner />}>
  <TaskBoard />
</Suspense>
```

---

For more examples and best practices, see [DEVELOPMENT.md](../DEVELOPMENT.md).

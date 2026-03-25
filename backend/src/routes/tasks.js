import express from 'express'
import authenticateToken from '../middleware/auth.js'
import {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getStatistics,
  searchTasks,
  getOverdueTasks
} from '../controllers/taskController.js'

const router = express.Router()

// Statistics route (must come before /:id route to avoid conflict)
router.get('/statistics', authenticateToken, getStatistics)
router.get('/overdue', authenticateToken, getOverdueTasks)
router.get('/search', authenticateToken, searchTasks)

// Task CRUD routes
router.get('/', authenticateToken, getAllTasks)
router.post('/', authenticateToken, createTask)
router.get('/:id', authenticateToken, getTask)
router.put('/:id', authenticateToken, updateTask)
router.put('/:id/status', authenticateToken, updateTaskStatus)
router.delete('/:id', authenticateToken, deleteTask)

export default router

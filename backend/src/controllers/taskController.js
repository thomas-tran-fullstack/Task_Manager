import { getConnection } from '../config/database.js'

// Get All Tasks
export const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id
    const { status, priority, search, sortBy } = req.query

    let query = 'SELECT * FROM tasks WHERE user_id = ? AND is_deleted = FALSE'
    const params = [userId]

    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }

    if (priority) {
      query += ' AND priority = ?'
      params.push(priority)
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    // Sorting
    const sortOptions = {
      'createdAt': 'created_at DESC',
      'deadline': 'deadline ASC NULLS LAST',
      'priority': 'FIELD(priority, "High", "Medium", "Low")',
      'status': 'status ASC'
    }
    const orderBy = sortOptions[sortBy] || 'created_at DESC'
    query += ` ORDER BY ${orderBy}`

    const conn = await getConnection()
    try {
      const [tasks] = await conn.query(query, params)
      res.json({
        success: true,
        tasks
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error('Get tasks error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Get Single Task
export const getTask = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const conn = await getConnection()
    try {
      const [tasks] = await conn.query(
        'SELECT * FROM tasks WHERE id = ? AND user_id = ? AND is_deleted = FALSE',
        [id, userId]
      )

      if (tasks.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        })
      }

      res.json({
        success: true,
        task: tasks[0]
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Create Task
export const createTask = async (req, res) => {
  try {
    const userId = req.user.id
    const { title, description, priority, deadline, status } = req.body

    // Validate
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      })
    }

    const conn = await getConnection()
    try {
      const [result] = await conn.query(
        `INSERT INTO tasks 
         (user_id, title, description, priority, deadline, status, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [userId, title, description || null, priority || 'Medium', deadline || null, status || 'TODO']
      )

      const taskId = result.insertId

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        task: {
          id: taskId,
          user_id: userId,
          title,
          description,
          priority: priority || 'Medium',
          deadline,
          status: status || 'TODO',
          created_at: new Date(),
          updated_at: new Date()
        }
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error('Create task error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Update Task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const { title, description, priority, deadline, status } = req.body

    const conn = await getConnection()
    try {
      // Check task exists
      const [existing] = await conn.query(
        'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
        [id, userId]
      )

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        })
      }

      const updateFields = []
      const updateValues = []

      if (title !== undefined) {
        updateFields.push('title = ?')
        updateValues.push(title)
      }
      if (description !== undefined) {
        updateFields.push('description = ?')
        updateValues.push(description)
      }
      if (priority !== undefined) {
        updateFields.push('priority = ?')
        updateValues.push(priority)
      }
      if (deadline !== undefined) {
        updateFields.push('deadline = ?')
        updateValues.push(deadline)
      }
      if (status !== undefined) {
        updateFields.push('status = ?')
        updateValues.push(status)
        if (status === 'Done') {
          updateFields.push('completed_at = NOW()')
        }
      }

      updateFields.push('updated_at = NOW()')
      updateValues.push(id, userId)

      const query = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`

      await conn.query(query, updateValues)

      res.json({
        success: true,
        message: 'Task updated successfully'
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error('Update task error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Update Task Status
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const userId = req.user.id

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      })
    }

    const conn = await getConnection()
    try {
      let updateQuery = 'UPDATE tasks SET status = ?, updated_at = NOW()'
      const params = [status, id, userId]

      if (status === 'Done') {
        updateQuery += ', completed_at = NOW()'
      }

      updateQuery += ' WHERE id = ? AND user_id = ?'

      await conn.query(updateQuery, params)

      res.json({
        success: true,
        message: 'Task status updated successfully'
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const conn = await getConnection()
    try {
      const [result] = await conn.query(
        'UPDATE tasks SET is_deleted = TRUE, deleted_at = NOW() WHERE id = ? AND user_id = ?',
        [id, userId]
      )

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        })
      }

      res.json({
        success: true,
        message: 'Task deleted successfully'
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Get Statistics
export const getStatistics = async (req, res) => {
  try {
    const userId = req.user.id

    const conn = await getConnection()
    try {
      const [statistics] = await conn.query(
        `SELECT 
          COUNT(*) as totalTasks,
          SUM(CASE WHEN status = 'Done' THEN 1 ELSE 0 END) as completedTasks,
          SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as inProgressTasks,
          SUM(CASE WHEN deadline < NOW() AND status != 'Done' THEN 1 ELSE 0 END) as overdueTasks
        FROM tasks
        WHERE user_id = ? AND is_deleted = FALSE`,
        [userId]
      )

      const stats = statistics[0] || {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        overdueTasks: 0
      }

      res.json({
        success: true,
        statistics: stats
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Search Tasks (Alias for getAllTasks with search)
export const searchTasks = async (req, res) => {
  try {
    const { q } = req.query
    req.query.search = q
    return getAllTasks(req, res)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Get Overdue Tasks
export const getOverdueTasks = async (req, res) => {
  try {
    const userId = req.user.id

    const conn = await getConnection()
    try {
      const [tasks] = await conn.query(
        `SELECT * FROM tasks 
        WHERE user_id = ? AND is_deleted = FALSE 
        AND deadline < NOW() AND status != 'Done'
        ORDER BY deadline ASC`,
        [userId]
      )

      res.json({
        success: true,
        tasks
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

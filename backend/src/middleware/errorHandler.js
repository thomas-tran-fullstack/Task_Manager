const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err)

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.details
    })
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Unauthorized'
    })
  }

  if (err.status) {
    return res.status(err.status).json({
      message: err.message
    })
  }

  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
}

export default errorHandler

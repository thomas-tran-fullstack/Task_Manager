# Development Guide - Task Manager Application

Best practices, coding standards, and development workflow.

## Code Quality Standards

### Naming Conventions
- **Components**: PascalCase (e.g., `TaskCard.jsx`, `UserProfile.jsx`)
- **Functions/Variables**: camelCase (e.g., `getTasks()`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `TASK_STATUS`)
- **Files**: kebab-case for non-React files (e.g., `api-service.js`)
- **CSS Classes**: kebab-case (e.g., `task-card`, `user-profile`)

### React Best Practices
```javascript
// ✅ Good: Functional components with hooks
const TaskList = ({ tasks, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { showMessage } = useToast()

  useEffect(() => {
    // Effect logic
  }, [dependencies])

  return <div>{/* JSX */}</div>
}

// ❌ Bad: Class components (outdated)
// ❌ Bad: Inline styles
// ❌ Bad: No prop validation
```

### Component Structure
```
components/
├── Common/           # Reusable components
│   ├── Button.jsx
│   ├── Input.jsx
│   └── Modal.jsx
├── Task/             # Feature-specific
│   ├── TaskCard.jsx
│   ├── TaskForm.jsx
│   └── TaskList.jsx
└── Auth/
    ├── LoginForm.jsx
    └── RegisterForm.jsx
```

### Backend Best Practices
```javascript
// ✅ Good: Clear error handling
router.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.user.id)
    res.json({ success: true, data: tasks })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ❌ Bad: No error handling
// ❌ Bad: Sensitive data in logs
// ❌ Bad: No input validation
```

## Git Workflow

### Commit Messages
Follow conventional commits format:
```
feat: add task search functionality
fix: resolve deadline calculation bug
docs: update README with setup guide
style: format code with prettier
refactor: optimize database queries
test: add unit tests for taskService
```

### Branch Naming
```
feature/task-search
feature/google-oauth
bugfix/deadline-calculation
docs/readme-update
```

### Example Workflow
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: implement my feature"

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request on GitHub
# Request code review
# Merge after approval
```

## Testing

### Frontend Testing (Jest + React Testing Library)
```javascript
import { render, screen } from '@testing-library/react'
import TaskCard from '@/components/Task/TaskCard'

describe('TaskCard', () => {
  it('renders task title', () => {
    const task = { id: 1, title: 'Test Task', status: 'TODO' }
    render(<TaskCard task={task} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })
})
```

### Backend Testing (Jest + Supertest)
```javascript
import request from 'supertest'
import app from '@/server'

describe('GET /api/tasks', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/tasks')
    expect(res.statusCode).toBe(401)
  })
})
```

## Code Review Checklist

- [ ] Code follows naming conventions
- [ ] No console.log() statements left
- [ ] Proper error handling implemented
- [ ] Loading states handled
- [ ] No hardcoded values
- [ ] Environment variables used
- [ ] Comments for complex logic
- [ ] TypeScript types complete (if using TS)
- [ ] No security vulnerabilities
- [ ] Performance optimized

## Performance Tips

### frontend
- Use React.memo for expensive components
- Implement code splitting with React.lazy()
- Debounce search and filter inputs
- Use useCallback for callback optimization
- Minimize re-renders with proper deps arrays

### Backend
- Use database indexes on frequently queried columns
- Implement caching with Redis
- Batch database queries
- Use connection pooling
- Implement API rate limiting

## Security Guidelines

### Frontend
```javascript
// ✅ Sanitize user input
const sanitized = DOMPurify.sanitize(userInput)

// ✅ Store sensitive data in sessionStorage, not localStorage
sessionStorage.setItem('token', token)

// ❌ Never store passwords
// ❌ Never expose API keys in frontend code
```

### Backend
```javascript
// ✅ Hash passwords
const hashedPassword = bcrypt.hashSync(password, 10)

// ✅ Validate all inputs
const { error, value } = schema.validate(req.body)

// ✅ Use environment variables for secrets
const secret = process.env.JWT_SECRET

// ❌ Never log sensitive data
// ❌ Never commit .env files
```

## API Design

### RESTful Endpoints
```
GET    /api/tasks              - List all tasks
GET    /api/tasks/:id          - Get single task
POST   /api/tasks              - Create task
PUT    /api/tasks/:id          - Update task
DELETE /api/tasks/:id          - Delete task

GET    /api/tasks/statistics   - Get stats (before /:id!)
```

### Response Format
```javascript
// ✅ Success response
{
  success: true,
  data: { /* data */ },
  message: "Operation successful"
}

// ✅ Error response
{
  success: false,
  error: "ERROR_CODE",
  message: "Descriptive error message"
}
```

## Environment Setup

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Thunder Client (API testing)
- GitLens
- Error Lens

### Prettier Configuration
Create `.prettierrc`:
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### ESLint Configuration
Create `.eslintrc.json`:
```json
{
  "env": { "browser": true, "node": true, "es2021": true },
  "extends": ["next/core-web-vitals"]
}
```

## Debugging Tips

### Frontend
```javascript
// Use React DevTools extension
// Use Chrome DevTools console
console.log('Debug:', variable)

// Use debugger statement
debugger

// Break on errors: Right-click console > Settings
```

### Backend
```javascript
// Use node inspector
node --inspect src/server.js

// Use VS Code debugger
// Add breakpoints and use debug console
```

## Useful Commands

### Frontend
```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run format    # Format with Prettier
npm test          # Run tests
```

### Backend
```bash
npm run dev       # Start dev server with nodemon
npm start         # Start production server
npm test          # Run tests
npm run lint      # Run ESLint
npm run migrate   # Run database migrations
```

## Documentation

### JSDoc Comments
```javascript
/**
 * Calculates task completion percentage
 * @param {number} completed - Number of completed tasks
 * @param {number} total - Total number of tasks
 * @returns {number} Completion percentage (0-100)
 * @example
 * getCompletionPercentage(5, 10) // Returns 50
 */
export const getCompletionPercentage = (completed, total) => {
  return Math.round((completed / total) * 100)
}
```

## Common Issues & Solutions

### Module Import Issues
```javascript
// ✅ Use path aliases
import { useAuth } from '@/hooks/useAuth'  // configured in vite.config.js

// ❌ Avoid relative paths
import { useAuth } from '../../../hooks/useAuth'
```

### State Management
```javascript
// ✅ Use Context API for global state
const { user } = useAuth()

// ✅ Use useState for local component state
const [isOpen, setIsOpen] = useState(false)

// ❌ Avoid prop drilling (pass through many components)
```

### API Error Handling
```javascript
try {
  const response = await authService.login(email, password)
} catch (error) {
  const message = error.message || 'An error occurred'
  showMessage(message, 'error')
}
```

## Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express.js Guide](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [REST API Best Practices](https://restfulapi.net/)

## Questions?

- Create an issue on GitHub
- Check documentation in `/docs` folder
- Review existing code for examples
- Ask in team chat/discussions

---

Happy coding! Remember: Clean code is the best code. 🎯

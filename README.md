# Expense Tracker App (Express.js)

A comprehensive expense tracking application built with Node.js, Express.js, and MongoDB. This application provides user authentication, expense type management, logging capabilities, and automated password updates through cron jobs.

## ��� Fatures

- **User Authentication**
  - Email/Password authentication
  - Google OAuth 2.0 integration
  - JWT-based session management
  - Role-based access control

- **Expense Management**
  - Create and manage expense types
  - Track expenses with descriptions
  - User-specific expense categorization

- **Logging System**
  - Application logs
  - Custom logs
  - Error logs
  - Log filtering and pagination

- **Automated Features**
  - Password update cron jobs
  - Email notifications
  - Log cleanup functionality

- **Security**
  - Password hashing with bcrypt
  - Session management
  - CORS protection
  - Input validation

## ���️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js, JWT
- **Email**: Nodemailer
- **Logging**: Winston
- **Cron Jobs**: node-cron
- **Language**: TypeScript
- **Package Manager**: pnpm

## ��� Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.10.0)
- MongoDB
- Google OAuth credentials (for Google authentication)

## ��� Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SakthiVelRajan-dev/expense-tracker-node.git
   cd expense-tracker-node
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   SESSION_SECRET=your-session-secret
   FRONT_END_URL=http://localhost:3000
   JWT_SECRET=your-jwt-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start the application**
   ```bash
   # Development mode
   pnpm dev
   
   # Watch mode
   pnpm watch
   
   # Production build
   pnpm build
   pnpm start
   ```

## ��� API Endpoints

### Authentication

#### Email/Password Authentication
- `POST /auth/email/sign-up` - User registration
- `POST /auth/email/login` - User login
- `POST /auth/logout` - User logout

#### Google OAuth
- `GET /auth/google/login` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback

### Expense Types
- `GET /expense-types` - Get all expense types (with pagination)
- `POST /expense-types/add` - Add new expense type

### Logging
- `GET /log/app` - Get application logs
- `GET /log/custom` - Get custom logs
- `GET /log/error` - Get error logs

### Utility Endpoints
- `GET /` - Dashboard (protected)
- `GET /clear-logs` - Clear all logs
- `GET /cron/*` - Cron job endpoints

### Query Parameters for Logs
- `type` - Log type filter
- `from` - Start date (milliseconds)
- `to` - End date (milliseconds)
- `limit` - Number of records to return
- `order` - Sort order (asc/desc)
- `start` - Offset for pagination

## ���️ Database Schema

### User Schema
```typescript
{
  email: string
  password: string
  name?: string
  role: string
  type: 'email-password' | 'oAuth'
}
```

### Expense Type Schema
```typescript
{
  name: string
  description?: string
  created_by: string
  role: string
}
```

## ��� Authentication Flow

1. **Email/Password**: Users register with email/password, passwords are hashed with bcrypt
2. **Google OAuth**: Users authenticate via Google, account is created automatically
3. **JWT Tokens**: Successful authentication generates JWT tokens for session management
4. **Role-based Access**: Different user roles have different permissions

## ��� Logging

The application uses Winston for structured logging with different log types:
- **Application logs**: General application events
- **Custom logs**: User-defined log entries
- **Error logs**: Application errors and exceptions

Logs are stored in the `src/logs` directory and can be queried via API endpoints.

## ⏰ Cron Jobs

The application includes automated cron jobs for:
- Password updates for specific user roles
- Log maintenance and cleanup

## ��� Testing

```bash
# Run tests
pnpm test

# Type checking
pnpm check
```

## ��� Scripts

- `pnpm dev` - Start development server
- `pnpm watch` - Start with file watching
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm check` - TypeScript type checking

## ��� Development

The project uses:
- **ESLint** for code linting
- **Husky** for git hooks
- **lint-staged** for pre-commit linting
- **TypeScript** for type safety

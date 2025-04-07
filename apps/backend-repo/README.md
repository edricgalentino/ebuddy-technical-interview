# Backend Repository

Express.js backend with Firebase integration for user management.

## Directory Structure

```
backend-repo/
├── config/             # Configuration files
│   └── firebaseConfig.ts
├── controller/         # API controllers
│   └── api.ts
├── core/               # Core application files
│   └── app.ts
├── entities/           # Data models/interfaces
│   └── user.ts
├── middleware/         # Express middlewares
│   └── authMiddleware.ts
├── repository/         # Data access layer
│   └── userCollection.ts
├── routes/             # API routes
│   └── userRoutes.ts
└── package.json
```

## Getting Started

1. Install dependencies:

   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your Firebase credentials:

   ```
   cp .env.example .env
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. Build for production:

   ```
   npm run build
   ```

5. Run in production:
   ```
   npm start
   ```

## API Endpoints

### Fetch User Data

- `GET /api/users`: Get all users
- `GET /api/users/:id`: Get a specific user by ID

### Update User Data

- `PUT /api/users/:id`: Update a specific user by ID

## Authentication

All API endpoints are protected by the `authMiddleware` which validates the Bearer token in the Authorization header.

For testing purposes, you can use any non-empty token:

```
Authorization: Bearer your-token-here
```

## User Object Interface

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
```

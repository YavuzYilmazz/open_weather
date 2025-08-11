# Weather API

An Express/TypeScript API integrating OpenWeather, PostgreSQL (Prisma), Redis caching, JWT auth, Joi validation, Swagger docs, Winston logging, Sentry error tracking, rate limiting, Prometheus metrics, and CI/CD readiness.

## Prerequisites

- Node.js (>=14)
- pnpm (https://pnpm.io) for package management
- PostgreSQL database
- Redis server
- OpenWeather API key

## Project Structure

```bash
├── .env
├── .gitignore
├── pnpm-lock.yaml
├── README.md
├── package.json
├── tsconfig.json
├── jest.config.js
├── app.ts
├── server.ts
├── config/
│   └── config.ts
├── loaders/
│   ├── db.loader.ts
│   └── redis.loader.ts
├── middleware/
│   ├── asyncHandler.middleware.ts
│   ├── validation.middleware.ts
│   ├── error.middleware.ts
│   └── auth.middleware.ts
├── validators/
│   ├── weather.validator.ts
│   ├── auth.validator.ts
│   └── admin.validator.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── admin.controller.ts
│   └── weather.controller.ts
├── routes/
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   ├── weather.routes.ts
│   └── admin.routes.ts
├── services/
│   ├── auth.service.ts
│   ├── weather.service.ts
│   ├── user.service.ts
│   └── admin.service.ts
├── models/
│   ├── user.model.ts
│   └── weather-query.model.ts
├── utils/
│   ├── logger.ts
│   └── ApiError.ts
├── __tests__/
│   ├── app.test.ts
│   ├── auth.test.ts
│   ├── authFlow.test.ts
│   ├── userFlow.test.ts
│   ├── admin.test.ts
│   ├── adminFlow.test.ts
│   └── weather.test.ts
├── prisma/
│   ├── migrations/
│   └── schema.prisma
└── images/
    ├── api_logs.png
    ├── tests.png
    ├── redis.png
    └── Swagger.png
```

## API Documentation

Swagger UI is available at:

```bash
http://localhost:3000/docs
```

![Swagger UI](./images/Swagger.png)

## Features

- JWT Authentication (login, refresh, logout)
- Rate limiting with `express-rate-limit` ![Rate Limit](./images/api_logs.png)
- Input validation with Joi
- Redis caching with dynamic TTL and in-memory stub for tests ![Redis Cache](./images/redis.png)
- Prometheus metrics exposed at `/metrics`
- Centralized logging with Winston ![API Logs](./images/api_logs.png)
- Error monitoring with Sentry
- OpenAPI/Swagger documentation via `swagger-ui-express`

## Testing

Run the test suite:

```bash
pnpm test
```

![Test Coverage](./images/tests.png)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/YavuzYilmazz/open_weather.git
   cd open_weather
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Copy and configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your settings:
   # DATABASE_URL, REDIS_URL, OPENWEATHER_API_KEY, JWT_SECRET, CACHE_TTL_SECONDS
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

## Running

- Start server:
  ```bash
  pnpm exec ts-node server.ts
  ```
- Start in development mode with hot reload:
  ```bash
  pnpm exec tsx watch server.ts
  ```

Server listens on port defined in `.env` (default: 3000).

## Endpoints

### Authentication

- **POST /auth/login**
  - Description: Authenticate user with email & password and receive access & refresh tokens.
  - Request Body: `{ email: string, password: string }`
  - Response: `{ token: string, refreshToken: string }`

- **POST /auth/refresh**
  - Description: Exchange a valid refresh token for a new access token.
  - Request Body: `{ refreshToken: string }`
  - Response: `{ token: string }`

- **POST /auth/logout**
  - Description: Revoke a refresh token to log out the user.
  - Request Body: `{ refreshToken: string }`

### Weather Queries

- **GET /weather?city={city}&units={units}**
  - Description: Retrieve current weather for a specified city (default units: metric).

- **GET /weather?lat={latitude}&lon={longitude}&units={units}**
  - Description: Retrieve current weather by geographic coordinates.

- **GET /weather/queries**
  - Description: List past weather queries made by the authenticated user.

### User Profile

- **GET /me/queries**
  - Description: Fetch the authenticated user’s weather query history.

### Admin Routes (ADMIN role required)

- **POST /admin/users**
  - Description: Create a new user with specified email, password, and role.

- **GET /admin/users**
  - Description: Retrieve a list of all users in the system.

- **PATCH /admin/users/:id**
  - Description: Update a user’s role by user ID.
  - Request Body: `{ role: "ADMIN" | "USER" }`

- **DELETE /admin/users/:id**
  - Description: Delete a user by user ID.

- **GET /admin/queries**
  - Description: List all weather queries across all users.

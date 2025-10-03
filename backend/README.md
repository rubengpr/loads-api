# Loads Backend

Express.js API backend with TypeScript, Prisma ORM, and PostgreSQL.

## Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- PostgreSQL database

### Installation

From the root directory:

```bash
npm run install:all
```

Or install backend dependencies only:

```bash
cd backend
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```bash
API_KEY="your-api-key-here"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/loads_db"
```

### Development

Start the development server:

```bash
npm run dev
```

Or from the root directory:

```bash
npm run dev:all
```

The API will be available at `http://localhost:3000`

### Database

Generate Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

Seed the database:

```bash
npm run seed
```

### Building

Build for production:

```bash
npm run build
```

### Linting

Run ESLint:

```bash
npm run lint
```

## API Endpoints

- `GET /` - Health check
- `GET /api/loads` - Get all loads
- `POST /api/loads` - Create a new load
- `GET /api/inbound-calls` - Get all inbound calls
- `POST /api/inbound-calls` - Create a new inbound call

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── constants/      # Constants and data
│   └── index.ts        # Application entry point
├── prisma/             # Database schema and migrations
├── dist/               # Compiled JavaScript
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

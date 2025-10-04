# Loads Monorepo

A full-stack application with Express.js backend and React frontend.

## Project Structure

This is a monorepo containing:

- **Backend** (`/backend`): Express.js API with TypeScript, Prisma ORM, and PostgreSQL
- **Frontend** (`/frontend`): React app with TypeScript, Tailwind CSS, and Vite

## Quick Start

### Option 1: Docker (Recommended)

Follow these 3 simple steps to run the application locally:

1. **Git clone**

   ```bash
   git clone https://github.com/rubengpr/loads-api.git
   cd loads-api
   ```

2. **Add environment file**
   Create a `.env` file in the root directory:

   ```bash
   echo 'API_KEY="apikey123"' > .env
   ```

3. **Start the application**

   ```bash
   docker-compose up --build
   ```

   - Backend API: `http://localhost:3000`
   - Frontend: `http://localhost:5173`
   - Database: `localhost:5432`

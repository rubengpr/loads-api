## Quick Start with Docker

**Prerequisites:** Docker and Docker Compose installed on your machine.

Follow these 3 simple steps to run the full application locally:

### 1. Clone the Repository

```bash
git clone https://github.com/rubengpr/loads-api.git
cd loads-api
```

### 2. Set Up Environment Variables

Copy the example environment file and set your API key:

```bash
cp .env.example .env
```

Then edit `.env` and replace `your-api-key-here` with any value (e.g., `apikey123`):

```bash
API_KEY=apikey123
```

### 3. Start the Application

Run Docker Compose to build and start all services (database, backend, and frontend):

```bash
docker-compose up --build
```

This will:

- Start a PostgreSQL database
- Run database migrations
- Seed the database with sample data
- Start the backend API server
- Start the frontend application

**The application will be ready when you see:**

- ✅ Backend API: `http://localhost:3000`
- ✅ Frontend: `http://localhost:5173`
- ✅ Database: `localhost:5432` (PostgreSQL)

### 4. Test the Application

- Open your browser and navigate to `http://localhost:5173` to see the frontend dashboard
- The backend API is accessible at `http://localhost:3000`
- Health check endpoint: `http://localhost:3000/health`

### API Authentication

All API endpoints under `/api/*` require authentication. Include the API key in your requests:

```bash
curl -H "X-API-Key: apikey123" http://localhost:3000/api/loads
```

### Stopping the Application

Press `Ctrl+C` in the terminal where docker-compose is running, then:

```bash
docker-compose down
```

To also remove the database volume:

```bash
docker-compose down -v
```

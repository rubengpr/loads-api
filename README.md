## Quick Start with Docker

**Prerequisites:** Docker and Docker Compose installed on your machine.

### 1. Clone the Repository

```bash
git clone https://github.com/rubengpr/loads-api.git
cd loads-api
```

### 2. Set Up Environment Variables

Add test API key shared in email:

```bash
echo "API_KEY=your_api_key" > .env
```

### 3. Start the Application

Run Docker Compose to build and start all services (frontend, backend and database):

```bash
docker-compose up --build -d
```

### 4. Test the Application

- Frontend dashboard: `http://localhost:5173`
- API backend: `http://localhost:3000`
- Health check endpoint: `http://localhost:3000/health`

### API Authentication

All API endpoints under `/api/*` require authentication. Include the API key in your requests:

```bash
curl -H "X-API-Key: apikey123" http://localhost:3000/api/loads
```

### Production API

- API: `https://loads-api-production.up.railway.app`

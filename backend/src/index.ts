import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import loadRoutes from './routes/loadRoutes.js';
import inboundCallRoutes from './routes/inboundCallRoutes.js';
import { apiKeyAuth } from './middleware/auth.js';

// Validate required environment variables
if (!process.env.API_KEY) {
  console.error('❌ API_KEY environment variable is required');
  process.exit(1);
}

console.log('✅ Environment variables validated');

const app = express();

// Configure CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-API-Key'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Configure rate limiting with generous limits
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Generous: 1000 requests per 15 minutes per IP
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    message: 'Too many requests from this IP, please try again later.',
    error: 'RATE_LIMIT_EXCEEDED',
  },
  // Skip rate limiting for health check
  skip: (req) => req.path === '/health',
});

// Apply rate limiter to all routes
app.use(limiter);

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'loads-api',
  });
});

app.use('/api', apiKeyAuth);

app.use('/api/loads', loadRoutes);
app.use('/api/inbound-calls', inboundCallRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Loads API is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

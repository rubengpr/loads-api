import express from 'express';
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

app.use(express.json());

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

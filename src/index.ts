import express from 'express';
import loadRoutes from './routes/loadRoutes.js';
import inboundCallRoutes from './routes/inboundCallRoutes.js';

const app = express();

app.use(express.json());

app.use('/api/loads', loadRoutes);
app.use('/api/inbound-calls', inboundCallRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Loads API is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

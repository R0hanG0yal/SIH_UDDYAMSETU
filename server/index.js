import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Mount API routes
app.use('/api', apiRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SAARTHI Server Error]', err);
  res.status(500).json({
    status: 'SERVER_ERROR',
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🛡️  SAARTHI National Government Credit Gateway API`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`📜 Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`===================================================`);
});

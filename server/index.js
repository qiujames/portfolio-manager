require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cronJob = require('./cron/cron');

const PORT = process.env.PORT || 5000;

const app = express();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 60, // max 10 requests in those 10 minutes
});
app.use(limiter);
app.set('trust proxy', 1);

// Enable Cors
app.use(cors());

// Routes
app.use('/getStockPrice', require('./routes/getStockPrice'));

// Start Cron Job
console.log('Starting cron!');
cronJob.start();

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

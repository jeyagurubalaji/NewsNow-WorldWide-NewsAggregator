const express = require('express');
const cors = require('cors');
const { corsOptions } = require('./config/corsConfig');
const { connectDb } = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const translateRoutes = require('./routes/translateRoutes');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.get('/actuator/health', (req, res) => res.json({ status: 'UP' }));

// Ensure MongoDB is connected on serverless cold starts before handling API requests
app.use('/api', async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/translate', translateRoutes);

app.use(errorHandler);

module.exports = app;
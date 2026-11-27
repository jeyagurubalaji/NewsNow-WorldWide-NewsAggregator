const app = require('./app');
const env = require('./config/env');
const { connectDb } = require('./config/db');
const Article = require('./models/Article');
const FetchLog = require('./models/FetchLog');
const User = require('./models/User');
const { startScheduler } = require('./scheduler/newsRefreshScheduler');

async function main() {
  await connectDb();

  console.log('[server] Clearing old news articles and fetch logs...');
  await Article.deleteMany({});
  await FetchLog.deleteMany({});

  try {
    await User.updateMany(
      { resetPasswordExpires: { $lt: Date.now() } },
      { $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 } }
    );
    console.log('[server] Cleaned up expired password reset tokens.');
  } catch (err) {
    console.warn('[server] Warning during expired token cleanup:', err.message);
  }

  startScheduler();

  app.listen(env.port, () => {
    console.log(`[server] NewsNow backend listening on http://localhost:${env.port}`);
  });
}

if (require.main === module) {
  main().catch((err) => {
    console.error('[server] Fatal startup error:', err);
    process.exit(1);
  });
}

module.exports = app;
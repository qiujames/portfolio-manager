const cron = require('node-cron');

const { fetchStaleStocksFromDb, fetchAndUpdateStockData } = require('./helpers');

// Normally, we would do this if we had a permanent
// web service always running, but since render spins down
// instances after 15 min, this cron won't run
// so instead, we should run a frequent cron that runs
// whenever the service does spin up, once it does
// spin up, we should check the db and only run whenever
// the last fetched date stamp is past some time

// trigger 9am and 12pm, Monday through Friday
// const cronSchedule = '0 9,12 * * 1-5';

// run every 1 minutes instead but do it on a stale basis
const CRON_SCHEDULE = '*/1 * * * *';

const cronJob = cron.schedule(
  CRON_SCHEDULE,
  async () => {
    // Query for all stocks that are 6 hours stale
    try {
      const tickers = await fetchStaleStocksFromDb();
      console.log('Stale stocks:', tickers);

      const updates = await fetchAndUpdateStockData(tickers);
      console.log(`Finished cron with the following successful updates: ${updates.length}`);
    } catch (error) {
      console.log('failed to get stock data', error);
    }
  },
  {
    name: 'qiufolio-cron',
    scheduled: false,
    timezone: 'America/Los_Angeles',
  },
);

module.exports = cronJob;

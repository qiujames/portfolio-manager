const itemsPool = require('../db/dbConfig');
const fetchTickerDataFromApi = require('./api');

const STALE_TIME_THRESHOLD_MS = 6 * 60 * 60 * 1000;

async function fetchStaleStocksFromDb() {
  const currentTime = new Date();
  const sixHoursAgo = new Date(currentTime.getTime() - STALE_TIME_THRESHOLD_MS);

  // Fetch and query for the top 5 most stale stocks, due to API limits, we can't
  // query the API too much, but we can guarantee that eventually we'll get everything
  // not ideal, but it's ok.
  try {
    const queryResult = await itemsPool.query(`
        SELECT ticker 
        FROM stocks 
        WHERE last_price_update < $1 
        ORDER BY last_price_update ASC 
        LIMIT 5
    `, [sixHoursAgo]);

    return queryResult.rows.map((row) => row.ticker);
  } catch (error) {
    console.log('Failed to fetch stale stocks from the database:', error);
    return [];
  }
}

async function updateDbWithNewStockData({ ticker, close }) {
  const currentTime = new Date();
  console.log(`Updating DB with ${ticker} ${close} ${currentTime}`);
  return itemsPool.query(
    'UPDATE stocks SET last_price = $1, last_price_update = $2 WHERE ticker = $3',
    [close, currentTime, ticker],
  );
}

async function fetchAndUpdateStockData(tickers) {
  const fetchPromises = tickers.map((ticker) => fetchTickerDataFromApi(ticker));
  const apiResults = await Promise.all(fetchPromises);

  const successfulResults = apiResults.filter((result) => result !== null && !('error' in result));

  const updatePromises = successfulResults.map((res) => updateDbWithNewStockData(res));
  return Promise.all(updatePromises);
}

module.exports = { fetchStaleStocksFromDb, fetchAndUpdateStockData };

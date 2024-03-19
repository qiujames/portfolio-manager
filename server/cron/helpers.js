const itemsPool = require('../db/dbConfig');
const fetchTickerDataFromApi = require('./api');

// (hour * min * sec * milliseconds)
const STALE_TIME_THRESHOLD_DIFF_MS = 1 * 60 * 60 * 1000;

async function fetchStaleStocksFromDb() {
  const currentTime = new Date();
  const staleTimeThreshold = new Date(currentTime.getTime() - STALE_TIME_THRESHOLD_DIFF_MS);

  // Fetch and query for the top 5 most stale stocks, due to API limits, we can't
  // query the API too much, but we can guarantee that eventually we'll get everything
  // not ideal, but it's ok.
  try {
    const queryResult = await itemsPool.query(`
        SELECT ticker 
        FROM stocks 
        WHERE last_data_update_timestamp < $1 
        ORDER BY last_data_update_timestamp ASC NULLS FIRST
        LIMIT 5
    `, [staleTimeThreshold]);

    return queryResult.rows.map((row) => row.ticker);
  } catch (error) {
    console.log('Failed to fetch stale stocks from the database:', error);
    return [];
  }
}

async function updateDbWithNewStockData({ ticker, close, date }) {
  const currentTime = new Date();
  console.log(`Updating DB with ticker: ${ticker} close: ${close}  date: ${date}, at current time: ${currentTime}`);
  return itemsPool.query(
    'UPDATE stocks SET last_price = $1, last_price_timestamp = $2, last_data_update_timestamp = $3 WHERE ticker = $4',
    [close, date, currentTime, ticker],
  );
}

async function fetchAndUpdateStockData(tickers) {
  const fetchPromises = tickers.map((ticker) => fetchTickerDataFromApi(ticker));
  const apiResults = await Promise.all(fetchPromises);

  const successfulResults = apiResults.filter(
    (result) => result !== null
    && Object.keys(result).length !== 0
    && !('error' in result),
  );

  const updatePromises = successfulResults.map((res) => updateDbWithNewStockData(res));
  return Promise.all(updatePromises);
}

module.exports = { fetchStaleStocksFromDb, fetchAndUpdateStockData };

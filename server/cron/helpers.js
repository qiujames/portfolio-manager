const needle = require('needle');
const itemsPool = require('../db/dbConfig');

const STALE_TIME_THRESHOLD_MS = 6 * 60 * 60 * 1000;

// Env vars
const { API_BASE_URL, API_KEY_NAME, API_KEY_VALUE } = process.env;

const METADATA_KEY = 'Meta Data';
const LATEST_REFRESH_KEY = '3. Last Refreshed';
const TIME_SERIES_KEY = 'Time Series (5min)';
const CLOSE_VALUE_KEY = '4. close';

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

// takes in ticker, and response.data of the external api, and returns
// an object containing { ticker, close, date }
function formatExternalApiResponse(ticker, data) {
  const lastRefreshed = data[METADATA_KEY][LATEST_REFRESH_KEY];
  const timeSeries = data[TIME_SERIES_KEY];
  const latestData = timeSeries[lastRefreshed];
  const lastValue = latestData[CLOSE_VALUE_KEY];
  const parsedValueToDecimalPoints = parseFloat(parseFloat(lastValue).toFixed(2));

  // Parse the value to a float and specify two decimal places
  return { ticker, close: parsedValueToDecimalPoints, date: lastRefreshed };
}

// Function to fetch data for a single ticker
async function fetchTickerDataFromApi(ticker) {
  try {
    const apiParams = new URLSearchParams({
      interval: '5min',
      function: 'TIME_SERIES_INTRADAY',
      extended_hours: 'false',
      symbol: ticker,
      [API_KEY_NAME]: API_KEY_VALUE,
    });

    console.log(`Making API Request for ${ticker}`);
    const response = await needle('get', `${API_BASE_URL}?${apiParams}`);

    // Return {ticker, close, date}
    return formatExternalApiResponse(ticker, response.body);
  } catch (error) {
    // Handle errors, such as if the external API returns an error
    console.error(`Failed to fetch data for ${ticker}: ${error.message}`);
    return null;
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

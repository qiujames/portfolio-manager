const express = require('express');
const url = require('url');
const needle = require('needle');
const apicache = require('apicache');

const router = express.Router();

// Env vars
const { API_BASE_URL } = process.env;
const { API_KEY_NAME } = process.env;
const { API_KEY_VALUE } = process.env;

const cache = apicache.middleware;

const METADATA_KEY = 'Meta Data';
const LATEST_REFRESH_KEY = '3. Last Refreshed';
const TIME_SERIES_KEY = 'Time Series (5min)';
const CLOSE_VALUE_KEY = '4. close';

// takes in response.data of the external api, and returns
// an object containing {ticker: {ticker, close, date}}
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
async function fetchTickerData(ticker) {
  try {
    const apiParams = new URLSearchParams({
      interval: '5min',
      function: 'TIME_SERIES_INTRADAY',
      extended_hours: 'false',
      symbol: ticker,
      [API_KEY_NAME]: API_KEY_VALUE,
    });

    const response = await needle('get', `${API_BASE_URL}?${apiParams}`);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${API_BASE_URL}?${apiParams}`);
      console.log(response.body);
    }

    // Return {ticker -> {ticker, close, date}}
    return formatExternalApiResponse(ticker, response.body);
  } catch (error) {
    // Handle errors, such as if the external API returns an error
    console.error(`Failed to fetch data for ${ticker}: ${error.message}`);
    return null;
  }
}

// API takes in as inputs a required query parameter of tickers
//  ticker: case sensitive stock ticker string to get price for
// returns a json object of { ticker, close, date }
router.get('/', cache('6 hour'), async (req, res) => {
  try {
    // parse out the ticker parameter from the request
    const reqParams = url.parse(req.url, true).query;
    const { ticker } = reqParams;

    // fetch data for the single ticker
    const tickerData = await fetchTickerData(ticker);

    if (!tickerData) {
      return res.status(404).json({ error: 'Ticker not found or data not available' });
    }

    return res.status(200).json(tickerData);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;

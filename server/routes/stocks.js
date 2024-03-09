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

// takes in response.data of the external api, and returns
// an object containing {ticker: {ticker, close, date}}
function formatExternalApiResponse(ticker, data) {
  return { [ticker]: { ticker, close: data.close, date: data.timestamp } };
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
      console.log('RETURNED', response.data);
    }

    // Return {ticker -> {ticker, close, date}}
    return formatExternalApiResponse(ticker, response.data);
  } catch (error) {
    // Handle errors, such as if the external API returns an error
    console.error(`Failed to fetch data for ${ticker}: ${error.message}`);
    return null;
  }
}

// API takes in as inputs a required query parameter of tickers
//  tickers: list of case sensitive stock tickers to look up
//    duplicates are allowed, but results will be collapsed for each of them
//  returns a json map containing each ticker as the key which maps to a
//    closing cost, and a corresponding date at which the cost was taken at
router.get('/', cache('1 day'), async (req, res) => {
  try {
    // parse out the tickers parameter from the request
    const reqParams = url.parse(req.url, true).query;
    const tickersArray = reqParams.tickers.split(',');

    // construct a promise for each ticker
    const tickerPromises = tickersArray.map((ticker) => fetchTickerData(ticker));

    // wait for each promise to resolve
    const tickerDataResults = await Promise.all(tickerPromises);

    // filter out any failed ticker results
    const successResults = tickerDataResults.filter((result) => result !== null);

    // given [{ticker: {ticker, close, date}} ... ], I want to get out a flattened
    // map of { ticker -> {ticker, close, date}, ....}, and we can use the spread operator
    const formattedData = successResults.reduce((acc, result) => ({ ...acc, ...result }), {});

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;

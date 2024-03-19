const needle = require('needle');

// Env vars
const { API_BASE_URL, API_KEY_NAME, API_KEY_VALUE } = process.env;

const METADATA_KEY = 'Meta Data';
const LATEST_REFRESH_KEY = '3. Last Refreshed';
const TIME_SERIES_KEY = 'Time Series (5min)';
const CLOSE_VALUE_KEY = '4. close';

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

module.exports = fetchTickerDataFromApi;

const needle = require('needle');

// Env vars
const { API_BASE_URL, API_KEY_NAME, API_KEY_VALUE } = process.env;

// takes in ticker, and response.data of the external api, and returns
// an object containing { ticker, close, date }
function formatExternalApiResponse(ticker, data) {
  const close = data.c;
  const dateUnixTimestamp = data.t;
  const date = new Date(dateUnixTimestamp * 1000);
  return { ticker, close, date };
}

// Function to fetch data for a single ticker
async function fetchTickerDataFromApi(ticker) {
  try {
    const apiParams = new URLSearchParams({
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

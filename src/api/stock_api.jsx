import config from '../config';

const API_KEY = config.apiKey;
const METADATA_KEY = 'Meta Data';
const LATEST_REFRESH_KEY = '3. Last Refreshed';
const TIME_SERIES_KEY = 'Time Series (5min)';
const CLOSE_VALUE_KEY = '4. close';

const fetchStockPrice = async (ticker) => {
  try {
    // Make API request to get stock prices
    let lastValue;
    if (ticker === 'VOO') {
      const stockApiEndpoint = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${API_KEY}`;
      const response = await fetch(stockApiEndpoint);
      const apiData = await response.json();
      const lastRefreshed = apiData[METADATA_KEY][LATEST_REFRESH_KEY];
      const timeSeries = apiData[TIME_SERIES_KEY];
      const latestData = timeSeries[lastRefreshed];
      lastValue = latestData[CLOSE_VALUE_KEY];
    }

    if (ticker === 'V') {
      lastValue = '280.43';
    } else if (ticker === 'MC') {
      lastValue = '471.6';
    } else if (ticker === 'GOOG') {
      lastValue = '132.56';
    } else if (ticker === 'EBAY') {
      lastValue = '50.54';
    } else if (ticker === 'MCO') {
      lastValue = '389.03';
    }
    console.log(ticker, lastValue);
    const parsedValueToDecimalPoints = parseFloat(parseFloat(lastValue).toFixed(2));

    // Parse the value to a float and specify two decimal places
    return parsedValueToDecimalPoints;
  } catch (error) {
    return 0;
  }
};

const fetchStockPrices = async (stocks) => {
  const responses = await Promise.all(
    stocks.map((stock) => fetchStockPrice(stock.ticker)),
  );

  const allData = await Promise.all(
    responses.map((value, index) => ({ [stocks[index].ticker]: value })),
  );
  // Process JSON data here and update state
  const stockPricesMap = allData.reduce((acc, obj) => ({ ...acc, ...obj }), {});
  return stockPricesMap;
};

export default fetchStockPrices;

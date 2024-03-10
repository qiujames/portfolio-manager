const FETCH_STOCK_API = 'https://qiufolio.onrender.com/getStockPrice';

// returns a json { ticker, close, date } from the api
const fetchStockPrice = async (ticker) => {
  try {
    const response = await fetch(`${FETCH_STOCK_API}?ticker=${ticker}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch data for ${ticker}: ${error.message}`);
    return null;
  }
};

// Args: Stocks is an array of stock objects where
// stocks has the interface of having a ticker: string field
// Returns a map containing {
//   ticker: map{close: int, date: Date }
// }
const fetchStockPrices = async (stocks) => {
  try {
    const tickerPromises = stocks.map((stock) => fetchStockPrice(stock.ticker));
    const tickerResults = await Promise.all(tickerPromises);

    // filter only for successes
    const successfulResults = tickerResults.filter(
      (result) => result !== null && !('error' in result),
    );

    const stockData = successfulResults.reduce((acc, { ticker, close, date }) => {
      acc[ticker] = { close, date };
      return acc;
    }, {});
    console.log('stockData', stockData);

    return stockData;
  } catch (error) {
    console.error(`Failed to fetch stock prices: ${error.message}`);
    return null;
  }
};

export default fetchStockPrices;

// const FETCH_STOCK_API = 'https://qiufolio.onrender.com/api';
const FETCH_STOCK_API = 'http://localhost:5000/getStockPrice';

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

    const stockData = tickerResults.reduce((acc, { ticker, close, date }) => {
      if (ticker && close && date) {
        acc[ticker] = { close, date };
      }
      return acc;
    }, {});

    return stockData;
  } catch (error) {
    console.error(`Failed to fetch stock prices: ${error.message}`);
    return null;
  }
};

export default fetchStockPrices;

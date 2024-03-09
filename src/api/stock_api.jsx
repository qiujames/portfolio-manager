const FETCH_STOCK_API = 'https://qiufolio.onrender.com/api';

// Args: Stocks is an array of stock objects where
// stocks has the interface of having a ticker: string field
// Returns a map containing {
//   ticker: map{close: int, date: Date }
// }
const fetchStockPrices = async (stocks) => {
  const tickers = stocks.map((stock) => stock.ticker);

  // pass all tickers into the fetch stock api served by our proxy
  // so we should see something like <url>/api?tickers=voo,v,mc...
  const response = await fetch(`${FETCH_STOCK_API}?tickers=${tickers.join(',')}`);

  // this is returned as { ticker: {ticker, close, date}}
  return response;
};

export default fetchStockPrices;

import React, { useState } from 'react';
import Stock from './Stock';
import Header from './Header';
import AddStockButton from './AddStockButton';

function StockList() {
  // TODO: read these from a db or have some user saved state
  const [stocks, setStocks] = useState([
    { ticker: 'VOO', quantity: 5, value: 500 },
    { ticker: 'V', quantity: 10, value: 23 },
    { ticker: 'MC', quantity: 0, value: 400 },
  ]);

  // TODO: Make this a global list, potentially from a file too
  const allStocks = [
    { ticker: 'AAPL', name: 'Apple Inc.' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.' },
    { ticker: 'MSFT', name: 'Microsoft Corporation' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.' },
    { ticker: 'TSLA', name: 'Tesla, Inc.' },
  ];

  const addableStocks = allStocks
    .filter((stock) => !stocks.some((item) => item.ticker === stock.ticker));

  const onAddStockHandler = (newStock) => {
    setStocks((prevStocks) => [...prevStocks, { ...newStock }]);
  };

  // TODO: Split the Add a stock into components
  return (
    <>
      <Header />
      <AddStockButton addableStocks={addableStocks} onAddStockHandler={onAddStockHandler} />
      <ul>
        {stocks.map((stock) => (
          <Stock
            key={stock.ticker}
            ticker={stock.ticker}
            quantity={stock.quantity}
            value={stock.value}
          />
        ))}
      </ul>
    </>
  );
}

export default StockList;

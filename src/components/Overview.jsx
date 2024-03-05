import React, { useState } from 'react';
import StockList from './StockList';
import Header from './Header';
import AddStockButton from './AddStockButton';
import PieChart from './PieChart';

function Overview() {
  // TODO: read these from a db or have some user saved state
  const [stocks, setStocks] = useState([
    { ticker: 'VOO', quantity: 5, value: 500 },
    { ticker: 'V', quantity: 10, value: 23 },
    { ticker: 'MC', quantity: 5, value: 400 },
    { ticker: 'GOOG', quantity: 5, value: 500 },
    { ticker: 'EBAY', quantity: 10, value: 23 },
    { ticker: 'MCO', quantity: 5, value: 400 },
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

  const totalValue = stocks.reduce((total, stock) => total + (stock.quantity * stock.value), 0);

  return (
    <>
      <Header />
      <AddStockButton addableStocks={addableStocks} onAddStockHandler={onAddStockHandler} />
      <StockList stocks={stocks} setStocks={setStocks} />
      <p>
        Total:
        {totalValue}
      </p>
      <PieChart stocks={stocks} />
    </>
  );
}

export default Overview;

import React, { useState } from 'react';
import Stock from './Stock';

function StockList() {
  // TODO: read these from a db or have some user saved state
  const [stocks, setStocks] = useState([
    { ticker: 'VOO', quantity: 5, value: 500 },
    { ticker: 'V', quantity: 10, value: 23 },
    { ticker: 'MC', quantity: 0, value: 400 },
  ]);

  // TODO: Make this a global list, potentially from a file too
  const addableStocks = [
    { ticker: 'AAPL', name: 'Apple Inc.' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.' },
    { ticker: 'MSFT', name: 'Microsoft Corporation' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.' },
    { ticker: 'TSLA', name: 'Tesla, Inc.' },
  ];

  const [selectedStock, setSelectedStock] = useState('');
  const [quantity, setQuantity] = useState(0);

  const onStockSelectHandler = (event) => {
    setSelectedStock(event.target.value);
  };

  const onStockQuantitySetHandler = (event) => {
    setQuantity(event.target.value);
  };

  const onAddStackHandler = () => {
    const quantityInt = parseInt(quantity, 10);
    if (selectedStock && quantity > 0) {
      setStocks((prevStocks) => [...prevStocks,
        { ticker: selectedStock, quantity: quantityInt, value: 10 },
      ]);
      setSelectedStock('');
      setQuantity(0);
    }
  };

  // TODO: Split the Add a stock into components
  return (
    <>
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
      <select value={selectedStock} onChange={onStockSelectHandler}>
        <option value="">Select a stock</option>
        {addableStocks
          .filter((stock) => !stocks.some((item) => item.ticker === stock.ticker))
          .map((stock) => (
            <option key={stock.ticker} value={stock.ticker}>{stock.name}</option>
          ))}
      </select>
      <input type="number" value={quantity} onChange={onStockQuantitySetHandler} />
      <button type="button" onClick={onAddStackHandler}>
        Add Stock
      </button>
    </>
  );
}

export default StockList;

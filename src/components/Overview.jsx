import React, { useState, useEffect } from 'react';
import StockList from './StockList';
import Header from './Header';
import AddStockButton from './AddStockButton';
import PieChart from './PieChart';
import fetchStockPrices from '../api/stock_api';

function Overview() {
  // TODO: read these from a db or have some user saved state
  const [stocks, setStocks] = useState([
    { ticker: 'VOO', quantity: 5, value: 500 },
    { ticker: 'V', quantity: 10, value: 23 },
    { ticker: 'MA', quantity: 5, value: 400 },
    { ticker: 'GOOGL', quantity: 5, value: 500 },
    { ticker: 'EBAY', quantity: 10, value: 23 },
    { ticker: 'MCO', quantity: 5, value: 400 },
  ]);

  useEffect(() => {
    // Function to fetch stock prices from API
    // Call fetchStockPrices function when component mounts
    const fetchData = async () => {
      try {
        // {ticker -> {ticker, close, date}}
        const latestStockData = await fetchStockPrices(stocks);

        // Update the stocks state with the latest prices
        const newStockState = stocks.map((stock) => {
          // keep the rest of the stock fields the same but update if we get a new value
          const newPrice = latestStockData[stock.ticker]?.close;
          const newQuantity = latestStockData[stock.ticker]?.quantity;
          return {
            ...stock,
            // Keep the old value if newPrice is undefined
            value: newPrice !== undefined ? newPrice : stock.value,
            quantity: newQuantity !== undefined ? newQuantity : stock.quantity,
          };
        });
        setStocks(newStockState);
      } catch (error) {
        console.error('Error fetching stock prices:', error);
      }
    };

    // Call fetchData function when component mounts
    // TODO?: Do this on a timeout function or a refresh button?
    fetchData();
  }, []); // Empty dependency array to run effect only once on component mountnt

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
        {totalValue.toFixed(2)}
      </p>
      <PieChart stocks={stocks} />
    </>
  );
}

export default Overview;

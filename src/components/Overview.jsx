import React, { useState, useEffect } from 'react';

import fetchStockPrices from '../api/stock_api';

import AddStockButton from './AddStockButton';
import PieChart from './charts/PieChart';
import Header from './Header';
import Spinner from './Spinner/Spinner';
import StockList from './StockList';

function Overview() {
  const [isLoading, setIsLoading] = useState(true); // set initial state to loading

  // TODO: this will eventually become empty, however, because we need this
  // to know what stocks to query for, we keep the default list in
  // however, we can only move off this until we get a concept of users / authentication
  // within the app
  const [stocks, setStocks] = useState([
    { ticker: 'VOO' },
    { ticker: 'V' },
    { ticker: 'MA' },
    { ticker: 'GOOGL' },
    { ticker: 'EBAY' },
    { ticker: 'MCO' },
  ]);

  useEffect(() => {
    // Function to fetch stock prices from API
    // Call fetchStockPrices function when component mounts
    const fetchData = async () => {
      try {
        // fetchStockPrices returns an array of
        // [{ ticker, quantity, value, date, idealStockPercentage }]
        const latestStockData = await fetchStockPrices(stocks);
        setStocks(latestStockData);
        setIsLoading(false); // set loading false once stock update is complete
      } catch (error) {
        console.error('Error fetching stock prices:', error);
      }
    };

    // Call fetchData function when component mounts
    // TODO?: Do this on a timeout function or a refresh button?
    fetchData();
  }, []); // Empty dependency array to run effect only once on component mountnt

  if (isLoading) {
    return <Spinner />;
  }

  // TODO: Make this a global list, potentially from a file too
  const allStocks = [
    { ticker: 'AAPL', name: 'Apple Inc.' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.' },
    { ticker: 'MSFT', name: 'Microsoft Corporation' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.' },
    { ticker: 'TSLA', name: 'Tesla, Inc.' },
  ];

  let addableStocks = null;
  if (stocks) {
    addableStocks = allStocks.filter(
      (stock) => !stocks.some((item) => item.ticker === stock.ticker),
    );
  } else {
    addableStocks = allStocks;
  }

  const onAddStockHandler = (newStock) => {
    setStocks((prevStocks) => [...prevStocks, { ...newStock }]);
  };

  const totalValue = stocks.reduce((total, stock) => total + (stock.quantity * stock.value), 0);

  return (
    <>
      <Header />
      <div className="container">
        <div className="column">
          <AddStockButton addableStocks={addableStocks} onAddStockHandler={onAddStockHandler} />
          <div className="scrollable-list">
            <StockList stocks={stocks} setStocks={setStocks} />
          </div>
          <p>
            Total:
            {totalValue.toFixed(2)}
          </p>
        </div>
        <div className="column">
          <PieChart stocks={stocks} />
        </div>
      </div>
    </>
  );
}

export default Overview;

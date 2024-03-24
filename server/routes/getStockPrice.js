const express = require('express');
const url = require('url');
const apicache = require('apicache');
const itemsPool = require('../db/dbConfig');

const router = express.Router();

const cache = apicache.middleware;

// Function to fetch data for a single ticker
async function fetchTickerDataFromDB(ticker) {
  // TODO: qiujames is set for now, eventually we will have users
  // TODO: eventually include the quantity
  try {
    const stockData = await itemsPool.query(`
      SELECT us.ticker AS ticker, us.quantity AS quantity, 
        s.last_price AS close, s.last_price_timestamp AS date,
        us.ideal_stock_percentage AS ideal_stock_percentage
      FROM user_stocks AS us
      JOIN stocks AS s ON us.ticker = s.ticker
      WHERE us.username = 'qiujames' AND us.ticker = $1;
    `, [ticker]);

    // return [] in case no results were found
    console.log(`Got for ticker ${ticker}`);
    console.log(stockData.rows.length > 0 ? stockData.rows[0] : []);
    return stockData.rows.length > 0 ? stockData.rows[0] : [];
  } catch (error) {
    // Handle errors, such as if the external API returns an error
    console.error(`Failed to fetch data for ${ticker}: ${error.message}`);
    return null;
  }
}

// API takes in as inputs a required query parameter of tickers
//  ticker: case sensitive stock ticker string to get price for
// returns a json object of { ticker, close, date }
router.get('/', cache('1 minutes'), async (req, res) => {
  try {
    // parse out the ticker parameter from the request
    const reqParams = url.parse(req.url, true).query;
    const { ticker } = reqParams;

    // fetch data for the single ticker
    const tickerData = await fetchTickerDataFromDB(ticker);

    if (!tickerData) {
      return res.status(404).json({ error: 'Ticker not found or data not available' });
    }

    return res.status(200).json(tickerData);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;

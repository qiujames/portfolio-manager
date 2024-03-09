const express = require('express');
const url = require('url');
const needle = require('needle');
const apicache = require('apicache');

const router = express.Router();

// Env vars
const { API_BASE_URL } = process.env;
const { API_KEY_NAME } = process.env;
const { API_KEY_VALUE } = process.env;

const cache = apicache.middleware;

router.get('/', cache('30 minute'), async (req, res) => {
  try {
    const reqParams = url.parse(req.url, true).query;
    const apiParams = new URLSearchParams({
      interval: '5min',
      function: 'TIME_SERIES_INTRADAY',
      extended_hours: 'false',
      [API_KEY_NAME]: API_KEY_VALUE,
      ...reqParams,
    });

    const apiRes = await needle('get', `${API_BASE_URL}?${apiParams}`);
    const data = apiRes.body;

    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${API_BASE_URL}?${apiParams}`);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;

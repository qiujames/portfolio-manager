import React from 'react';
import PropTypes from 'prop-types';

function Stock({
  ticker, quantity, value, onAddQuantityHandler,
}) {
  return (
    quantity > 0
      ? (
        <li>
          {ticker}
          :
          {quantity}
          *
          {value}
          =
          {quantity * value}
          <button type="button" onClick={() => onAddQuantityHandler(ticker)}>Increase Quantity</button>
        </li>
      ) : null);
}

Stock.propTypes = {
  ticker: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onAddQuantityHandler: PropTypes.func.isRequired,
};
export default Stock;

import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Stock({ ticker, quantity, value }) {
  const [quantityState, setQuantityState] = useState(quantity);

  function increaseQuantity() {
    setQuantityState((prevQuantity) => prevQuantity + 1);
  }

  return (
    quantityState > 0
      ? (
        <li>
          {ticker}
          :
          {quantityState}
          *
          {value}
          =
          {quantityState * value}
          <button type="button" onClick={increaseQuantity}>Increase Quantity</button>
        </li>
      ) : null);
}

Stock.propTypes = {
  ticker: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
export default Stock;

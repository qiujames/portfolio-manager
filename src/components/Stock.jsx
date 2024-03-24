import PropTypes from 'prop-types';
import React from 'react';

const ALLOCATE_PERCENTAGE_COLOR_THRESHOLD = 3;

function formatDateString(dateString) {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `Last Price: ${month}/${day} ${hours}:${minutes < 10 ? '0' : ''}${minutes} PST`;
}

function Stock({
  ticker, quantity, value, date, idealStockPercentage, total, onAddQuantityHandler,
}) {
  const stockTotalValue = (quantity * value).toFixed(2);
  const currentAllocationPercentage = ((stockTotalValue / total) * 100).toFixed(2);

  // Calculate the difference between current and desired allocation percentages
  // if allocationDiff is positive, then that means the current allocation is MORE
  // than the ideal stock allocation
  const allocationDiff = (currentAllocationPercentage - idealStockPercentage).toFixed(2);

  // Color the text if drift is non negligible
  const isAllocationDrifted = Math.abs(allocationDiff) > ALLOCATE_PERCENTAGE_COLOR_THRESHOLD;
  const allocationClassName = isAllocationDrifted ? 'red' : '';

  return (
    quantity > 0 && (
      <li>
        {ticker}
        :
        {quantity}
        {' '}
        *
        {value}
        {' '}
        =
        {stockTotalValue}
        ,
        {' '}
        {formatDateString(date)}
        , Desired Allocation=
        {idealStockPercentage}
        %
        , Current Allocation=
        <span className={allocationClassName}>
          {currentAllocationPercentage}
          %
        </span>
        {' '}
        {isAllocationDrifted && (
          <span className={allocationClassName}>
            (
            {allocationDiff > 0 ? `+${allocationDiff}` : allocationDiff}
            %
            )
          </span>
        )}
        <button type="button" onClick={() => onAddQuantityHandler(ticker)}>Increase Quantity</button>
      </li>
    )
  );
}

Stock.propTypes = {
  ticker: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  idealStockPercentage: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onAddQuantityHandler: PropTypes.func.isRequired,
};
export default Stock;

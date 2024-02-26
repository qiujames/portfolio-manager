import React, { useState } from 'react';
import { createPortal } from 'react-dom';

function AddStockModal({ addableStocks, onAddStockHandler, onClose }) {
  const [selectedStock, setSelectedStock] = useState('');
  const [quantity, setQuantity] = useState(0);

  const onStockSelectHandler = (event) => {
    setSelectedStock(event.target.value);
  };

  const onStockQuantitySetHandler = (event) => {
    setQuantity(event.target.value);
  };

  const onCreateStockHandler = () => {
    const quantityInt = parseInt(quantity, 10);
    if (selectedStock && quantityInt > 0) {
      onAddStockHandler({ ticker: selectedStock, quantity: quantityInt, value: 10 });
      setSelectedStock('');
      setQuantity(0);
      onClose();
    }
  };

  const onKeyDownHandler = (e) => {
    if (e.key === 'Enter') {
      onClose();
    }
  };

  return createPortal(
    <div className="modal">
      <div className="modal-content">
        <span role="button" className="close" onClick={onClose} onKeyDown={onKeyDownHandler} tabIndex={0}>&times;</span>
        <select value={selectedStock} onChange={onStockSelectHandler}>
          <option value="">Select a stock</option>
          {addableStocks.map((stock) => (
            <option key={stock.ticker} value={stock.ticker}>
              {stock.ticker}
              :
              {' '}
              {stock.name}
            </option>
          ))}
        </select>
        <input type="number" value={quantity} onChange={onStockQuantitySetHandler} />
        <button type="button" onClick={onCreateStockHandler}>
          Add Stock
        </button>
      </div>
    </div>,
    document.getElementById('modal'),
  );
}

export default AddStockModal;

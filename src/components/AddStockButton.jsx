import PropTypes from 'prop-types';
import React, { useState } from 'react';

import AddStockModal from '../portals/AddStockModal';

function AddStockButton({ addableStocks, onAddStockHandler }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button type="button" onClick={openModal}>Add Stock</button>
      {isModalOpen
        ? (
          <AddStockModal
            addableStocks={addableStocks}
            onAddStockHandler={onAddStockHandler}
            onClose={closeModal}
          />
        )
        : null}
    </>
  );
}

AddStockButton.propTypes = {
  addableStocks: PropTypes.arrayOf(
    PropTypes.shape({
      ticker: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onAddStockHandler: PropTypes.func.isRequired,
};

export default AddStockButton;

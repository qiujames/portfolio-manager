import {
  ArcElement, Chart as ChartJS, Colors, Legend, Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import PropTypes from 'prop-types';
import { React, useState } from 'react';

import IdealPercentageChart from './IdealPercentageChart';
import StockChart from './StockChart';

ChartJS.register(ArcElement);
ChartJS.register(Colors);
ChartJS.register(Tooltip);
ChartJS.register(Legend);
ChartJS.register(ChartDataLabels);

function PieChart({ stocks }) {
  const [showStockChart, setShowStockChart] = useState(true);

  const toggleChart = () => {
    setShowStockChart((prev) => !prev);
  };

  return (
    <div>
      <button type="button" onClick={toggleChart}>{showStockChart ? 'Show Ideal Percentages' : 'Show Current Breakdown'}</button>
      <div className="chartContainer">
        {showStockChart ? <StockChart stocks={stocks} /> : <IdealPercentageChart stocks={stocks} />}
      </div>
    </div>
  );
}

PieChart.propTypes = {
  stocks: PropTypes.arrayOf(
    PropTypes.shape({
      ticker: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      idealStockPercentage: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default PieChart;

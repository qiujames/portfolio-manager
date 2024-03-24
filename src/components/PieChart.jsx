import {
  ArcElement, Chart as ChartJS, Colors, Legend, Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import PropTypes from 'prop-types';
import React from 'react';
import { Pie } from 'react-chartjs-2';

import getStockValue from '../utils/TotalStockValueUtil';

ChartJS.register(ArcElement);
ChartJS.register(Colors);
ChartJS.register(Tooltip);
ChartJS.register(Legend);
ChartJS.register(ChartDataLabels);

const PERCENTAGE_LABEL_THRESHOLD = 8;

function PieChart({ stocks }) {
  const sortedStocks = stocks.slice().sort((a, b) => getStockValue(b) - getStockValue(a));
  // Extracting labels and data for the chart
  const sortedLabels = sortedStocks.map((stock) => stock.ticker);
  const sortedValues = sortedStocks.map((stock) => getStockValue(stock));

  const total = sortedValues.reduce((acc, val) => acc + val, 0);

  const data = {
    labels: sortedLabels,
    datasets: [
      {
        data: sortedValues,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label(context) {
            const labelIndex = context.dataIndex;
            const percentage = ((sortedValues[labelIndex] / total) * 100).toFixed(2);
            return `${sortedLabels[labelIndex]}: ${sortedValues[labelIndex]} (${percentage}%)`;
          },
        },
      },
      legend: {
        enabled: true,
        position: 'right',
        align: 'right',
      },
      colors: {
        enabled: true,
      },
      datalabels: {
        display(context) {
          const labelIndex = context.dataIndex;
          const percentage = ((sortedValues[labelIndex] / total) * 100).toFixed(2);
          return percentage > PERCENTAGE_LABEL_THRESHOLD;
        },
        formatter(_, context) {
          const labelIndex = context.dataIndex;
          return sortedLabels[labelIndex];
        },
        color: 'black',
      },
    },
  };

  return <Pie data={data} options={options} />;
}

PieChart.propTypes = {
  stocks: PropTypes.arrayOf(
    PropTypes.shape({
      ticker: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default PieChart;

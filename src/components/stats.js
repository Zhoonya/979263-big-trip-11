import AbstractSmartComponent from "./abstract-smart-component.js";
import {HIDDEN_CLASS, TRANSPORT} from "../const.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {render, RenderPosition} from "../utils/render.js";
import {formatDuration} from "../utils/common.js";

const BAR_HEIGHT = 55;

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const renderMoneyChart = (moneyCtx, points) => {

  const labels = points
    .map((point) => point.type.toUpperCase())
    .filter(getUniqItems);

  const data = labels.slice().map((label) => {
    const filteredPoints = points.slice().filter((point) => {
      return point.type === label.toLowerCase();
    });
    return filteredPoints.reduce((sum, current) => {
      return sum + Number(current.price);
    }, 0);
  });

  moneyCtx.height = BAR_HEIGHT * labels.length;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 20,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTransportChart = (transportCtx, points) => {

  const allTransports = points
    .map((it) => it.type)
    .filter((it) => TRANSPORT.includes(it));

  const labels = allTransports
    .map((point) => point.toUpperCase())
    .filter(getUniqItems);

  const data = new Array(labels.length).fill(`0`);

  for (let i = 0; i < labels.length; i++) {
    let j = 0;
    while (j !== -1) {
      j = allTransports.indexOf(labels[i].toLowerCase());
      if (j !== -1) {
        allTransports.splice(j, 1);
        data[i]++;
      }
    }
  }

  transportCtx.height = BAR_HEIGHT * labels.length;

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 20,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeChart = (timeCtx, points) => {

  const labels = points
    .map((point) => point.type.toUpperCase())
    .filter(getUniqItems);

  const data = labels.slice().map((label) => {
    const filteredPoints = points.slice().filter((point) => {
      return point.type === label.toLowerCase();
    });
    return filteredPoints.reduce((sum, current) => {
      return sum + Number(current.difference);
    }, 0);
  });

  timeCtx.height = BAR_HEIGHT * labels.length;

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${formatDuration(val)}`
        }
      },
      title: {
        display: true,
        text: `TIME SPEND`,
        fontColor: `#000000`,
        fontSize: 20,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatsTemplate = () => {

  return (
    `<div><div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div></div>`
  );
};

export default class Stats extends AbstractSmartComponent {
  constructor(container) {
    super();

    this._container = container;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;
  }

  getTemplate() {
    return createStatsTemplate();
  }

  rerender(points) {
    super.rerender();

    this._renderCharts(points);
  }

  render(points) {
    render(this._container, this, RenderPosition.BEFOREEND);
    this._renderCharts(points);
  }

  recoveryListeners() {}

  hide() {
    this._container.classList.add(HIDDEN_CLASS);
  }

  show(points) {
    this._container.classList.remove(HIDDEN_CLASS);

    this.rerender(points);
  }

  _renderCharts(points) {
    const element = this.getElement();

    const moneyCtx = element .querySelector(`.statistics__chart--money`);
    const transportCtx = element .querySelector(`.statistics__chart--transport`);
    const timeCtx = element .querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, points);
    this._transportChart = renderTransportChart(transportCtx, points);
    this._timeChart = renderTimeChart(timeCtx, points);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }
}

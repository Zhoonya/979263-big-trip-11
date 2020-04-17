import {MONTH} from "../const.js";
import {createElement} from "../utils.js";

// Раздел информации о путешествии и маршрут
const createTripInfoTemplate = (dates, events) => {
  const getDestination = () => {
    if (events.length > 0) {
      const destinations = events.slice().map((item) => {
        return item.destination;
      });
      if (destinations.length > 3) {
        return (`${destinations[0]} &mdash; ... &mdash; ${destinations[destinations.length - 1]}`);
      } else {
        return (`${destinations.join(` &mdash; `)}`);
      }
    } else {
      return (``);
    }

  };
  const getDates = () => {
    if (dates.length > 0) {
      const startDate = `${MONTH[new Date(dates[0]).getMonth()]} ${new Date(dates[0]).getDate()}`;
      const endDate = `&nbsp;&mdash;&nbsp;${MONTH[new Date(dates[dates.length - 1]).getMonth()]} ${new Date(dates[dates.length - 1]).getDate()}`;
      return (`${startDate}${endDate}`);
    } else {
      return (``);
    }
  };

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getDestination()}</h1>
        <p class="trip-info__dates">${getDates()}</p>
      </div>
    </section>`
  );
};

export default class TripDay {
  constructor(dates, events) {
    this._dates = dates;
    this._events = events;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._dates, this._events);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

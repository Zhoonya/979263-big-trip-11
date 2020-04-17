import {ARRIVAL} from "../const.js";
import {createElement, formatTime, formatDuration} from "../utils.js";

// Точка маршрута
const createEventTemplate = (event) => {
  const {type, destination, price, offers, date} = event;
  const eventTitle = type[0].toUpperCase() + type.slice(1);
  const preposition = ARRIVAL.has(type) ? `in` : `to`;
  const startTime = formatTime(date.startDate);
  const endTime = formatTime(date.endDate);
  const duration = formatDuration(date.difference);

  const createOffers = () => {
    if (offers.length > 0) {
      let checkedOffers = offers.slice().filter((item) => item.isChecked === true);
      if (checkedOffers.length > 0 && checkedOffers.length <= 3) {
        checkedOffers = checkedOffers.map((item) => {
          return (`
                     <li class="event__offer">
             <span class="event__offer-title">${item.offer}</span>
             &plus;
             &euro;&nbsp;<span class="event__offer-price">${item.price}</span>
            </li>
          `);
        }).join(`\n`);
        return checkedOffers;
      } else if (checkedOffers.length > 3) {
        checkedOffers = checkedOffers.slice(0, 3).map((item) => {
          return (`
                     <li class="event__offer">
             <span class="event__offer-title">${item.offer}</span>
             &plus;
             &euro;&nbsp;<span class="event__offer-price">${item.price}</span>
            </li>
          `);
        }).join(`\n`);
        return checkedOffers;
      } else {
        return (``);
      }
    } else {
      return (``);
    }
  };

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventTitle} ${preposition} ${destination}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-19T11:20">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-19T13:00">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
            ${createOffers()}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event {
  constructor(event) {
    this._event = event;
    this._element = null;
  }

  getTemplate() {
    return createEventTemplate(this._event);
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

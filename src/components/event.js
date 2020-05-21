import {ARRIVAL} from "../const.js";
import {formatTime, formatDuration} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";
import {encode} from "he";

// Точка маршрута
const createEventTemplate = (event) => {
  const {type, destination, price, offers, startDate, endDate} = event;
  const eventTitle = type[0].toUpperCase() + type.slice(1);
  const preposition = ARRIVAL.has(type) ? `in` : `to`;
  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);
  const duration = formatDuration(endDate - startDate);
  const destinationName = encode(destination.name);
  const priceValue = encode(String(price));

  const createOffers = () => {
    if (offers.length > 0) {
      if (offers.length > 0 && offers.length <= 3) {
        return offers.map((item) => {
          return (`
                     <li class="event__offer">
             <span class="event__offer-title">${item.title}</span>
             &plus;
             &euro;&nbsp;<span class="event__offer-price">${item.price}</span>
            </li>
          `);
        }).join(`\n`);
      } else if (offers.length > 3) {
        return offers.slice(0, 3).map((item) => {
          return (`
                     <li class="event__offer">
             <span class="event__offer-title">${item.title}</span>
             &plus;
             &euro;&nbsp;<span class="event__offer-price">${item.price}</span>
            </li>
          `);
        }).join(`\n`);
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
        <h3 class="event__title">${eventTitle} ${preposition} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-19T11:20">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-19T13:00">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${priceValue}</span>
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

export default class Event extends AbstractComponent {
  constructor(event) {
    super();

    this._event = event;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  setOpenButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}

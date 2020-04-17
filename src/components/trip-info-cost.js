import {createElement} from "../utils.js";

// Стоимость путешествия (раздел информации о путешествии)
export const createTripInfoCostTemplate = (events) => {
  const cost = events.slice().reduce((sum, item) => {
    return sum + item.price;
  }, 0);
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>`
  );
};

export default class TripInfoCost {
  constructor(events) {
    this._events = events;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoCostTemplate(this._events);
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

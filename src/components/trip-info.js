import AbstractComponent from "./abstract-component.js";

// Раздел информации о путешествии и маршрут
const createTripInfoTemplate = (dates, events) => {

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${dates}</h1>
        <p class="trip-info__dates">${events}</p>
      </div>
    </section>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(dates, events) {
    super();

    this._dates = dates;
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._dates, this._events);
  }
}

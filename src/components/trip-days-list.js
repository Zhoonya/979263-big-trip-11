import AbstractComponent from "./abstract-component.js";

// Контейнер для всего путешествия
const createTripDaysListTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class TripDaysList extends AbstractComponent {
  getTemplate() {
    return createTripDaysListTemplate();
  }
}


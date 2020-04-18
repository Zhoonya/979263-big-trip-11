import {MONTH} from "../const.js";
import {createElement} from "../utils.js";

// День путешествия и контейнер для списка точек маршрута
const createTripDayTemplate = (day, date) => {
  const attributeDate = date;
  const visuallyDate = `${MONTH[new Date(date).getMonth()]} ${new Date(date).getDate()}`;
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${day}</span>
        <time class="day__date" datetime="${attributeDate}">${visuallyDate}</time>
      </div>
      <ul class="trip-events__list"  data-datatime="${attributeDate}"></ul>
    </li>`
  );
};

export default class TripDay {
  constructor(day, date) {
    this._day = day;
    this._date = date;
    this._element = null;
  }

  getTemplate() {
    return createTripDayTemplate(this._day, this._date);
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

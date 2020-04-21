import {MONTH} from "../const.js";
import AbstractComponent from "./abstract-component.js";

// День путешествия и контейнер для списка точек маршрута
const createTripDayTemplate = (day, date) => {
  const dayCounter = day ? `${day}` : ``;
  const attributeDate = date ? `data-datatime="${date}"` : ``;
  const visuallyDate = date ? `${MONTH[new Date(date).getMonth()]} ${new Date(date).getDate()}` : ``;
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayCounter}</span>
        <time class="day__date" datetime="${attributeDate}">${visuallyDate}</time>
      </div>
      <ul class="trip-events__list"  ${attributeDate}></ul>
    </li>`
  );
};

export default class TripDay extends AbstractComponent {
  constructor(day, date) {
    super();

    this._day = day;
    this._date = date;
  }

  getTemplate() {
    return createTripDayTemplate(this._day, this._date);
  }
}

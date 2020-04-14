import {MONTH} from "../const";

// День путешествия и контейнер для списка точек маршрута
export const createTripDayTemplate = (day, date) => {
  const attributeDate = date;
  const visuallyDate = `${MONTH[new Date(date).getMonth()]} ${new Date(date).getDate()}`;
  return (`
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${day}</span>
        <time class="day__date" datetime="${attributeDate}">${visuallyDate}</time>
      </div>
      <ul class="trip-events__list"  data-datatime="${attributeDate}"></ul>
    </li>
    `);
};

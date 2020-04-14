const EVENT_COUNT = 10;

import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createTripInfoTemplate} from "./components/trip-info.js";
import {createTripInfoCostTemplate} from "./components/trip-info-cost.js";
import {createTripSortTemplate} from "./components/trip-sort.js";
import {createTripDaysListTemplate} from "./components/trip-days-list.js";
import {createTripDayTemplate} from "./components/trip-day.js";
import {createEventTemplate} from "./components/event.js";
import {generateEvents} from "./mock/event.js";
import {createEditEventTemplate} from "./components/edit-event.js";
import {getListOfDates} from "./mock/trip-day.js";

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const events = generateEvents(EVENT_COUNT);
const dates = getListOfDates(events);

const siteHeaderElement = document.querySelector(`.trip-main`);
const menuElement = siteHeaderElement.querySelector(`#header-menu`);
const filtersElement = siteHeaderElement.querySelector(`#header-filters`);

render(menuElement, createSiteMenuTemplate(), `afterend`);
render(filtersElement, createFilterTemplate(), `afterend`);

render(siteHeaderElement, createTripInfoTemplate(dates, events), `afterbegin`);

const tripInfoElement = siteHeaderElement.querySelector(`.trip-info`);

render(tripInfoElement, createTripInfoCostTemplate(events));

const tripEventsElement = document.querySelector(`.trip-events`);

render(tripEventsElement, createTripSortTemplate());
render(tripEventsElement, createTripDaysListTemplate());

const tripDaysListElement = tripEventsElement.querySelector(`.trip-days`);

for (let i = 0; i < dates.length; i++) {
  render(tripDaysListElement, createTripDayTemplate(i + 1, dates[i]));
}


const tripDayElement = tripDaysListElement.querySelectorAll(`.trip-events__list`);

for (let i = 0; i < tripDayElement.length; i++) {
  let copyOfEvents = events.slice(1);
  const tripDayDate = new Date(tripDayElement[i].getAttribute(`data-datatime`)).getDate();
  const tripDayMonth = new Date(tripDayElement[i].getAttribute(`data-datatime`)).getMonth();
  const tripDayYear = new Date(tripDayElement[i].getAttribute(`data-datatime`)).getFullYear();
  copyOfEvents = copyOfEvents.filter((item) => {
    return item.date.startDate.getDate() === tripDayDate
      && item.date.startDate.getMonth() === tripDayMonth
      && item.date.startDate.getFullYear() === tripDayYear;
  });
  for (let j = 0; j < copyOfEvents.length; j++) {
    render(tripDayElement[i], createEventTemplate(copyOfEvents[j]));
  }
}


render(Array.from(tripDayElement).filter((item) => {
  return events[0].date.startDate.getDate() === new Date(item.getAttribute(`data-datatime`)).getDate();
})[0], createEditEventTemplate(events[0]), `afterbegin`);

const EVENT_COUNT = 3;

import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createTripInfoTemplate} from "./components/trip-info.js";
import {createTripInfoCostTemplate} from "./components/trip-info-cost.js";
import {createTripSortTemplate} from "./components/trip-sort.js";
import {createTripDaysListTemplate} from "./components/trip-days-list.js";
import {createTripDayTemplate} from "./components/trip-day.js";
import {createEventTemplate} from "./components/event.js";
import {createEditEventTemplate} from "./components/edit-event.js";

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.trip-main`);
const menuElement = siteHeaderElement.querySelector(`#header-menu`);
const filtersElement = siteHeaderElement.querySelector(`#header-filters`);

render(menuElement, createSiteMenuTemplate(), `afterend`);
render(filtersElement, createFilterTemplate(), `afterend`);

render(siteHeaderElement, createTripInfoTemplate(), `afterbegin`);

const tripInfoElement = siteHeaderElement.querySelector(`.trip-info`);

render(tripInfoElement, createTripInfoCostTemplate());

const tripEventsElement = document.querySelector(`.trip-events`);

render(tripEventsElement, createTripSortTemplate());
render(tripEventsElement, createTripDaysListTemplate());

const tripDaysListElement = tripEventsElement.querySelector(`.trip-days`);

render(tripDaysListElement, createTripDayTemplate());

const tripDayElement = tripDaysListElement.querySelector(`.trip-events__list`);

for (let i = 0; i < EVENT_COUNT; i++) {
  render(tripDayElement, createEventTemplate());
}

render(tripDayElement, createEditEventTemplate());

import SiteMenuComponent from "./components/site-menu.js";
import FilterComponent from "./components/filter.js";
import TripInfoComponent from "./components/trip-info.js";
import TripInfoCostComponent from "./components/trip-info-cost.js";
import {generateEvents} from "./mock/event.js";
import {getListOfDates} from "./mock/trip-day.js";
import {render, RenderPosition} from "./utils/render.js";
import TripDaysController from "./controllers/trip.js";

const EVENT_COUNT = 10;


const events = generateEvents(EVENT_COUNT);
const dates = getListOfDates(events);

const siteHeaderElement = document.querySelector(`.trip-main`);
const menuElement = siteHeaderElement.querySelector(`#header-menu`);
const filtersElement = siteHeaderElement.querySelector(`#header-filters`);

render(menuElement, new SiteMenuComponent(), RenderPosition.AFTEREND);
render(filtersElement, new FilterComponent(), RenderPosition.AFTEREND);

render(siteHeaderElement, new TripInfoComponent(dates, events), RenderPosition.AFTERBEGIN);
const tripInfoElement = siteHeaderElement.querySelector(`.trip-info`);
render(tripInfoElement, new TripInfoCostComponent(events), RenderPosition.BEFOREEND);

const tripDaysController = new TripDaysController(document.querySelector(`.trip-events`));
tripDaysController.render(dates, events);


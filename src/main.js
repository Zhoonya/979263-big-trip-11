import SiteMenuComponent from "./components/site-menu.js";
import FilterComponent from "./components/filter.js";
import TripInfoComponent from "./components/trip-info.js";
import TripInfoCostComponent from "./components/trip-info-cost.js";
import TripSortComponent from "./components/trip-sort.js";
import TripDaysListComponent from "./components/trip-days-list.js";
import TripDayComponent from "./components/trip-day.js";
import EventComponent from "./components/event.js";
import {generateEvents} from "./mock/event.js";
import EditEventComponent from "./components/edit-event.js";
import {getListOfDates} from "./mock/trip-day.js";
import {render, RenderPosition} from "./utils.js";

const EVENT_COUNT = 10;

const renderEvent = (tripEventsList, event) => {
  const onOpenButtonClick = () => {
    tripEventsList.replaceChild(editEventComponent.getElement(), eventComponent.getElement());
  };
  const onCloseButtonClick = (evt) => {
    evt.preventDefault();
    tripEventsList.replaceChild(eventComponent.getElement(), editEventComponent.getElement());
  };

  const eventComponent = new EventComponent(event);
  const openButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  openButton.addEventListener(`click`, onOpenButtonClick);

  const editEventComponent = new EditEventComponent(event);
  const editForm = editEventComponent.getElement().querySelector(`.event--edit`);
  const closeButton = editEventComponent.getElement().querySelector(`.event__rollup-btn`);
  editForm.addEventListener(`submit`, onCloseButtonClick);
  closeButton.addEventListener(`click`, onCloseButtonClick);

  render(tripEventsList, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderTripDays = (tripDaysList, dates, events) => {
  for (let i = 0; i < dates.length; i++) {
    const tripDayComponent = new TripDayComponent(i + 1, dates[i]);
    render(tripDaysList.getElement(), tripDayComponent.getElement(), RenderPosition.BEFOREEND);

    let copyOfEvents = events.slice(0);
    copyOfEvents = copyOfEvents.filter((item) => {
      const date = new Date(dates[i]);
      return item.date.startDate.getDate() === date.getDate()
        && item.date.startDate.getMonth() === date.getMonth()
        && item.date.startDate.getFullYear() === date.getFullYear();
    });
    const tripEventsList = tripDayComponent.getElement().querySelector(`.trip-events__list`);
    copyOfEvents.forEach((item) => renderEvent(tripEventsList, item));
  }
};

const events = generateEvents(EVENT_COUNT);
const dates = getListOfDates(events);

const siteHeaderElement = document.querySelector(`.trip-main`);
const menuElement = siteHeaderElement.querySelector(`#header-menu`);
const filtersElement = siteHeaderElement.querySelector(`#header-filters`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(menuElement, new SiteMenuComponent().getElement(), RenderPosition.AFTEREND);
render(filtersElement, new FilterComponent().getElement(), RenderPosition.AFTEREND);

render(siteHeaderElement, new TripInfoComponent(dates, events).getElement(), RenderPosition.AFTERBEGIN);
const tripInfoElement = siteHeaderElement.querySelector(`.trip-info`);
render(tripInfoElement, new TripInfoCostComponent(events).getElement(), RenderPosition.BEFOREEND);

render(tripEventsElement, new TripSortComponent().getElement(), RenderPosition.BEFOREEND);

const tripDaysList = new TripDaysListComponent();
render(tripEventsElement, tripDaysList.getElement(), RenderPosition.BEFOREEND);
renderTripDays(tripDaysList, dates, events);


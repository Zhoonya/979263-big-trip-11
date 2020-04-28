import {render, RenderPosition} from "../utils/render.js";
import NoEventsComponent from "../components/no-events.js";
import TripSortComponent, {SortType} from "../components/trip-sort.js";
import TripDaysListComponent from "../components/trip-days-list.js";
import TripDayComponent from "../components/trip-day.js";
import PointController from "./point.js";

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const copyOfEvents = events.slice();

  switch (sortType) {
    case SortType.TIME:
      sortedEvents = copyOfEvents.sort((a, b) => b.date.difference - a.date.difference);
      break;
    case SortType.PRICE:
      sortedEvents = copyOfEvents.sort((a, b) => b.price - a.price);
      break;
    case SortType.EVENT:
      sortedEvents = copyOfEvents;
      break;
  }

  return sortedEvents;
};

const renderEvents = (events, container, onDataChange, onViewChange) => {
  return events.map((event) => {
    const pointController = new PointController(container, onDataChange, onViewChange);
    pointController.render(event);
    return pointController;
  });
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._events = [];
    this._dates = [];
    this._pointControllers = [];
    this._noEventsComponent = new NoEventsComponent();
    this._tripSortComponent = new TripSortComponent();
    this._tripDaysListComponent = new TripDaysListComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._tripSortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(dates, events) {
    this._events = events;
    this._dates = dates;
    if (events.length === 0) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._tripSortComponent, RenderPosition.BEFOREEND);

    render(this._container, this._tripDaysListComponent, RenderPosition.BEFOREEND);

    this._renderEventsByDays();
  }

  _onViewChange() {
    this._pointControllers.forEach((item) => item.setDefaultView());
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));
    pointController.render(this._events[index]);
  }

  _onSortTypeChange(sortType) {
    const sortedEvents = getSortedEvents(this._events, sortType);
    const tripSortDay = this._tripSortComponent.getElement().querySelector(`.trip-sort__item--day`);

    this._tripDaysListComponent.getElement().innerHTML = ``;

    if (sortType === SortType.TIME || sortType === SortType.PRICE) {
      tripSortDay.innerHTML = ``;
      this._renderEventsBySortType(sortedEvents);
    } else {
      tripSortDay.innerHTML = `Day`;
      this._renderEventsByDays();
    }
  }

  _renderEventsByDays() {
    this._pointControllers = [];
    for (let i = 0; i < this._dates.length; i++) {
      const tripDayComponent = new TripDayComponent(i + 1, this._dates[i]);
      render(this._tripDaysListComponent.getElement(), tripDayComponent, RenderPosition.BEFOREEND);

      let copyOfEvents = this._events.slice(0);
      copyOfEvents = copyOfEvents.filter((item) => {
        const date = new Date(this._dates[i]);
        return item.date.startDate.getDate() === date.getDate()
          && item.date.startDate.getMonth() === date.getMonth()
          && item.date.startDate.getFullYear() === date.getFullYear();
      });
      const tripEventsList = tripDayComponent.getElement().querySelector(`.trip-events__list`);
      const points = renderEvents(copyOfEvents, tripEventsList, this._onDataChange, this._onViewChange);
      this._pointControllers = this._pointControllers.concat(points);
    }
  }

  _renderEventsBySortType(sortedEvents) {
    const tripDayComponent = new TripDayComponent(``, ``);
    render(this._tripDaysListComponent.getElement(), tripDayComponent, RenderPosition.BEFOREEND);
    const tripEventsList = tripDayComponent.getElement().querySelector(`.trip-events__list`);
    const points = renderEvents(sortedEvents, tripEventsList, this._onDataChange, this._onViewChange);
    this._pointControllers = points;
  }
}

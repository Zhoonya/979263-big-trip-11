import {render, RenderPosition} from "../utils/render.js";
import NoEventsComponent from "../components/no-events.js";
import TripSortComponent, {SortType} from "../components/trip-sort.js";
import TripDaysListComponent from "../components/trip-days-list.js";
import TripDayComponent from "../components/trip-day.js";
import PointController from "./point.js";
import {getListOfDates} from "../mock/trip-day.js";

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
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._dates = [];
    this._pointControllers = [];
    this._noEventsComponent = new NoEventsComponent();
    this._tripSortComponent = new TripSortComponent();
    this._tripDaysListComponent = new TripDaysListComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._tripSortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const points = this._pointsModel.getPoints();

    if (points.length === 0) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._tripSortComponent, RenderPosition.AFTERBEGIN);
    render(this._container, this._tripDaysListComponent, RenderPosition.BEFOREEND);
    this._renderEventsByDays();
  }

  _onViewChange() {
    this._pointControllers.forEach((item) => item.setDefaultView());
  }

  _onDataChange(pointController, oldData, newData) {
    const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

    if (isSuccess) {
      pointController.render(newData);
    }
  }

  _onSortTypeChange(sortType) {
    const sortedEvents = getSortedEvents(this._pointsModel.getPoints(), sortType);

    this._tripDaysListComponent.getElement().innerHTML = ``;

    if (sortType === SortType.TIME || sortType === SortType.PRICE) {
      this._renderEventsBySortType(sortedEvents);
    } else {
      this._renderEventsByDays();
    }
  }

  _renderEventsByDays() {
    this._pointControllers = [];

    this._tripSortComponent.setSortType(SortType.EVENT);

    const tripSortDay = this._tripSortComponent.getElement().querySelector(`.trip-sort__item--day`);
    tripSortDay.innerHTML = `Day`;
    this._dates = getListOfDates(this._pointsModel.getPoints());
    for (let i = 0; i < this._dates.length; i++) {
      const tripDayComponent = new TripDayComponent(i + 1, this._dates[i]);
      render(this._tripDaysListComponent.getElement(), tripDayComponent, RenderPosition.BEFOREEND);

      let copyOfEvents = this._pointsModel.getPoints().slice(0);
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
    const tripSortDay = this._tripSortComponent.getElement().querySelector(`.trip-sort__item--day`);
    tripSortDay.innerHTML = ``;
    const tripDayComponent = new TripDayComponent(``, ``);
    render(this._tripDaysListComponent.getElement(), tripDayComponent, RenderPosition.BEFOREEND);
    const tripEventsList = tripDayComponent.getElement().querySelector(`.trip-events__list`);
    const points = renderEvents(sortedEvents, tripEventsList, this._onDataChange, this._onViewChange);
    this._pointControllers = points;
  }

  _removePoints() {
    this._tripDaysListComponent.getElement().innerHTML = ``;
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
  }

  _updatePoints() {
    this._removePoints();
    this._renderEventsByDays(this._pointsModel.getPoints().slice());
  }

  _onFilterChange() {
    this._updatePoints();
  }
}

import {render, remove, RenderPosition} from "../utils/render.js";
import NoEventsComponent from "../components/no-events.js";
import TripSortComponent, {SortType} from "../components/trip-sort.js";
import TripDaysListComponent from "../components/trip-days-list.js";
import TripDayComponent from "../components/trip-day.js";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "./point.js";
import {HIDDEN_CLASS} from "../const.js";
import {getPointsByFilter} from "../utils/filter.js";
import {formatYearMonthDate, getUniqueItems} from "../utils/common.js";

const sortAscending = (a, b) => {
  if (a > b) {
    return 1;
  } else if (a === b) {
    return 0;
  } else {
    return -1;
  }
};

const getListOfDates = (events) => {
  let dates = events.map((item) => {
    const date = item.startDate;
    return formatYearMonthDate(date);
  });
  dates = dates.sort(sortAscending);
  dates = getUniqueItems(dates);
  return dates;
};

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const copyOfEvents = events.slice();

  switch (sortType) {
    case SortType.TIME:
      sortedEvents = copyOfEvents.sort((a, b) => b.difference - a.difference);
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

const renderEvents = (events, container, onDataChange, onViewChange, infoComponent, onFavoriteChange) => {
  return events.map((event) => {
    const pointController = new PointController(container, onDataChange, onViewChange, infoComponent, onFavoriteChange);
    pointController.render(event, PointControllerMode.DEFAULT);
    return pointController;
  });
};

export default class TripController {
  constructor(container, pointsModel, api, infoController) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._dates = [];
    this._pointControllers = [];
    this._noEventsComponent = null;
    this._tripSortComponent = new TripSortComponent();
    this._tripDaysListComponent = new TripDaysListComponent();
    this._creatingPoint = null;
    this._api = api;
    this._infoController = infoController;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);

    this._tripSortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._container.classList.add(HIDDEN_CLASS);
  }

  show() {
    this._pointControllers.forEach((item) => {
      if (item.removeAddingPoint()) {
        this._creatingPoint = null;
      }
    });

    this._container.classList.remove(HIDDEN_CLASS);
    this._updatePoints();
  }

  render() {
    const points = this._pointsModel.getPoints();

    if (points.length === 0) {
      this._noEventsComponent = new NoEventsComponent();
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._tripSortComponent, RenderPosition.AFTERBEGIN);
    render(this._container, this._tripDaysListComponent, RenderPosition.BEFOREEND);
    this._renderEventsByDays();
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    if (this._pointControllers.length === 0) {
      render(this._container, this._tripDaysListComponent, RenderPosition.BEFOREEND);
      remove(this._noEventsComponent);
      this._noEventsComponent = null;
    }

    const tripDaysListElement = this._tripDaysListComponent.getElement();

    this._creatingPoint = new PointController(tripDaysListElement, this._onDataChange, this._onViewChange, this._infoController, this._onFavoriteChange);

    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
    this._pointControllers = this._pointControllers.concat(this._creatingPoint);
  }

  _onViewChange() {
    this._pointControllers.forEach((item) => {
      if (item.removeAddingPoint()) {
        this._creatingPoint = null;
      }
      item.setDefaultView();
    });

  }

  _onFavoriteChange(pointController, oldData, newData) {
    this._api.updatePoint(oldData.id, newData)
      .then((pointModel) => {
        const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);
        if (isSuccess) {
          pointController.render(pointModel, PointControllerMode.EDIT);
        }
      })
      .catch(() => {
        pointController.shake();
      });
  }

  _onDataChange(pointController, oldData, newData) {
    const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
    if (newEventButton.disabled) {
      newEventButton.removeAttribute(`disabled`);
    }

    if (oldData === EmptyPoint) {
      this._creatingPoint = null;

      if (newData === null) {
        pointController.destroy();
        this._updatePoints();
      } else {

        this._api.createPoint(newData)
          .then((pointModel) => {
            this._pointsModel.addPoint(pointModel);

            pointController.getEditEventComponent().getElement().remove();
            this._updatePoints();
            this._infoController.rerender(this._pointsModel);
          })
          .catch(() => {
            pointController.shake();
            this._infoController.rerender(this._pointsModel);
          });
      }

    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
          this._infoController.rerender(this._pointsModel);
        })
        .catch(() => {
          pointController.shake();
          this._infoController.rerender(this._pointsModel);
        });

    } else {
      this._api.updatePoint(oldData.id, newData)
        .then((pointModel) => {
          const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);
          if (isSuccess) {
            pointController.render(pointModel, PointControllerMode.DEFAULT);
            this._updatePoints();
            this._infoController.rerender(this._pointsModel);
          }
        })
        .catch(() => {
          pointController.shake();
          this._infoController.rerender(this._pointsModel);
        });
    }
  }

  _onSortTypeChange(sortType) {
    const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
    if (newEventButton.disabled) {
      this._creatingPoint = null;
      newEventButton.removeAttribute(`disabled`);
    }

    const sortedEvents = getSortedEvents(this._pointsModel.getPoints(), sortType);

    this._tripDaysListComponent.getElement().innerHTML = ``;

    if (sortType === SortType.TIME || sortType === SortType.PRICE) {
      this._renderEventsBySortType(sortedEvents);
    } else {
      this._renderEventsByDays();
    }
  }

  _renderEventsByDays() {

    if (this._pointsModel.getPointsAll().length === 0 && this._noEventsComponent === null) {
      this._noEventsComponent = new NoEventsComponent();
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }
    this._pointControllers = [];

    this._tripSortComponent.setSortType(SortType.EVENT);

    const tripSortDay = this._tripSortComponent.getElement().querySelector(`.trip-sort__item--day`);
    tripSortDay.innerHTML = `Day`;
    this._dates = getListOfDates(this._pointsModel.getPoints());
    for (let i = 0; i < this._dates.length; i++) {
      const tripDayComponent = new TripDayComponent(i + 1, this._dates[i]);
      render(this._tripDaysListComponent.getElement(), tripDayComponent, RenderPosition.BEFOREEND);

      let copyOfEvents = this._pointsModel.getPoints().slice(0);
      copyOfEvents = copyOfEvents.sort((a, b) => a.startDate - b.startDate).filter((item) => {
        const date = new Date(this._dates[i]);
        return item.startDate.getDate() === date.getDate()
          && item.startDate.getMonth() === date.getMonth()
          && item.startDate.getFullYear() === date.getFullYear();
      });
      const tripEventsList = tripDayComponent.getElement().querySelector(`.trip-events__list`);
      const points = renderEvents(copyOfEvents, tripEventsList, this._onDataChange, this._onViewChange, this._infoController, this._onFavoriteChange);
      this._pointControllers = this._pointControllers.concat(points);
    }

    this._checkFilters(this._pointsModel.getPointsAll());
  }

  _renderEventsBySortType(sortedEvents) {
    const tripSortDay = this._tripSortComponent.getElement().querySelector(`.trip-sort__item--day`);
    tripSortDay.innerHTML = ``;
    const tripDayComponent = new TripDayComponent(``, ``);
    render(this._tripDaysListComponent.getElement(), tripDayComponent, RenderPosition.BEFOREEND);
    const tripEventsList = tripDayComponent.getElement().querySelector(`.trip-events__list`);
    const points = renderEvents(sortedEvents, tripEventsList, this._onDataChange, this._onViewChange, this._infoController, this._onFavoriteChange);
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
    this._pointControllers.forEach((item) => {
      if (item.removeAddingPoint()) {
        this._creatingPoint = null;
      }
    });
    this._updatePoints();
  }

  _checkFilters(points) {
    const filters = document.querySelectorAll(`.trip-filters__filter-input`);
    filters.forEach((item) => {
      const filteredPoints = getPointsByFilter(points, item.value);
      if (filteredPoints.length === 0 && !item.hasAttribute(`disabled`)) {
        item.disabled = true;
      } else if (filteredPoints.length > 0 && item.hasAttribute(`disabled`)) {
        item.disabled = false;
      }
    });
  }
}

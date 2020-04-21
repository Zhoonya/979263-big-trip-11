import {render, replace, RenderPosition} from "../utils/render.js";
import EventComponent from "../components/event.js";
import EditEventComponent from "../components/edit-event.js";
import NoEventsComponent from "../components/no-events.js";
import TripSortComponent, {SortType} from "../components/trip-sort.js";
import TripDaysListComponent from "../components/trip-days-list.js";
import TripDayComponent from "../components/trip-day.js";

const renderEvent = (tripEventsList, event) => {
  const replaceEventToEdit = () => {
    replace(editEventComponent, eventComponent);
  };
  const replaceEditToEvent = () => {
    replace(eventComponent, editEventComponent);
  };

  const handleKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, handleKeyDown);
    }
  };

  const eventComponent = new EventComponent(event);
  eventComponent.setOpenButtonClickHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, handleKeyDown);
  });

  const editEventComponent = new EditEventComponent(event);
  editEventComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, handleKeyDown);
  });
  editEventComponent.setCloseButtonClickHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, handleKeyDown);
  });

  render(tripEventsList, eventComponent, RenderPosition.BEFOREEND);
};

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

export default class TripDaysController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._tripSortComponent = new TripSortComponent();
    this._tripDaysListComponent = new TripDaysListComponent();
  }

  render(dates, events) {
    if (events.length === 0) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._tripSortComponent, RenderPosition.BEFOREEND);

    render(this._container, this._tripDaysListComponent, RenderPosition.BEFOREEND);

    const renderEventsByDays = () => {
      for (let i = 0; i < dates.length; i++) {
        const tripDayComponent = new TripDayComponent(i + 1, dates[i]);
        render(this._tripDaysListComponent.getElement(), tripDayComponent, RenderPosition.BEFOREEND);

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

    const renderEventsBySortType = (sortedEvents) => {
      const tripDayComponent = new TripDayComponent(``, ``);
      render(this._tripDaysListComponent.getElement(), tripDayComponent, RenderPosition.BEFOREEND);
      const tripEventsList = tripDayComponent.getElement().querySelector(`.trip-events__list`);
      sortedEvents.forEach((item) => renderEvent(tripEventsList, item));
    };

    renderEventsByDays();

    this._tripSortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedEvents = getSortedEvents(events, sortType);
      const tripSortDay = this._tripSortComponent.getElement().querySelector(`.trip-sort__item--day`);

      this._tripDaysListComponent.getElement().innerHTML = ``;

      if (sortType === SortType.TIME || sortType === SortType.PRICE) {
        tripSortDay.innerHTML = ``;
        renderEventsBySortType(sortedEvents);
      } else {
        tripSortDay.innerHTML = `Day`;
        renderEventsByDays();
      }
    });
  }
}

import {render, remove, RenderPosition, replace} from "../utils/render.js";
import EventComponent from "../components/event.js";
import EditEventComponent from "../components/edit-event.js";
import {TYPE} from "../const.js";
// import {OFFERS} from "../const.js";
// import PointsModel from "../models/points";
// import {getDescription, getOffersByType, getPhotos} from "../mock/event.js";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyPoint = {
  type: TYPE[0],
  destination: {
    name: ``,
    description: ``,
    photos: [],
  },
  price: ``,
  startDate: new Date(),
  endDate: new Date(),
  isFavorite: false,
  offers: [],
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._eventComponent = null;
    this._editEventComponent = null;
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._pointModel = null;

  }

  render(event, mode) {
    this._pointModel = event;
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._editEventComponent;
    this._mode = mode;

    this._eventComponent = new EventComponent(event);
    this._editEventComponent = new EditEventComponent(event);

    this._eventComponent.setOpenButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._handleKeyDown);
    });

    // this._editEventComponent.setFavoritesButtonClickHandler(() => {
    //   this._onDataChange(this, event, Object.assign({}, event, {
    //     isFavorite: !event.isFavorite,
    //   }));
    // });
    this._editEventComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._editEventComponent.getData();
      this._onDataChange(this, event, data);
      document.removeEventListener(`keydown`, this._handleKeyDown);
    });
    this._editEventComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, event, null));
    this._editEventComponent.setCloseButtonClickHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._handleKeyDown);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventEditComponent && oldEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._editEventComponent, oldEventEditComponent);
          this._replaceEditToEvent();
        } else {
          render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldEventEditComponent && oldEventComponent) {
          remove(oldEventEditComponent);
          remove(oldEventComponent);
        }
        this._onViewChange();
        document.addEventListener(`keydown`, this._handleKeyDown);

        render(this._container, this._editEventComponent, RenderPosition.BEFOREBEGIN);
        this._editEventComponent.getElement().classList.add(`day`);
        const editEventForm = this._editEventComponent.getElement().querySelector(`.event--edit`);
        editEventForm.classList.add(`trip-events__item`);
        editEventForm.querySelector(`.event__rollup-btn`).remove();
        editEventForm.querySelector(`.event__favorite-btn`).remove();
        editEventForm.querySelector(`.event__favorite-checkbox`).remove();
        editEventForm.querySelector(`.event__reset-btn`).textContent = `Cancel`;

        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  removeAddingPoint() {
    if (this._mode === Mode.ADDING) {
      this.destroy();

      const NewEventButton = document.querySelector(`.trip-main__event-add-btn`);
      if (NewEventButton.disabled) {
        NewEventButton.removeAttribute(`disabled`);
      }

      return true;
    } else {
      return false;
    }
  }

  destroy() {
    remove(this._editEventComponent);
    remove(this._eventComponent);
    document.removeEventListener(`keydown`, this._handleKeyDown);
  }

  getEditEventComponent() {
    return this._editEventComponent;
  }


  _replaceEventToEdit() {
    this._onViewChange();
    replace(this._editEventComponent, this._eventComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._handleKeyDown);
    this._editEventComponent.reset();
    if (document.contains(this._editEventComponent.getElement())) {
      replace(this._eventComponent, this._editEventComponent);
    }
    this._mode = Mode.DEFAULT;

  }

  _handleKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null);
      }
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._handleKeyDown);
    }
  }
}

import {render, remove, RenderPosition, replace} from "../utils/render.js";
import {getDescription, getPhotos} from "../utils/common.js";
import EventComponent from "../components/event.js";
import EditEventComponent from "../components/edit-event.js";
import PointModel from "../models/point.js";
import {TYPE} from "../const.js";
// import PointsModel from "../models/points";

const SHAKE_ANIMATION_TIMEOUT = 600;

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

const parseFormData = (formData, id) => {
  let offers = Array.from(document.querySelectorAll(`.event__offer-selector`));
  if (offers.length > 0) {
    offers = offers.filter((item) => item.querySelector(`.event__offer-checkbox`).checked).map((item) => {
      return {
        title: item.querySelector(`.event__offer-label`).querySelector(`.event__offer-title`).textContent,
        price: Number(item.querySelector(`.event__offer-label`).querySelector(`.event__offer-price`).textContent),
      };
    });
  } else {
    offers = [];
  }
  const startDate = new Date(formData.get(`event-start-time`));
  const endDate = new Date(formData.get(`event-end-time`));
  const destinationName = formData.get(`event-destination`);
  return new PointModel({
    "id": id,
    "type": formData.get(`event-type`),
    "destination": {
      "name": destinationName,
      "description": getDescription(destinationName),
      "pictures": getPhotos(destinationName),
    },
    "base_price": formData.get(`event-price`),
    "date_from": String(startDate),
    "date_to": String(endDate),
    "is_favorite": formData.get(`event-favorite`),
    "offers": offers,
  });
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, infoController, onFavoriteChange) {
    this._container = container;
    this._eventComponent = null;
    this._editEventComponent = null;
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._pointModel = null;
    this._infoController = infoController;
    this._onFavoriteChange = onFavoriteChange;

  }

  render(event, mode) {
    this._pointModel = event;
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._editEventComponent;
    this._mode = mode;

    this._eventComponent = new EventComponent(event);
    this._editEventComponent = new EditEventComponent(event, this._mode);

    this._eventComponent.setOpenButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._handleKeyDown);
    });
    this._editEventComponent.setFavoritesButtonClickHandler(() => {
      const newPoint = PointModel.clone(event);
      newPoint.isFavorite = !newPoint.isFavorite;
      // this._onDataChange(this, event, newPoint);
      this._onFavoriteChange(this, event, newPoint);
    });
    this._editEventComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._editEventComponent.getData();
      const data = parseFormData(formData, this._pointModel.id);

      this._editEventComponent.setData({
        saveButtonText: `Saving...`,
      });
      this._infoController.addLoadingStatus();
      this.blockForm();
      this._onDataChange(this, event, data);
      document.removeEventListener(`keydown`, this._handleKeyDown);
    });
    this._editEventComponent.setDeleteButtonClickHandler(() => {
      this._editEventComponent.setData({
        deleteButtonText: `Deleting...`,
      });
      this.blockForm();
      this._onDataChange(this, event, null);
    });
    this._editEventComponent.setCloseButtonClickHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._handleKeyDown);
    });

    switch (mode) {
      case Mode.EDIT:
        if (oldEventEditComponent && oldEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._editEventComponent, oldEventEditComponent);
          // this._replaceEditToEvent();
        } else {
          render(this._container, this._editEventComponent, RenderPosition.BEFOREEND);
        }
        break;
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
        render(this._container, this._editEventComponent, RenderPosition.AFTERBEGIN);
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

  shake() {
    this._editEventComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this._editEventComponent.getElement().style.animation = ``;
      this._eventComponent.getElement().style.animation = ``;

      this._editEventComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);

  }

  blockForm() {
    this._editEventComponent.getElement().querySelectorAll(`form input, form select, form textarea, form button`)
      .forEach((item) => {
        item.disabled = true;
      });
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

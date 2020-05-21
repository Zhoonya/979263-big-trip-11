import {TYPE, ARRIVAL} from "../const.js";
import {formatDateTime, getDescription, getPhotos, getOffersByType} from "../utils/common.js";
import {models} from "../models/index.js";
import {Mode} from "../controllers/point.js";
import {createElement} from "../utils/render.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import flatpickr from "flatpickr";
import {encode} from "he";
import "flatpickr/dist/flatpickr.min.css";

const isOnline = () => {
  return window.navigator.onLine;
};

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

// Форма редактирования точки маршрута
const createEventEditTemplate = (event, options = {}) => {
  const {isFavorite} = event;
  const {type, offers, destination, startDate, endDate, price, externalData} = options;

  const eventTitle = type[0].toUpperCase() + type.slice(1);
  const preposition = ARRIVAL.has(type) ? `in` : `to`;
  const startTime = formatDateTime(startDate);
  const endTime = formatDateTime(endDate);
  const favoriteAttribute = isFavorite ? `checked` : ``;
  const destinationValue = encode(destination.name);
  const priceValue = encode(String(price));

  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

  const createDestinationList = () => {
    return models.destinations.slice().map((item) => {
      const destinationName = item.name[0].toUpperCase() + item.name.slice(1);
      return (`<option value="${destinationName}"></option>`);
    }).join(`\n`);
  };

  const createDestinationPattern = () => {
    return models.destinations.slice().map((item) => {
      const destinationName = item.name[0].toUpperCase() + item.name.slice(1);
      return (`${destinationName}`);
    }).join(`|`);
  };

  const createTypesList = () => {
    const getTypesListTemplate = (item) => {
      const typeItem = item.toLowerCase();
      const typeName = typeItem[0].toUpperCase() + typeItem.slice(1);
      const checkedAttribute = typeItem === type.toLowerCase() ? `checked` : ``;
      return (
        `<div class="event__type-item">
          <input id="event-type-${typeItem}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeItem}" ${checkedAttribute}>
          <label class="event__type-label  event__type-label--${typeItem}" for="event-type-${typeItem}-1">${typeName}</label>
        </div>`);
    };

    const transferList = () => {
      return TYPE.slice().filter((item) => {
        return !ARRIVAL.has(item);
      }).map((item) => getTypesListTemplate(item)).join(`\n`);
    };

    const activityList = () => {
      return TYPE.slice().filter((item) => {
        return ARRIVAL.has(item);
      }).map((item) => getTypesListTemplate(item)).join(`\n`);
    };

    return (
      `<fieldset class="event__type-group">
        <legend class="visually-hidden">Transfer</legend>
        ${transferList()}
      </fieldset>
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Activity</legend>
        ${activityList()}
      </fieldset>`
    );
  };

  let offersList = getOffersByType(type);
  const createOffers = () => {
    const getIdName = (offer) => {
      return offer.split(` `).join(`-`);
    };
    const checkedOffers = offers.map((item) => item.title);
    if (offersList.length > 0) {
      offersList = offersList.map((item) => {
        if (checkedOffers.includes(item.title)) {
          return (
            `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${getIdName(item.title)}-1" type="checkbox" name="event-offer-${getIdName(item.title)}" checked>
            <label class="event__offer-label" for="event-offer-${getIdName(item.title)}-1">
              <span class="event__offer-title">${item.title}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${item.price}</span>
            </label>
          </div>`
          );
        } else {
          return (
            `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${getIdName(item.title)}-1" type="checkbox" name="event-offer-${getIdName(item.title)}">
              <label class="event__offer-label" for="event-offer-${getIdName(item.title)}-1">
                <span class="event__offer-title">${item.title}</span>
                &plus;
              &euro;&nbsp;<span class="event__offer-price">${item.price}</span>
            </label>
          </div>`
          );
        }
      }).join(`\n`);
      return (
        `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
            ${offersList}
            </div>
          </section>`
      );
    } else if (offersList.length === 0 && checkedOffers.length > 0) {
      offersList = offers.map((item) => {
        return (
          `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${getIdName(item.title)}-1" type="checkbox" name="event-offer-${getIdName(item.title)}" checked>
            <label class="event__offer-label" for="event-offer-${getIdName(item.title)}-1">
              <span class="event__offer-title">${item.title}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${item.price}</span>
            </label>
          </div>`
        );
      }).join(`\n`);
      return (
        `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
            ${offersList}
            </div>
          </section>`
      );
    } else {
      return (``);
    }
  };

  const createInformation = () => {
    const allDestinations = models.destinations.slice().map((item) => item.name);

    if (allDestinations.includes(destination.name)) {
      const description = destination.description;
      const createPhotos = () => {
        if (isOnline()) {
          const photos = destination.pictures;
          return photos.map((item) => {
            return (
              `<img class="event__photo" src="${item.src}" alt="Event photo">`
            );
          }).join(`\n`);
        } else {
          return (``);
        }
      };
      return (
        `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${createPhotos()}
            </div>
          </div>
        </section>`
      );
    } else {
      return ``;
    }
  };

  const createEventDetails = () => {
    const offersMarkup = createOffers();
    const informationMarkup = createInformation();
    if (offersMarkup !== `` || informationMarkup !== ``) {
      return (
        `<section class="event__details">
          ${offersMarkup}
          ${informationMarkup}
        </section>`
      );
    } else {
      return (``);
    }
  };

  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              ${createTypesList()}
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${eventTitle} ${preposition}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationValue}" pattern="${createDestinationPattern()}" list="destination-list-1" required>
            <datalist id="destination-list-1">${createDestinationList()}</datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${priceValue}" required pattern="[1-9]{1}[0-9]{1,6}|0">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
          <button class="event__reset-btn" type="reset">${deleteButtonText}</button>
          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${favoriteAttribute}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        ${createEventDetails()}
      </form>
    </li>`
  );
};

export default class EventEdit extends AbstractSmartComponent {
  constructor(event, mode) {
    super();

    this._event = event;

    this._submitHandler = null;
    this._closeButtonClickHandler = null;
    this._deleteButtonClickHandler = null;

    this._type = event.type;
    this._offers = event.offers;
    this._destination = event.destination.name;
    this._informationDescription = event.destination.description;
    this._informationPhotos = event.destination.pictures;
    this._startDate = event.startDate;
    this._endDate = event.endDate;
    this._difference = this._endDate - this._startDate;
    this._price = event.price;
    this._externalData = DefaultData;

    this._mode = mode;

    this._flatpickrStart = null;
    this._flatpickrEnd = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEventEditTemplate(this._event, {
      type: this._type,
      offers: this._offers,
      destination: {
        name: this._destination,
        description: this._informationDescription,
        pictures: this._informationPhotos,
      },
      startDate: this._startDate,
      endDate: this._endDate,
      difference: this._difference,
      price: this._price,
      externalData: this._externalData,
    });
  }

  removeElement() {
    if (this._flatpickrStart) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
    }
    if (this._flatpickrEnd) {
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setFavoritesButtonClickHandler(this._setFavoritesButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    if (this._mode === Mode.ADDING) {
      const editEventForm = this.getElement().querySelector(`.event--edit`);
      editEventForm.classList.add(`trip-events__item`);
      editEventForm.querySelector(`.event__rollup-btn`).remove();
      editEventForm.querySelector(`.event__favorite-btn`).remove();
      editEventForm.querySelector(`.event__favorite-checkbox`).remove();
      editEventForm.querySelector(`.event__reset-btn`).textContent = `Cancel`;
    }
    this._applyFlatpickr();
  }

  reset() {
    const event = this._event;
    this._offers = event.offers;
    this._type = event.type;
    this._destination = event.destination.name;
    this._informationDescription = event.destination.description;
    this._informationPhotos = event.destination.pictures;
    this._startDate = event.startDate;
    this._endDate = event.endDate;
    this._difference = event.difference;
    this._price = event.price;

    this.rerender();
  }

  getData() {
    const form = this.getElement().querySelector(`.event--edit`);

    return new FormData(form);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`.event--edit`).addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
    this._closeButtonClickHandler = handler;
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, handler);
    this._setFavoritesButtonClickHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler();
      });
    this._deleteButtonClickHandler = handler;
  }

  _applyFlatpickr() {
    if (this._flatpickrStart) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
    }
    if (this._flatpickrEnd) {
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }

    const startDateElement = this.getElement().querySelector(`#event-start-time-1`);
    const endDateElement = this.getElement().querySelector(`#event-end-time-1`);

    this._flatpickrStart = flatpickr(startDateElement, {
      altInput: true,
      altFormat: `d/m/y H:i`,
      allowInput: true,
      enableTime: true,
      [`time_24hr`]: true,
      defaultDate: this._startDate || `today`,
      onClose: (selectedDates) => {
        this._startDate = selectedDates[0] || this._endDate;
        if (this._startDate > this._endDate) {
          this._endDate = this._startDate;
        }
        this._difference = this._endDate - this._startDate;
        this._flatpickrEnd.setDate(this._endDate);
        this._flatpickrEnd.set(`minDate`, this._startDate);
      },
    });

    this._flatpickrEnd = flatpickr(endDateElement, {
      altInput: true,
      altFormat: `d/m/y H:i`,
      allowInput: true,
      enableTime: true,
      [`time_24hr`]: true,
      minDate: this._startDate,
      defaultDate: this._endDate || `today`,
      onClose: (selectedDates) => {
        this._endDate = selectedDates[0] || this._endDate;
        this._difference = this._endDate - this._startDate;
      },
    });
  }

  _rerenderDestinationInformation() {
    const allDestinations = models.destinations.slice().map((item) => item.name);

    const eventDetailsElement = this.getElement().querySelector(`.event__details`);
    const eventDestinationElement = this.getElement().querySelector(`.event__section--destination`);

    if (allDestinations.includes(this._destination)) {
      const createInformation = () => {
        const description = this._informationDescription;
        const createPhotos = () => {
          if (isOnline()) {
            const photos = this._informationPhotos;
            return photos.map((item) => {
              return (
                `<img class="event__photo" src="${item.src}" alt="Event photo">`
              );
            }).join(`\n`);
          } else {
            return (``);
          }
        };
        return (
          `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${createPhotos()}
            </div>
          </div>`
        );
      };

      if (!eventDetailsElement) {
        const eventDetailsTemplate = `<section class="event__details">
            <section class="event__section  event__section--destination">
            ${createInformation()}
            </section>
          </section>`;
        this.getElement().querySelector(`form`).append(createElement(eventDetailsTemplate));
      } if (eventDetailsElement && eventDestinationElement) {
        eventDestinationElement.innerHTML = createInformation();
      } else if (eventDetailsElement && !eventDestinationElement) {
        const eventDestinationTemplate = `<section class="event__section  event__section--destination">${createInformation()}</section>`;
        eventDetailsElement.append(createElement(eventDestinationTemplate));
      }
    } else {
      if (!eventDetailsElement) {
        return;
      } else {
        if (!eventDestinationElement) {
          return;
        } else {
          const eventOffersElement = eventDetailsElement.querySelector(`.event__available-offers`);
          if (eventOffersElement) {
            eventDestinationElement.remove();
          } else {
            eventDetailsElement.remove();
          }
        }
      }
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const types = element.querySelectorAll(`.event__type-label`);
    types.forEach((item) => {
      item.addEventListener(`click`, (evt) => {
        this._type = evt.target.textContent.toLowerCase();
        this._offers = [];
        this.rerender();
      });
    });

    const destination = element.querySelector(`.event__input--destination`);
    destination.addEventListener(`invalid`, () => {
      if (destination.validity.patternMismatch) {
        destination.setCustomValidity(`Please, select a city from the list`);
      } else if (destination.validity.valueMissing) {
        destination.setCustomValidity(`Please, select a city from the list`);
      } else {
        destination.setCustomValidity(``);
      }
    });
    destination.addEventListener(`change`, () => {
      const oldDestination = this._destination;
      this._destination = destination.value.trim();
      if (oldDestination !== this._destination) {
        this._informationDescription = getDescription(this._destination);
        this._informationPhotos = getPhotos(this._destination);
        this._rerenderDestinationInformation();
        // this.rerender();
      }
    });

    const price = element.querySelector(`.event__input--price`);
    price.addEventListener(`input`, () => {
      this._price = price.value.trim();
    });
    price.addEventListener(`invalid`, () => {
      if (price.validity.patternMismatch) {
        price.setCustomValidity(`Please, enter a positive integer`);
      } else if (price.validity.valueMissing) {
        price.setCustomValidity(`Please, enter a price`);
      } else {
        price.setCustomValidity(``);
      }
    });

    const offersCheckboxes = element.querySelectorAll(`.event__offer-checkbox`);
    offersCheckboxes.forEach((item) => {
      item.addEventListener(`change`, () => {
        let offers = Array.from(element.querySelectorAll(`.event__offer-selector`));
        if (offers.length > 0) {
          this._offers = offers.filter((offer) => offer.querySelector(`.event__offer-checkbox`).checked).map((offer) => {
            return {
              title: offer.querySelector(`.event__offer-label`).querySelector(`.event__offer-title`).textContent,
              price: Number(offer.querySelector(`.event__offer-label`).querySelector(`.event__offer-price`).textContent),
            };
          });
        } else {
          this._offers = [];
        }
        this.rerender();
      });
    });
  }
}

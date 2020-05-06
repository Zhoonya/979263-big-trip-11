import {TYPE, ARRIVAL, DESTINATION} from "../const.js";
import {formatDateTime} from "../utils/common.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import {getDescription, getPhotos, getOffersByType} from "../mock/event.js";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

// const isValiddestination = (destination) => {
//   if (destination.length > 0) {
//     destination = destination[0].toUpperCase() + destination.slice(1);
//     return DESTINATION.includes(destination);
//   } else {
//     return false;
//   }
// };

// Форма редактирования точки маршрута
const createEventEditTemplate = (event, options = {}) => {
  const {isFavorite} = event;
  const {type, offers, destination, information, date, price} = options;

  const eventTitle = type[0].toUpperCase() + type.slice(1);
  const preposition = ARRIVAL.has(type) ? `in` : `to`;
  const startTime = formatDateTime(date.startDate);
  const endTime = formatDateTime(date.endDate);
  const favoriteAttribute = isFavorite ? `checked` : ``;
  // const saveButtonDisabletAttribute = isValiddestination(destination) ? `` : `disabled`;


  const createDestinationList = () => {
    return DESTINATION.slice().map((item) => {
      const destinationName = item[0].toUpperCase() + item.slice(1);
      return (`<option value="${destinationName}"></option>`);
    }).join(`\n`);
  };

  const createDestinationPattern = () => {
    return DESTINATION.slice().map((item) => {
      const destinationName = item[0].toUpperCase() + item.slice(1);
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

  let offersList = offers.slice();
  const createOffers = () => {
    const getIdName = (offer) => {
      return offer.split(` `).join(`-`);
    };
    if (offersList.length > 0) {
      offersList = offersList.map((item) => {
        if (item.isChecked) {
          return (
            `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${getIdName(item.offer)}-1" type="checkbox" name="event-offer-${getIdName(item.offer)}" checked>
            <label class="event__offer-label" for="event-offer-${getIdName(item.offer)}-1">
              <span class="event__offer-title">${item.offer}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${item.price}</span>
            </label>
          </div>`
          );
        } else {
          return (
            `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${getIdName(item.offer)}-1" type="checkbox" name="event-offer-${getIdName(item.offer)}">
              <label class="event__offer-label" for="event-offer-${getIdName(item.offer)}-1">
                <span class="event__offer-title">${item.offer}</span>
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
    } else {
      return (``);
    }
  };

  const createInformation = () => {
    if (DESTINATION.includes(destination)) {
      const description = information.description;
      const createPhotos = () => {
        const photos = information.photos;
        return photos.map((item) => {
          return (
            `<img class="event__photo" src="${item}" alt="Event photo">`
          );
        }).join(`\n`);
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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" pattern="${createDestinationPattern()}" list="destination-list-1" required>
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
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}" required  pattern="[1-9]+[0-9]*|0">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
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

const parseFormData = (formData) => {
  let offers = Array.from(document.querySelectorAll(`.event__offer-selector`));
  if (offers.length > 0) {
    offers = offers.map((item) => {
      return {
        offer: item.querySelector(`.event__offer-label`).querySelector(`.event__offer-title`).textContent,
        price: item.querySelector(`.event__offer-label`).querySelector(`.event__offer-price`).textContent,
        isChecked: item.querySelector(`.event__offer-checkbox`).checked,
      };
    });
  } else {
    offers = [];
  }
  const startDate = new Date(formData.get(`event-start-time`));
  const endDate = new Date(formData.get(`event-end-time`));
  return {
    type: formData.get(`event-type`),
    destination: formData.get(`event-destination`),
    price: formData.get(`event-price`),
    date: {
      startDate,
      endDate,
      difference: (endDate - startDate) / 60000,
    },
    isFavorite: formData.get(`event-favorite`),
    offers,
    information: {
      description: getDescription(),
      photos: getPhotos(),
    },
  };
};

export default class EventEdit extends AbstractSmartComponent {
  constructor(event) {
    super();

    this._event = event;

    this._submitHandler = null;
    this._closeButtonClickHandler = null;
    this._deleteButtonClickHandler = null;

    this._type = event.type;
    this._offers = event.offers;
    this._destination = event.destination;
    this._informationDescription = event.information.description;
    this._informationPhotos = event.information.photos;
    this._startDate = event.date.startDate;
    this._endDate = event.date.endDate;
    this._difference = event.date.difference;
    this._price = event.price;

    this._flatpickrStart = null;
    this._flatpickrEnd = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEventEditTemplate(this._event, {
      type: this._type,
      offers: this._offers,
      destination: this._destination,
      information: {
        description: this._informationDescription,
        photos: this._informationPhotos,
      },
      date: {
        startDate: this._startDate,
        endDate: this._endDate,
        difference: this._difference,
      },
      price: this._price,
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
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const event = this._event;
    this._offers = event.offers;
    this._type = event.type;
    this._destination = event.destination;
    this._informationDescription = event.information.description;
    this._informationPhotos = event.information.photos;
    this._startDate = event.date.startDate;
    this._endDate = event.date.endDate;
    this._difference = event.date.difference;
    this._price = event.price;

    this.rerender();
  }

  getData() {
    const form = this.getElement().querySelector(`.event--edit`);
    const formData = new FormData(form);

    return parseFormData(formData);
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

  _subscribeOnEvents() {
    const element = this.getElement();

    const types = element.querySelectorAll(`.event__type-label`);
    types.forEach((item) => {
      item.addEventListener(`click`, (evt) => {
        this._type = evt.target.textContent.toLowerCase();
        this._offers = getOffersByType(this._type);
        this.rerender();
      });
    });

    const destination = element.querySelector(`.event__input--destination`);
    const oldDestination = destination.value;
    destination.addEventListener(`invalid`, () => {
      if (destination.validity.patternMismatch) {
        destination.setCustomValidity(`Please, select a city from the list`);
      } else {
        destination.setCustomValidity(``);
      }
    });
    destination.addEventListener(`change`, () => {
      this._destination = destination.value.trim();
      if (oldDestination !== this._destination) {
        this._informationDescription = getDescription();
        this._informationPhotos = getPhotos();
        this.rerender();
      }
    });

    const price = element.querySelector(`.event__input--price`);
    price.addEventListener(`input`, () => {
      this._price = price.value.trim();
    });
    price.addEventListener(`input`, () => {
      if (price.validity.patternMismatch) {
        price.setCustomValidity(`Please, enter a positive integer`);
      } else {
        price.setCustomValidity(``);
      }
    });
  }
}

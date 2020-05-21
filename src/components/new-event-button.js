import AbstractComponent from "./abstract-component.js";

const createSiteMenuTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  );
};

export default class NewEventButton extends AbstractComponent {
  getTemplate() {
    return createSiteMenuTemplate();
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, () => {
      handler();
    });
  }

  addDisabled() {
    this.getElement().disabled = true;
  }

  removeDisabled() {
    this.getElement().disabled = false;
  }

  hide() {
    this.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this.getElement().classList.remove(`visually-hidden`);
  }
}

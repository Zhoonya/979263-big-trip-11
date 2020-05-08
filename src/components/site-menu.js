import AbstractComponent from "./abstract-component.js";

export const MenuItem = {
  TABLE: `table`,
  STATS: `stats`,
};

// Основное меню сайта
const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" id="table" href="#">Table</a>
      <a class="trip-tabs__btn" id="stats" href="#">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {
  getTemplate() {
    return createSiteMenuTemplate();
  }

  setActiveItem(menuItem) {
    const item = this.getElement().querySelector(`#${menuItem}`);

    if (item) {
      const items = this.getElement().querySelectorAll(`.trip-tabs__btn`);
      items.forEach((it) => {
        if (it.classList.contains(`trip-tabs__btn--active`)) {
          it.classList.remove(`trip-tabs__btn--active`);
        }
      });

      item.classList.add(`trip-tabs__btn--active`);
    }
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItem = evt.target.id;

      handler(menuItem);
    });
  }
}


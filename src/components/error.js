import AbstractComponent from "./abstract-component.js";

const createErrorTemplate = () => {
  return (
    `<p class="trip-events__msg">Sorry, the site is temporarily unavailable</p>`
  );
};

export default class Error extends AbstractComponent {
  getTemplate() {
    return createErrorTemplate();
  }
}

import API from "./api/index.js";
import Provider from "./api/provider.js";
import Store from "./api/store.js";
import SiteMenuComponent, {MenuItem} from "./components/site-menu.js";
import FilterController from "./controllers/filter.js";
import NewEventButtonComponent from "./components/new-event-button.js";
import PointsModel from "./models/points.js";
import StatsComponent from "./components/stats.js";
import {render, RenderPosition} from "./utils/render.js";
import TripController from "./controllers/trip.js";
import InfoController from "./controllers/info.js";
import {AUTHORIZATION} from "./const.js";
import {models} from "./models/index.js";

const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const pointsModel = new PointsModel();
let tripController = null;

const renderApp = () => {
  const siteHeaderElement = document.querySelector(`.trip-main`);
  const menuElement = siteHeaderElement.querySelector(`#header-menu`);
  const filtersElement = siteHeaderElement.querySelector(`#header-filters`);

  const newEventButtonComponent = new NewEventButtonComponent();
  render(siteHeaderElement, newEventButtonComponent, RenderPosition.BEFOREEND);

  const siteMenuComponent = new SiteMenuComponent();
  render(menuElement, siteMenuComponent, RenderPosition.AFTEREND);

  const filterController = new FilterController(filtersElement, pointsModel);
  filterController.render();

  const infoController = new InfoController(siteHeaderElement);
  infoController.render(pointsModel);

  tripController = new TripController(document.querySelector(`.trip-events`), pointsModel, apiWithProvider, infoController);

  const statsContainer = new StatsComponent(document.querySelector(`.statistics`));
  statsContainer.render(pointsModel.getPointsAll());

  newEventButtonComponent.setOnChange(() => {
    filterController.setDefaultFilter();
    tripController.createPoint();
    newEventButtonComponent.addDisabled();
  });

  siteMenuComponent.setOnChange((menuItem) => {
    switch (menuItem) {
      case MenuItem.TABLE:
        siteMenuComponent.setActiveItem(MenuItem.TABLE);
        statsContainer.hide();
        tripController.show();
        newEventButtonComponent.removeDisabled();
        break;
      case MenuItem.STATS:
        siteMenuComponent.setActiveItem(MenuItem.STATS);
        tripController.hide();
        statsContainer.show(pointsModel.getPointsAll());
        newEventButtonComponent.addDisabled();
        break;
    }
  });
};


// api.getOffers()
//   .then((offers) => {
//     models.offers = offers;
//     renderApp();
//     api.getPoints()
//       .then((points) => {
//         pointsModel.setPoints(points);
//         tripController.render();
//       });
//   });

Promise.all([apiWithProvider.getPoints(), apiWithProvider.getOffers(), apiWithProvider.getDestinations()])
  .then((response) => {
    models.offers = response[1];
    models.destinations = response[2];

    pointsModel.setPoints(response[0]);
    renderApp();
    tripController.render();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {})
    .catch(() => {});
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

import API from "./api/index.js";
import ErrorComponent from "./components/error.js";
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
const STORE_POINTS_PREFIX = `big-trip_points-localstorage`;
const STORE_OFFERS_PREFIX = `big-trip_offers-localstorage`;
const STORE_DESTINATIONS_PREFIX = `big-trip_destinations-localstorage`;
const STORE_VER = `v1`;
const STORE_POINTS_NAME = `${STORE_POINTS_PREFIX}-${STORE_VER}`;
const STORE_OFFERS_NAME = `${STORE_OFFERS_PREFIX}-${STORE_VER}`;
const STORE_DESTINATIONS_NAME = `${STORE_DESTINATIONS_PREFIX}-${STORE_VER}`;

const api = new API(END_POINT, AUTHORIZATION);
const storePoints = new Store(STORE_POINTS_NAME, window.localStorage);
const storeOffers = new Store(STORE_OFFERS_NAME, window.localStorage);
const storeDestinations = new Store(STORE_DESTINATIONS_NAME, window.localStorage);
const apiWithProvider = new Provider(api, storePoints, storeOffers, storeDestinations);

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
        filterController.show();
        newEventButtonComponent.show();
        break;
      case MenuItem.STATS:
        siteMenuComponent.setActiveItem(MenuItem.STATS);
        tripController.hide();
        filterController.hide();
        newEventButtonComponent.hide();
        statsContainer.show(pointsModel.getPointsAll());
        break;
    }
  });
};

Promise.all([apiWithProvider.getPoints(), apiWithProvider.getOffers(), apiWithProvider.getDestinations()])
  .then((response) => {
    models.offers = response[1];
    models.destinations = response[2];

    pointsModel.setPoints(response[0]);
    renderApp();
    tripController.render();
  })
  .catch(() => {
    const errorComponent = new ErrorComponent();
    render(document.querySelector(`.trip-events`), errorComponent, RenderPosition.BEFOREEND);
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

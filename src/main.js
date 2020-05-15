import API from "./api.js";
import SiteMenuComponent, {MenuItem} from "./components/site-menu.js";
import FilterController from "./controllers/filter.js";
import NewEventButtonComponent from "./components/new-event-button.js";
// import TripInfoComponent from "./components/trip-info.js";
// import TripInfoCostComponent from "./components/trip-info-cost.js";
import PointsModel from "./models/points.js";
import StatsComponent from "./components/stats.js";
// import {generateEvents} from "./mock/event.js";
// import {getListOfDates} from "./mock/trip-day.js";
import {render, RenderPosition} from "./utils/render.js";
import TripController from "./controllers/trip.js";
import InfoController from "./controllers/info.js";
import {AUTHORIZATION} from "./const.js";
import {models} from "./models/index.js";

const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const api = new API(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
let tripController = null;

function renderApp() {
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

  // render(siteHeaderElement, new TripInfoComponent(dates, events), RenderPosition.AFTERBEGIN);
  // const tripInfoElement = siteHeaderElement.querySelector(`.trip-info`);
  // render(tripInfoElement, new TripInfoCostComponent(events), RenderPosition.BEFOREEND);

  tripController = new TripController(document.querySelector(`.trip-events`), pointsModel, api, infoController);
  // tripController.render();

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
}

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

Promise.all([api.getOffers(), api.getDestinations(), api.getPoints()])
  .then((response) => {
    models.offers = response[0];
    models.destinations = response[1];

    pointsModel.setPoints(response[2]);
    renderApp();
    tripController.render();
  });

import SiteMenuComponent, {MenuItem} from "./components/site-menu.js";
import FilterController from "./controllers/filter.js";
import NewEventButtonComponent from "./components/new-event-button.js";
// import TripInfoComponent from "./components/trip-info.js";
// import TripInfoCostComponent from "./components/trip-info-cost.js";
import PointsModel from "./models/points.js";
import StatsComponent from "./components/stats.js"
import {generateEvents} from "./mock/event.js";
// import {getListOfDates} from "./mock/trip-day.js";
import {render, RenderPosition} from "./utils/render.js";
import TripController from "./controllers/trip.js";

const EVENT_COUNT = 5;


const events = generateEvents(EVENT_COUNT);
// const dates = getListOfDates(events);
const pointsModel = new PointsModel();
pointsModel.setPoints(events);

const siteHeaderElement = document.querySelector(`.trip-main`);
const menuElement = siteHeaderElement.querySelector(`#header-menu`);
const filtersElement = siteHeaderElement.querySelector(`#header-filters`);

const newEventButtonComponent = new NewEventButtonComponent();
render(siteHeaderElement, newEventButtonComponent, RenderPosition.BEFOREEND);

const siteMenuComponent = new SiteMenuComponent();
render(menuElement, siteMenuComponent, RenderPosition.AFTEREND);
const filterController = new FilterController(filtersElement, pointsModel);
filterController.render();

// render(siteHeaderElement, new TripInfoComponent(dates, events), RenderPosition.AFTERBEGIN);
// const tripInfoElement = siteHeaderElement.querySelector(`.trip-info`);
// render(tripInfoElement, new TripInfoCostComponent(events), RenderPosition.BEFOREEND);

const tripController = new TripController(document.querySelector(`.trip-events`), pointsModel);
tripController.render();

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
      // tripController._updatePoints();
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

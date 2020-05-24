import TripInfoComponent from "../components/trip-info.js";
import TripInfoCostComponent from "../components/trip-info-cost.js";
import {render, RenderPosition} from "../utils/render.js";
import {MONTHS} from "../const.js";
import {remove} from "../utils/render";

export default class InfoController {
  constructor(container) {
    this._container = container;
    this._pointsModel = null;
    this._tripInfoComponent = null;
    this._tripInfoCostComponent = null;
  }

  render(pointsModel) {
    this._pointsModel = pointsModel;
    this._tripInfoComponent = new TripInfoComponent(this._getRoute(), this._getDate());
    this._tripInfoCostComponent = new TripInfoCostComponent(this._getCost());

    render(this._container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this._tripInfoComponent.getElement(), this._tripInfoCostComponent, RenderPosition.BEFOREEND);
  }

  rerender(pointsModel) {
    if (this._tripInfoComponent) {
      remove(this._tripInfoComponent);
    }
    if (this._tripInfoCostComponent) {
      remove(this._tripInfoComponent);
    }

    this.render(pointsModel);
  }

  addLoadingStatus() {
    if (this._tripInfoComponent) {
      remove(this._tripInfoComponent);
    }
    if (this._tripInfoCostComponent) {
      remove(this._tripInfoComponent);
    }
    this._tripInfoComponent = new TripInfoComponent(`Loadin...`, ``);

    render(this._container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _getCost() {
    const points = this._pointsModel.getPointsAll();
    let cost = 0;
    points.forEach((item) => {
      cost += Number(item.price);
      if (item.offers.length > 0) {
        item.offers.forEach((offer) => {
          cost += Number(offer.price);
        });
      }
    });
    return cost;
  }

  _getRoute() {
    const points = this._pointsModel.getPointsAll();
    points.sort((a, b) => a.startDate - b.startDate);

    if (points.length > 0) {
      const destinations = points.slice().map((item) => {
        return item.destination.name;
      });
      if (destinations.length > 3) {
        return (`${destinations[0]} &mdash; ... &mdash; ${destinations[destinations.length - 1]}`);
      } else {
        return (`${destinations.join(` &mdash; `)}`);
      }
    } else {
      return (``);
    }
  }

  _getDate() {
    const points = this._pointsModel.getPointsAll();
    points.sort((a, b) => a.startDate - b.startDate);

    if (points.length > 0) {
      const startDate = `${MONTHS[points[0].startDate.getMonth()]} ${points[0].startDate.getDate()}`;
      const endDate = `&nbsp;&mdash;&nbsp;${MONTHS[points[points.length - 1].endDate.getMonth()]} ${new Date(points[points.length - 1].endDate).getDate()}`;
      return (`${startDate}${endDate}`);
    } else {
      return (``);
    }
  }
}

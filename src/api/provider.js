import Point from "../models/point.js";
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, storePoints, storeOffers, storeDestinations) {
    this._api = api;
    this._storePoints = storePoints;
    this._storeOffers = storeOffers;
    this._storeDestinations = storeDestinations;
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map((point) => point.toRAW()));

          this._storePoints.setItems(items);

          return points;
        });
    }

    const storePoints = Object.values(this._storePoints.getItems());

    return Promise.resolve(Point.parsePoints(storePoints));
  }

  createPoint(point) {
    if (isOnline()) {
      return this._api.createPoint(point)
        .then((newPoint) => {
          this._storePoints.setItem(newPoint.id, newPoint.toRAW());

          return newPoint;
        });
    }

    const localNewPointId = nanoid();
    const localNewPoint = Point.clone(Object.assign(point, {id: localNewPointId}));

    this._storePoints.setItem(localNewPoint.id, localNewPoint.toRAW());

    return Promise.resolve(localNewPoint);
  }

  updatePoint(id, point) {
    if (isOnline()) {
      return this._api.updatePoint(id, point)
        .then((newPoint) => {
          this._storePoints.setItem(newPoint.id, newPoint.toRAW());

          return newPoint;
        });
    }

    const localPoint = Point.clone(Object.assign(point, {id}));

    this._storePoints.setItem(id, localPoint.toRAW());

    return Promise.resolve(localPoint);
  }

  deletePoint(id) {
    if (isOnline()) {
      return this._api.deletePoint(id)
        .then(() => this._storePoints.removeItem(id));
    }

    this._storePoints.removeItem(id);

    return Promise.resolve();
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          offers.forEach((offer) => this._storeOffers.setItem(offer.type, offer));
          return offers;
        });
    }
    const storeOffers = Object.values(this._storeOffers.getItems());
    return Promise.resolve(storeOffers);
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((offers) => {
          offers.forEach((destination) => this._storeDestinations.setItem(destination.name, destination));
          return offers;
        });
    }
    const storeDestinations = Object.values(this._storeDestinations.getItems());
    return Promise.resolve(storeDestinations);
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._storePoints.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._storePoints.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}

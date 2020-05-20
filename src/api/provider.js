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

  // getOffers() {
  //   if (isOnline()) {
  //     return this._api.getOffers();
  //   } else {
  //     const offers = [
  //       {
  //         type: `taxi`,
  //         offers: [
  //           {title: `Upgrade to a business class`, price: 190},
  //           {title: `Choose the radio station`, price: 30},
  //           {title: `Choose temperature`, price: 170},
  //           {title: `Drive quickly, I'm in a hurry`, price: 100},
  //           {title: `Drive slowly`, price: 110}
  //         ]
  //       },
  //       {
  //         type: `bus`,
  //         offers: [
  //           {title: `Infotainment system`, price: 50},
  //           {title: `Order meal`, price: 100},
  //           {title: `Choose seats`, price: 190}
  //         ]
  //       },
  //       {
  //         type: `train`,
  //         offers: [
  //           {title: `Book a taxi at the arrival point`, price: 110},
  //           {title: `Order a breakfast`, price: 80},
  //           {title: `Wake up at a certain time`, price: 140}
  //         ]
  //       },
  //       {
  //         type: `flight`,
  //         offers: [
  //           {title: `Choose meal`, price: 120},
  //           {title: `Choose seats`, price: 90},
  //           {title: `Upgrade to comfort class`, price: 120},
  //           {title: `Upgrade to business class`, price: 120},
  //           {title: `Add luggage`, price: 170},
  //           {title: `Business lounge`, price: 160}
  //         ]
  //       },
  //       {
  //         type: `check-in`,
  //         offers: [
  //           {title: `Choose the time of check-in`, price: 70},
  //           {title: `Choose the time of check-out`, price: 190},
  //           {title: `Add breakfast`, price: 110},
  //           {title: `Laundry`, price: 140},
  //           {title: `Order a meal from the restaurant`, price: 30}
  //         ]
  //       },
  //       {
  //         type: `sightseeing`,
  //         offers: []
  //       },
  //       {
  //         type: `ship`,
  //         offers: [
  //           {title: `Choose meal`, price: 130},
  //           {title: `Choose seats`, price: 160},
  //           {title: `Upgrade to comfort class`, price: 170},
  //           {title: `Upgrade to business class`, price: 150},
  //           {title: `Add luggage`, price: 100},
  //           {title: `Business lounge`, price: 40}
  //         ]
  //       },
  //       {
  //         type: `transport`,
  //         offers: []
  //       },
  //       {
  //         type: `drive`,
  //         offers: [
  //           {title: `Choose comfort class`, price: 110},
  //           {title: `Choose business class`, price: 180}
  //         ]
  //       },
  //       {
  //         type: `restaurant`,
  //         offers: [
  //           {title: `Choose live music`, price: 150},
  //           {title: `Choose VIP area`, price: 70}
  //         ]
  //       },
  //     ];
  //     return Promise.resolve(offers);
  //   }
  //
  // }

  // getDestinations() {
  //   if (isOnline()) {
  //     return this._api.getDestinations();
  //   } else {
  //     const destinations = [
  //       {
  //         description: `Chamonix, is a beautiful city, a true asian pearl, with crowded streets.`,
  //         name: `Chamonix`,
  //         pictures: [
  //           {
  //             src: `http://picsum.photos/300/200?r=0.0762563005163317`,
  //             description: `Chamonix parliament building`
  //           }
  //         ]
  //       },
  //       {
  //         description: `Amsterdam, is a beautiful city, a true asian pearl.`,
  //         name: `Amsterdam`,
  //         pictures: [
  //           {
  //             src: `http://picsum.photos/300/200?r=0.0762563005163317`,
  //             description: `Amsterdam parliament building`
  //           },
  //           {
  //             src: `http://picsum.photos/300/200?r=0.0762563005163317`,
  //             description: `Amsterdam parliament building`
  //           }
  //         ]
  //       },
  //       {
  //         description: `Chamonix, is a beautiful city, a true asian pearl.`,
  //         name: `Geneva`,
  //         pictures: []
  //       },
  //       {
  //         description: `Rotterdam, is a beautiful city, a true asian pearl.`,
  //         name: `Rotterdam`,
  //         pictures: [
  //           {
  //             src: `http://picsum.photos/300/200?r=0.0762563005163317`,
  //             description: `Rotterdam parliament building`
  //           },
  //           {
  //             src: `http://picsum.photos/300/200?r=0.0762563005163317`,
  //             description: `Rotterdam parliament building`
  //           }
  //         ]
  //       },
  //     ];
  //     return Promise.resolve(destinations);
  //   }
  // }

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

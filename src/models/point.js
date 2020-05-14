export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.destination = data[`destination`];
    this.price = data[`base_price`];
    this.startDate = new Date(data[`date_from`]);
    this.endDate = new Date(data[`date_to`]);
    this.difference = this.endDate - this.startDate;
    this.offers = data[`offers`];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    return {
      "id": this.id,
      "type": this.type,
      "destination": {
        "name": this.destination.name,
        "description": this.destination.description,
        "pictures": this.destination.pictures,
      },
      "base_price": Number(this.price),
      "date_from": String(this.startDate),
      "date_to": String(this.endDate),
      "is_favorite": this.isFavorite,
      "offers": this.offers,
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  // static clone(data) {
  //   return new Point(data.toRAW());
  // }
}

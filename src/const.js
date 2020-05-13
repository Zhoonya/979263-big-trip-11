// import API from "./api.js";

export const TYPE = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];
export const ARRIVAL = new Set([`check-in`, `sightseeing`, `restaurant`]);
export const TRANSPORT = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];

// export const DESTINATION = [`Amsterdam`, `Chamonix`, `Geneva`, `Rotterdam`];

// export const OFFERS = [`Order Uber`, `Add luggage`, `Switch to comfort`, `Rent a car`, `Add breakfast`, `Book tickets`, `Lunch in city`];

export const DESCRIPTION = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`];

export const MONTH = [`jan`, `feb`, `mar`, `apr`, `may`, `jun`, `jul`, `aug`, `sep`, `oct`, `nov`, `dec`];

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const HIDDEN_CLASS = `visually-hidden`;

export const AUTHORIZATION = `Basic dXNlc678kBwYXNzd267Ao=`;

// const api = new API(AUTHORIZATION);
// export const OFFERS = api.getOffers();

export const OFFERS = [
  {
    type: `taxi`,
    offers: [
      {title: `Upgrade to a business class`, price: 190},
      {title: `Choose the radio station`, price: 30},
      {title: `Choose temperature`, price: 170},
      {title: `Drive quickly, I'm in a hurry`, price: 100},
      {title: `Drive slowly`, price: 110}
    ]
  },
  {
    type: `bus`,
    offers: [
      {title: `Infotainment system`, price: 50},
      {title: `Order meal`, price: 100},
      {title: `Choose seats`, price: 190}
    ]
  },
  {
    type: `train`,
    offers: [
      {title: `Book a taxi at the arrival point`, price: 110},
      {title: `Order a breakfast`, price: 80},
      {title: `Wake up at a certain time`, price: 140}
    ]
  },
  {
    type: `flight`,
    offers: [
      {title: `Choose meal`, price: 120},
      {title: `Choose seats`, price: 90},
      {title: `Upgrade to comfort class`, price: 120},
      {title: `Upgrade to business class`, price: 120},
      {title: `Add luggage`, price: 170},
      {title: `Business lounge`, price: 160}
    ]
  },
  {
    type: `check-in`,
    offers: [
      {title: `Choose the time of check-in`, price: 70},
      {title: `Choose the time of check-out`, price: 190},
      {title: `Add breakfast`, price: 110},
      {title: `Laundry`, price: 140},
      {title: `Order a meal from the restaurant`, price: 30}
    ]
  },
  {
    type: `sightseeing`,
    offers: []
  },
  {
    type: `ship`,
    offers: [
      {title: `Choose meal`, price: 130},
      {title: `Choose seats`, price: 160},
      {title: `Upgrade to comfort class`, price: 170},
      {title: `Upgrade to business class`, price: 150},
      {title: `Add luggage`, price: 100},
      {title: `Business lounge`, price: 40}
    ]
  },
  {
    type: `transport`,
    offers: []
  },
  {
    type: `drive`,
    offers: [
      {title: `Choose comfort class`, price: 110},
      {title: `Choose business class`, price: 180}
    ]
  },
  {
    type: `restaurant`,
    offers: [
      {title: `Choose live music`, price: 150},
      {title: `Choose VIP area`, price: 70}
    ]
  },
];

export const DESTINATION = [
  {
    description: `Chamonix, is a beautiful city, a true asian pearl, with crowded streets.`,
    name: `Chamonix`,
    pictures: [
      {
        src: `http://picsum.photos/300/200?r=0.0762563005163317`,
        description: `Chamonix parliament building`
      }
    ]
  },
  {
    description: `Amsterdam, is a beautiful city, a true asian pearl.`,
    name: `Amsterdam`,
    pictures: [
      {
        src: `http://picsum.photos/300/200?r=0.0762563005163317`,
        description: `Amsterdam parliament building`
      },
      {
        src: `http://picsum.photos/300/200?r=0.0762563005163317`,
        description: `Amsterdam parliament building`
      }
    ]
  },
  {
    description: `Chamonix, is a beautiful city, a true asian pearl.`,
    name: `Geneva`,
    pictures: []
  },
  {
    description: `Rotterdam, is a beautiful city, a true asian pearl.`,
    name: `Rotterdam`,
    pictures: [
      {
        src: `http://picsum.photos/300/200?r=0.0762563005163317`,
        description: `Rotterdam parliament building`
      },
      {
        src: `http://picsum.photos/300/200?r=0.0762563005163317`,
        description: `Rotterdam parliament building`
      }
    ]
  },
];

import {TYPE, DESTINATION, OFFERS, DESCRIPTION} from "../const.js";

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomBooleanValue = () => {
  return !!getRandomIntegerNumber(0, 2);
};

const getOffers = () => {
  const numberOfOffers = getRandomIntegerNumber(0, 5);
  const allOffers = OFFERS.slice();
  const offersForEvent = [];
  const getOffer = () => {
    const indexOfOffer = getRandomIntegerNumber(0, allOffers.length);
    const offer = allOffers[indexOfOffer];
    allOffers.splice(indexOfOffer, 1);
    return offer;
  };

  for (let i = 0; i < numberOfOffers; i++) {
    offersForEvent.push({
      offer: getOffer(),
      price: getRandomIntegerNumber(5, 100),
      isChecked: getRandomBooleanValue(),
    });
  }
  return offersForEvent;
};

const offersByType = {
  'taxi': getOffers(),
  'bus': getOffers(),
  'train': getOffers(),
  'ship': getOffers(),
  'transport': getOffers(),
  'drive': getOffers(),
  'flight': getOffers(),
  'check-in': getOffers(),
  'sightseeing': getOffers(),
  'restaurant': getOffers()
};

export const getOffersByType = (type) => {
  const offers = offersByType[type];
  return offers;
};

let countdownDate = 0;
const getRandomDate = () => {
  let startDate;
  if (!countdownDate) {
    startDate = new Date();
    const sign = Math.random() > 0.5 ? 1 : -1;
    const diffValue = sign * getRandomIntegerNumber(0, 2); // от 0 до 2 для рандомного выбора даты, близкой к текущей

    startDate.setDate(startDate.getDate() + diffValue);
  } else {
    startDate = countdownDate;
    startDate.setMinutes(startDate.getMinutes() + (getRandomIntegerNumber(6, 30) * 10)); // добавление промежутока между событиями от 60мин до 5ч
  }

  const difference = getRandomIntegerNumber(1, 20) * 10;

  let endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + difference);
  countdownDate = new Date(endDate);

  return {
    startDate,
    endDate,
    difference,
  };
};

export const getDescription = () => {
  const lengthOfDescription = getRandomIntegerNumber(1, 5);
  const allSentences = DESCRIPTION.slice();
  const descriptionOfEvent = [];
  const getSentence = () => {
    const indexOfSentences = getRandomIntegerNumber(0, allSentences.length);
    const sentences = allSentences[indexOfSentences];
    allSentences.splice(indexOfSentences, 1);
    return sentences;
  };
  for (let i = 0; i < lengthOfDescription; i++) {
    descriptionOfEvent.push(getSentence());
  }
  return descriptionOfEvent.join(` `);
};

export const getPhotos = () => {
  const numberOfPhotos = getRandomIntegerNumber(1, 6);
  return Array.from(Array(numberOfPhotos)).map(() => {
    return (`http://picsum.photos/248/152?r=${Math.random()}`);
  });
};

export const generateEvent = function () {
  const event = {
    id: String(new Date() + Math.random()),
    type: getRandomArrayItem(TYPE),
    destination: getRandomArrayItem(DESTINATION),
    price: getRandomIntegerNumber(5, 200),
    date: getRandomDate(),
    information: {
      description: getDescription(),
      photos: getPhotos(),
    },
    isFavorite: getRandomBooleanValue(),
  };
  event.offers = getOffersByType(event.type);

  return event;
};

export const generateEvents = (count) => {
  return Array.from(Array(count)).map(generateEvent);
};

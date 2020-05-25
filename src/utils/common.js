import moment from "moment/moment";
import {models} from "../models/index.js";

export const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const formatDateTime = (date) => {
  return moment(date).format(`DD/MM/YY HH:mm`);
};

export const formatYearMonthDate = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};

export const formatMonthDate = (date) => {
  return moment(date).format(`MMM D`).toUpperCase();
};

export const formatDuration = (difference) => {
  const value = Math.floor(difference / 60000);
  if (value < 60) {
    return (`${value}M`);
  } else if (value >= 60 && value < 1440) {
    const hour = Math.floor(value / 60);
    const minute = value - (hour * 60);
    return (`${hour}H ${minute}M`);
  } else {
    let remainder = value;
    const day = Math.floor(value / 1440);
    remainder = remainder - (day * 1440);
    const hour = Math.floor(remainder / 60);
    remainder = remainder - (hour * 60);
    const minute = remainder;
    return (`${day}D ${hour}H ${minute}M`);
  }
};

export const getOffersByType = (type) => {
  const offersType = models.offers.find((item) => item.type === type);
  if (offersType) {
    return offersType.offers;
  }
  return [];
};

export const getDescription = (destination) => {
  const filteredDestination = models.destinations.slice().filter((item) => item.name === destination)[0];
  if (filteredDestination !== undefined) {
    return filteredDestination.description;
  }
  return ``;
};

export const getPhotos = (destination) => {
  const filteredDestination = models.destinations.slice().filter((item) => item.name === destination)[0];
  if (filteredDestination !== undefined) {
    return filteredDestination.pictures;
  }
  return [];
};

export const getUniqueItems = (items) => {
  return Array.from(new Set(items));
};

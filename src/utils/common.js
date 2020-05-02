import moment from "moment";

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

export const formatDuration = (value) => {
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

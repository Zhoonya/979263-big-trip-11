export const castTimeFormat = (value) => {
  return String(value).padStart(2, `0`);
};

const castYearFormat = (value) => {
  return String(value).slice(2);
};

export const castMonthFormat = (value) => {
  return String(value + 1).padStart(2, `0`);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const formatDateTime = (date) => {
  const year = castYearFormat(date.getFullYear());
  const month = castMonthFormat(date.getMonth());
  const day = castTimeFormat(date.getDate());
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
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

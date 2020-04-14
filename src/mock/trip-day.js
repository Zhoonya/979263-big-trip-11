import {castMonthFormat} from "../utils.js";
import {castTimeFormat} from "../utils.js";

const sortAscending = (a, b) => {
  if (a > b) {
    return 1;
  } else if (a === b) {
    return 0;
  } else {
    return -1;
  }
};

const getUniqueItems = (arr) => {
  return Array.from(new Set(arr));
};

export const getListOfDates = (events) => {
  let dates = events.map((item) => {
    const year = item.date.startDate.getFullYear();
    const month = castMonthFormat(item.date.startDate.getMonth());
    const day = castTimeFormat(item.date.startDate.getDate());
    return (`${year}-${month}-${day}`);
  });
  dates = dates.sort(sortAscending);
  dates = getUniqueItems(dates);
  return dates;
};

import {formatYearMonthDate} from "../utils/common.js";

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
    const date = item.startDate;
    return formatYearMonthDate(date);
  });
  dates = dates.sort(sortAscending);
  dates = getUniqueItems(dates);
  return dates;
};

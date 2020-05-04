import {FilterType} from "../const.js";

export const getPastPoints = (points, nowDate) => {
  return points.filter((point) => {
    return point.date.endDate.getDate() < nowDate.getDate() &&
      point.date.endDate.getMonth() <= nowDate.getMonth() &&
      point.date.endDate.getFullYear() <= nowDate.getFullYear();
  });
};

export const getFuturePoints = (points, nowDate) => {

  return points.filter((point) => {
    return point.date.startDate.getDate() > nowDate.getDate() &&
      point.date.startDate.getMonth() >= nowDate.getMonth() &&
      point.date.startDate.getFullYear() >= nowDate.getFullYear();
  });
};

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();
  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.PAST:
      return getPastPoints(points, nowDate);
    case FilterType.FUTURE:
      return getFuturePoints(points, nowDate);
  }
  return points;
};


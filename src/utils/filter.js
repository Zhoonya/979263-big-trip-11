import {FilterType} from "../const.js";

export const getPastPoints = (points, nowDate) => {
  return points.filter((point) => {
    return point.endDate.getDate() < nowDate.getDate() &&
      point.endDate.getMonth() <= nowDate.getMonth() &&
      point.endDate.getFullYear() <= nowDate.getFullYear();
  });
};

export const getFuturePoints = (points, nowDate) => {

  return points.filter((point) => {

    return point.startDate.getDate() > nowDate.getDate() &&
      point.startDate.getMonth() >= nowDate.getMonth() &&
      point.startDate.getFullYear() >= nowDate.getFullYear();
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


// Стоимость путешествия (раздел информации о путешествии)
export const createTripInfoCostTemplate = (events) => {
  const cost = events.slice().reduce((sum, item) => {
    return sum + item.price;
  }, 0);
  return (`
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
    `);
};

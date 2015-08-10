/*
 * action types
 */

export function setShops(shop) {
  return {
    type: 'SETSHOPS',
    shop
  };
}

export function weekIncrease(week) {
  return {
    type: 'WEEKINCREASE',
    week
  };
}

export function weekDecrease(week) {
  return {
    type: 'WEEKDECREASE',
    week
  };
}


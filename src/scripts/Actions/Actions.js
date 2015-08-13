/*
 * action types
 */

export function getApplicationSettings() {
  return {
    type: 'GETAPPLICATIONSETTINGS',
  };
}

export function setApplicationSettings(shop, city, country) {
  return {
    type: 'SETAPPLICATIONSETTINGS',
    shop,
    city,
    country
  };
}

export function setShops(shop) {
  return {
    type: 'SETSHOPS',
    shop
  };
}

export function getShops(shops) {
  return {
    type: 'GETSHOPS',
    shops
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


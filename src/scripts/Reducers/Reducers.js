import { SETSHOPS, GETSHOPS, WEEKINCREASE, WEEKDECREASE, GETAPPLICATIONSETTINGS } from '../Actions/Actions';

// Data
import applicationData from './Application.js';
import shopsData from './Shops.js';
import weeksData from './Weeks.js';

/**
 * Application
 */
export function application(state = applicationData, action) {
  let newState = {...state};

  switch (action.type) {

    case 'GETAPPLICATIONSETTINGS':
      return newState;

    case 'SETAPPLICATIONSETTINGS':
      newState.currentShop = action.shop;
      newState.currentCity = action.city;
      newState.currentCountry = action.country;
      return newState;

    default:
      return newState;
    }
}

/**
 * Shops
 */
export function shops(state = shopsData, action) {
  let newState = {...state};

  switch (action.type) {

    case 'SETSHOPS':
      newState.push(action.shop);
      return newState;

    default:
      return newState;
    }
}

/**
 * Weeks
 */
export function weeks(state = weeksData, action) {
  let newState = {...state};

  switch (action.type) {

    case 'WEEKINCREASE':
      newState.week = newState.week < 53 ? newState.week+1 : 1;
      return newState;

    case 'WEEKDECREASE':
      newState.week = newState.week >1 ? newState.week-1 : 53;
      return newState;

    default:
      return state;
    }
}

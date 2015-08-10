import { SETSHOPS } from '../Actions/Actions';
import shopsData from './Shops.js';

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
export function weeks(state = shopsData, action) {
  let newState = {...state};

  switch (action.type) {
  case 'WEEKINCREASE':
    newState.week++;
    return newState;
  case 'WEEKDECREASE':
    newState.week--;
    return newState;
  default:
    return state;
  }
}

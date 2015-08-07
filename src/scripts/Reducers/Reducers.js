import { GETSHOPS } from '../Actions/Actions';
import shopsData from './Shops.js';

export function shops(state = shopsData, action) {
  let newState = state;

  switch (action.type) {
  case GETSHOPS:
    return newState
  default:
    return state;
  }
}
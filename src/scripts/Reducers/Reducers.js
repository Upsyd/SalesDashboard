import { SETSHOPS } from '../Actions/Actions';
import shopsData from './Shops.js';

export function shops(state = shopsData, action) {
  let newState = state;

  switch (action.type) {
  case SETSHOPS:
    newState.push(action.shop);
    console.log(newState)
    return newState
  default:
    return state;
  }
}
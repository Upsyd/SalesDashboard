import { EXAMPLE } from '../Actions/Actions';

export function todos(state = [], action) {
  let newState = state;

  switch (action.type) {
  case EXAMPLE:
    return newState
  default:
    return state;
  }
}
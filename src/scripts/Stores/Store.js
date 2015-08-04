import { EXAMPLE } from '../Constants/ActionTypes';


let initialState = {
};

export default function store(state = initialState, action) {
  let newState = {...state};

  switch (action.type) {
    case EXAMPLE:
      return newState;

    default:
      return state;
  }
}

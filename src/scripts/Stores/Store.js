import Reflux from 'reflux';
import Actions from '../Actions/Actions.js';

var Store = Reflux.createStore({

  listenables: [Actions],

  data: {
    result: []
  },

  // ev(index) {
    // this.data.projects.splice(index, 1);
    // this.trigger(this.data);
  // },

  getInitialState() {
    return this.data;
  }
});

export default Store;

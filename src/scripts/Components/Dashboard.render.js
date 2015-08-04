import 'd3';
import _ from 'underscore';
import Helpers from '../Utils/helpers.js';
import ordersWidget from './Widgets/Performance/Performance.render.js';
import additionalServicesWidget from './Widgets/Performance/Performance.render.js';
import performanceWidget from './Widgets/Performance/Performance.render.js';

export default class Dashboard {
  widgets: []
  applyFilter(filterObj) {
    this.widgets.forEach(function(w) {
      w.filter(filterObj);
    });
  }
  update(transitionDuration) {
    this.widgets.forEach(function(w) {
      w.update(transitionDuration);
    });
  }
  createWidget(file, widgetFunction, filterObj) {
    var ssvParser = d3.dsv(";", "text/plain");
    ssvParser(file, widgetFunction);
  }
}

Dashboard.createWidget("CSV/Orders.csv", Dashboard.ordersWidget);
Dashboard.createWidget("CSV/AdditionalServices.csv", Dashboard.additionalServicesWidget);
Dashboard.createWidget("CSV/CustomerScore.csv", performanceWidget.performanceWidget);

d3.select(window).on('resize', function() {
  Dashboard.widgets.forEach(function(w) {
    w.update();
  });
});
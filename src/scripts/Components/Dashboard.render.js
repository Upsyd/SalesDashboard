import 'd3';
import _ from 'underscore';
import Papa from 'papaparse';
import Helpers from '../Utils/helpers.js';
import performanceWidget from './Widgets/Performance/Performance.render.js';
import ordersWidget from './Widgets/OrdersTable/OrdersTable.render.js';

Dashboard = {
  widgets: [],
  applyFilter: function(filterObj) {
    this.widgets.forEach(function(w) {
      w.filter(filterObj);
    });
  },
  update: function(transitionDuration) {
    this.widgets.forEach(function(w) {
      w.update(transitionDuration);
    });
  },
  createWidget: function(file, widgetFunction, filterObj) {
    // D3.js parser - slow
    // var ssvParser = d3.dsv(";", "text/plain");
    // ssvParser(file, widgetFunction);
    Papa.parse(file, {
      header: true,
      download: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: function(results) {
        widgetFunction( results.data, filterObj );
      },
      error: function(err) {
        console.log( err );
      }
    });

  },
  ordersWidget: function(data, filterObj) {
    var tableData = prepareData( data, filterObj );

    var rowsToHighlight = [
      { name: '% of',        color: 'red', criterion: highlightCriterion },
      { name: '% of (prev y.)',   color: 'red', criterion: highlightCriterion },
      { name: 'Target',      color: 'orange', criterion: function() { return true; } },
      { name: 'Target (prev y.)', color: 'orange', criterion: function() { return true; } }
    ];

    var cellWidths = { 
      'Product'     : '24%',
      'Orders'      : '16%',
      '% of'        : '12%',
      'Target'      : '16%',
      '% of (prev y.)'   : '16%',
      'Target (prev y.)' : '16%' 
    };

    var selection = d3.select('#Orders');
    var table = ordersWidget.tableChart().title('Orders').footer(tableData[1]).tdWidths( cellWidths ).highlightRows( rowsToHighlight )( selection.datum( tableData[0] ) );


    Dashboard.widgets.push({
      type: "DataTable",
      name: "Orders",
      obj:   table,
      selection: selection,
      rawData: data,
      preparedData: tableData,
      title: function( title ) { this.obj.title( title ); },
      // data: function( data ) { this.rawData = data; this.preparedData = prepareData( this.rawData ); this.selection.datum( this.preparedData[0] ); this.obj.footer( preparedData[1] ); },
      // filter: function( filterObj ) {},
      filter: function( filterObj ) { this.preparedData = prepareData( this.rawData, filterObj ); this.selection.datum( this.preparedData[0] ); this.obj.footer( this.preparedData[1] ); },
      update: function( transitionDuration ) { this.obj.update( transitionDuration ); }
    });

    function prepareData( data, filterObj ) {
      var filterObj = filterObj ? filterObj : {};
      var dataFiltered = Helpers.filterData( data, filterObj );

      console.log( filterObj.Year );
      var newFilterObj = {};
      Object.assign( newFilterObj, filterObj );
      newFilterObj.Year--;
      var dataFilteredPY = Helpers.filterData( data, newFilterObj );
      console.log( dataFilteredPY, newFilterObj );

      // dataFiltered.forEach( function(d){
      //   d.Year            = +d.Year;
      //   d.Week            = +d.Week;
      //   d.Ordersnum       = +d.Ordersnum;
      //   d.Orderstargetnum = +d.Orderstargetnum;
      // });

      calcAdditionalOrdersData( dataFiltered, dataFilteredPY ); // For previous Year
      
      var dataGrouped  =  _.groupBy( dataFiltered, 'Product' );
      // console.log( 'dataGrouped: ', dataGrouped );

      var dataReduced = [];
      for ( var key in  dataGrouped ) {
        dataReduced.push({
          'Product'          : key,
          'Ordersnum'        : d3.sum( dataGrouped[key], function(d) { return Helpers.isNumber(d.Ordersnum) ? d.Ordersnum : 0; } ),
          'Orderstargetnum'  : d3.sum( dataGrouped[key], function(d) { return Helpers.isNumber(d.Orderstargetnum) ? d.Orderstargetnum : 0; } ),
          'Orderstargetnumprev'  : d3.sum( dataGrouped[key], function(d) { return Helpers.isNumber(d.Orderstargetnumprev) ? d.Orderstargetnumprev : 0; } ),
        });
      }


      // console.log( 'Data reduces: ', dataReduced );
      var bodyData = _.map( dataReduced, function(d) { 
        return  {
          // 'Location': d.Orglevel1 + ' ' + d.Orglevel2 + ' ' + d.Orglevel3,
          'Product'    :  d.Product,
          'Orders'     :  d.Ordersnum,
          '% of'       :  Helpers.isNumber( d.Ordersnum / d.Orderstargetnum ) ? Helpers.formatValue(+d.Ordersnum / d.Orderstargetnum * 100) + '%' : '',
          'Target'     :  d.Orderstargetnum,
          '% of (prev y.)'  :  Helpers.isNumber( d.Ordersnum / d.Orderstargetnumprev ) ? Helpers.formatValue(+d.Ordersnum / d.Orderstargetnumprev * 100) + '%' : '',
          'Target (prev y.)':  Helpers.isNumber( d.Orderstargetnumprev ) && (d.Orderstargetnumprev !== 0) ? +d.Orderstargetnumprev : ''
        }
      });

      var footerData = {
        'Product': 'TOTAL',
        'Orders': null,
        '% of': null,
        'Target': null,
        '% of (prev y.)': null,
        'Target (prev y.)': null
      };
      var ordersTotal   = d3.sum( dataReduced, function(d) { return d.Ordersnum; } ),
        targetTotal   = d3.sum( dataReduced, function(d) { return d.Orderstargetnum; } ),
        targetTotalPY = d3.sum( dataReduced, function(d) { return d.Orderstargetnumprev; } );
      footerData['Orders']      = ordersTotal === 0 ? '' : ordersTotal;
      footerData['Target']      = targetTotal === 0 ? '' : targetTotal;
      footerData['Target (prev y.)'] = targetTotalPY === 0 ? '' : targetTotalPY;
      footerData['% of']        = Helpers.isNumber( ordersTotal / targetTotal ) ? Helpers.formatValue( ordersTotal / targetTotal * 100 ) + '%' : '';
      footerData['% of (prev y.)']   = Helpers.isNumber( ordersTotal / targetTotalPY ) ? Helpers.formatValue( ordersTotal / targetTotalPY * 100 ) + '%' : '';

      return [ bodyData, footerData ];

    }

    function highlightCriterion(d) {
      return parseFloat(d) < 100;
    }

    function calcAdditionalOrdersData(dataFiltered, data) {
      _.each(dataFiltered, function(d, i) {
        var prevYearElement = _.findWhere(data, {
          Year: d.Year - 1,
          Week: d.Week,
          Product: d.Product,
          Orglevel1: d.Orglevel1,
          Orglevel2: d.Orglevel2,
          Orglevel3: d.Orglevel3
        });

        if (prevYearElement) {
          d.Orderstargetnumprev = prevYearElement.Orderstargetnum;
        } else {
          d.Orderstargetnumprev = null;
        }
      });
    }
  },
  additionalServicesWidget: function(data, filterObj) {
    var tableData = prepareData(data);
    
    var cellWidths = { 
      'Product': '28%',
      'A %': '12%',
      'B %': '12%',
      'C %': '12%',
      'D %': '12%',
      'E %': '12%',
      'F %': '12%'
    };

    var selection = d3.select('#AdditionalServices');
    var table = ordersWidget.tableChart().title('Additional Services').tdWidths( cellWidths ).footer(tableData[1])(selection.datum(tableData[0]));

    Dashboard.widgets.push({
      type: "DataTable",
      name: "AdditionalServices",
      obj:   table,
      selection: selection,
      rawData: data,
      preparedData: tableData,
      title: function( title ) { this.obj.title( title ); },
      // data: function( data ) { this.rawData = data; this.preparedData = prepareData( this.rawData ); this.selection.datum( this.preparedData[0] ); this.obj.footer( preparedData[1] ); },
      // filter: function( filterObj ) {},
      filter: function( filterObj ) { this.preparedData = prepareData( this.rawData, filterObj ); this.selection.datum( this.preparedData[0] ); this.obj.footer( this.preparedData[1] ); },
      update: function( transitionDuration ) { this.obj.update( transitionDuration ); }
    });

    function prepareData(data, filterObj) {
      var filterObj = filterObj ? filterObj : {};
      var dataFiltered = Helpers.filterData(data, filterObj);
      var dataGrouped = _.groupBy(dataFiltered, 'Product');

      var dataReduced = [];
      for (var key in dataGrouped) {
        dataReduced.push({
          'Product': key,
          'OrdersNumA': d3.sum(dataGrouped[key], function(d) {
            return Helpers.isNumber(d.OrdersNumA) ? d.OrdersNumA : 0;
          }),
          'ServicesNumA': d3.sum(dataGrouped[key], function(d) {
            return Helpers.isNumber(d.ServicesNumA) ? d.ServicesNumA : 0;
          }),
          'ServicesNumB': d3.sum(dataGrouped[key], function(d) {
            return Helpers.isNumber(d.ServicesNumB) ? d.ServicesNumB : 0;
          }),
          'ServicesNumC': d3.sum(dataGrouped[key], function(d) {
            return Helpers.isNumber(d.ServicesNumC) ? d.ServicesNumC : 0;
          }),
          'ServicesNumD': d3.sum(dataGrouped[key], function(d) {
            return Helpers.isNumber(d.ServicesNumD) ? d.ServicesNumD : 0;
          }),
          'ServicesNumE': d3.sum(dataGrouped[key], function(d) {
            return Helpers.isNumber(d.ServicesNumE) ? d.ServicesNumE : 0;
          }),
          'ServicesNumF': d3.sum(dataGrouped[key], function(d) {
            return Helpers.isNumber(d.ServicesNumF) ? d.ServicesNumF : 0;
          })
        });
      }

      var bodyData = _.map(dataReduced, function(d) {
        return {
          // 'Location': d.Orglevel1 + ' ' + d.Orglevel2 + ' ' + d.Orglevel3,
          'Product': d.Product,
          'A %': Helpers.isNumber(+d.OrdersNumA / d.ServicesNumA) ?Helpers.formatValue(+d.OrdersNumA / d.ServicesNumA * 100) + '%' : '',
          'B %': Helpers.isNumber(+d.OrdersNumA / d.ServicesNumB) ?Helpers.formatValue(+d.OrdersNumA / d.ServicesNumB * 100) + '%' : '',
          'C %': Helpers.isNumber(+d.OrdersNumA / d.ServicesNumC) ?Helpers.formatValue(+d.OrdersNumA / d.ServicesNumC * 100) + '%' : '',
          'D %': Helpers.isNumber(+d.OrdersNumA / d.ServicesNumD) ?Helpers.formatValue(+d.OrdersNumA / d.ServicesNumD * 100) + '%' : '',
          'E %': Helpers.isNumber(+d.OrdersNumA / d.ServicesNumE) ?Helpers.formatValue(+d.OrdersNumA / d.ServicesNumE * 100) + '%' : '',
          'F %': Helpers.isNumber(+d.OrdersNumA / d.ServicesNumF) ?Helpers.formatValue(+d.OrdersNumA / d.ServicesNumF * 100) + '%' : ''
        }
      });

      var footerData = {
        'Product': 'TOTAL',
        'A %': null,
        'B %': null,
        'C %': null,
        'D %': null,
        'E %': null,
        'F %': null
      };
      var sumOrdersNumA = d3.sum(dataReduced, function(d) {
        return +d.OrdersNumA;
      });
      var sumServicesNumA = d3.sum(dataReduced, function(d) {
        return +d.ServicesNumA;
      });
      footerData['A %'] = Helpers.isNumber(sumOrdersNumA / sumServicesNumA) ?Helpers.formatValue(sumOrdersNumA / sumServicesNumA * 100) + '%' : '';
      var sumServicesNumB = d3.sum(dataReduced, function(d) {
        return +d.ServicesNumB;
      });
      footerData['B %'] = Helpers.isNumber(sumOrdersNumA / sumServicesNumB) ?Helpers.formatValue(sumOrdersNumA / sumServicesNumB * 100) + '%' : '';
      var sumServicesNumC = d3.sum(dataReduced, function(d) {
        return +d.ServicesNumC;
      });
      footerData['C %'] = Helpers.isNumber(sumOrdersNumA / sumServicesNumC) ?Helpers.formatValue(sumOrdersNumA / sumServicesNumC * 100) + '%' : '';
      var sumServicesNumD = d3.sum(dataReduced, function(d) {
        return +d.ServicesNumD;
      });
      footerData['D %'] = Helpers.isNumber(sumOrdersNumA / sumServicesNumD) ?Helpers.formatValue(sumOrdersNumA / sumServicesNumD * 100) + '%' : '';
      var sumServicesNumE = d3.sum(dataReduced, function(d) {
        return +d.ServicesNumE;
      });
      footerData['E %'] = Helpers.isNumber(sumOrdersNumA / sumServicesNumE) ?Helpers.formatValue(sumOrdersNumA / sumServicesNumE * 100) + '%' : '';
      var sumServicesNumF = d3.sum(dataReduced, function(d) {
        return +d.ServicesNumF;
      });
      footerData['F %'] = Helpers.isNumber(sumOrdersNumA / sumServicesNumF) ?Helpers.formatValue(sumOrdersNumA / sumServicesNumF * 100) + '%' : '';

      return [bodyData, footerData];
    }
  },
}
Dashboard.createWidget("CSV/OrdersPrevYear.csv", Dashboard.ordersWidget, {Year: 2015, Week: 17} );
Dashboard.createWidget("CSV/AdditionalServices.csv", Dashboard.additionalServicesWidget, {Year: 2015, Week: 17});
Dashboard.createWidget("CSV/CustomerScore.csv", performanceWidget.render, {Year: 2015, Week: 17} );

d3.select(window).on('resize', function() {
  Dashboard.widgets.forEach(function(w) {
    w.update();
  });
});

module.exports = Dashboard;
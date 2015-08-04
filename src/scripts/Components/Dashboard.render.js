import 'd3';
import _ from 'underscore';
import Helpers from '../Utils/helpers.js';
import performanceWidget from './Widgets/Performance/Performance.render.js';

var Dashboard = {
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
    var ssvParser = d3.dsv(";", "text/plain");
    ssvParser(file, widgetFunction);
  },
  // ordersWidget : function( data ) {
  //   var tableData = prepareData( data );

  //   var rowsToHighlight = [
  //     { name: '% of',        color: 'red', criterion: highlightCriterion },
  //     { name: '% of (PY)',   color: 'red', criterion: highlightCriterion },
  //     { name: 'Target',      color: 'orange', criterion: function() { return true; } },
  //     { name: 'Target (PY)', color: 'orange', criterion: function() { return true; } }
  //   ];

  //   var cellWidths = {
  //     'Product'     : '20%',
  //     'Orders'      : '16%',
  //     '% of'        : '16%',
  //     'Target'      : '16%',
  //     '% of (PY)'   : '16%',
  //     'Target (PY)' : '16%'
  //   };

  //   var selection = d3.select('#Orders');
  //   var table = tableChart().title('Orders').footer(tableData[1]).tdWidths( cellWidths ).highlightRows( rowsToHighlight )( selection.datum( tableData[0] ) );

  //   Dashboard.widgets.push({
  //     type: "DataTable",
  //     name: "Orders",
  //     obj:   table,
  //     selection: selection,
  //     rawData: data,
  //     preparedData: tableData,
  //     title: function( title ) { this.obj.title( title ); },
  //     // data: function( data ) { this.rawData = data; this.preparedData = prepareData( this.rawData ); this.selection.datum( this.preparedData[0] ); this.obj.footer( preparedData[1] ); },
  //     filter: function( filterObj ) { this.preparedData = prepareData( this.rawData ); this.selection.datum( this.preparedData[0] ); this.obj.footer( preparedData[1] ); },
  //     update: function( transitionDuration ) { this.obj.update( transitionDuration ); }
  //   });

  //   function prepareData( data, filterObj ) {
  //     var filterObj = filterObj ? filterObj : {};
  //     var dataFiltered = filterData( data, filterObj );
  //     calcAdditionalOrdersData( dataFiltered, data ); // For previous Year

  //     var dataGrouped  =  _.groupBy( dataFiltered, 'Product' );

  //     var dataReduced = [];
  //     for ( var key in  dataGrouped ) {
  //       dataReduced.push({
  //         'Product'          : key,
  //         'Ordersnum'        : d3.sum( dataGrouped[key], function(d) { return isNumber(d.Ordersnum) ? d.Ordersnum : 0; } ),
  //         'Orderstargetnum'  : d3.sum( dataGrouped[key], function(d) { return isNumber(d.Orderstargetnum) ? d.Orderstargetnum : 0; } ),
  //         'Orderstargetnumprev'  : d3.sum( dataGrouped[key], function(d) { return isNumber(d.Orderstargetnumprev) ? d.Orderstargetnumprev : 0; } ),
  //       });
  //     }

  //     var bodyData = _.map( dataReduced, function(d) {
  //       return  {
  //         // 'Location': d.Orglevel1 + ' ' + d.Orglevel2 + ' ' + d.Orglevel3,
  //         'Product'    :  d.Product,
  //         'Orders'     : +d.Ordersnum,
  //         '% of'       :  isNumber( +d.Ordersnum / d.Orderstargetnum ) ? formatValue(+d.Ordersnum / d.Orderstargetnum * 100) + '%' : '',
  //         'Target'     : +d.Orderstargetnum,
  //         '% of (PY)'  :  isNumber( +d.Ordersnum / d.Orderstargetnumprev ) ? formatValue(+d.Ordersnum / d.Orderstargetnumprev * 100) + '%' : '',
  //         'Target (PY)':  isNumber( d.Orderstargetnumprev ) ? +d.Orderstargetnumprev : ''
  //       }
  //     });

  //     var footerData = {
  //       'Product': 'TOTAL',
  //       'Orders': null,
  //       '% of': null,
  //       'Target': null,
  //       '% of (PY)': null,
  //       'Target (PY)': null
  //     };
  //     footerData['Orders']      = d3.sum( dataReduced, function(d) { return +d.Ordersnum; } );
  //     footerData['Target']      = d3.sum( dataReduced, function(d) { return +d.Orderstargetnum; } );
  //     footerData['Target (PY)'] = d3.sum( dataReduced, function(d) { return +d.Orderstargetnumprev; } );
  //     footerData['% of']        = isNumber( footerData['Orders'] / footerData['Target'] ) ? formatValue( footerData['Orders'] / footerData['Target'] * 100 ) + '%' : '';
  //     footerData['% of (PY)']   = isNumber( footerData['Orders'] / footerData['Target (PY)'] ) ? formatValue( footerData['Orders'] / footerData['Target (PY)'] * 100 ) + '%' : '';

  //     return [ bodyData, footerData ];

  //   }

  //   function highlightCriterion( d ) {
  //     return parseFloat(d) < 100;
  //   }

  //   function calcAdditionalOrdersData( dataFiltered, data ) {
  //     _.each( dataFiltered, function( d, i ) {
  //       var prevYearElement = _.findWhere( data, {
  //         Year: d.Year-1,
  //         Week: d.Week,
  //         Product: d.Product,
  //         Orglevel1: d.Orglevel1,
  //         Orglevel2: d.Orglevel2,
  //         Orglevel3: d.Orglevel3
  //       });

  //       if ( prevYearElement ) {
  //         d.Orderstargetnumprev = prevYearElement.Orderstargetnum;
  //       } else {
  //         d.Orderstargetnumprev = null;
  //       }
  //     });
  //   }
  // },
  // additionalServicesWidget : function( data ) {
  //   var tableData = prepareData( data );

  //   var selection = d3.select('#AdditionalServices');
  //   var table = tableChart().title('Additional Services').footer(tableData[1])( selection.datum( tableData[0] ) );

  //   Dashboard.widgets.push({
  //     type: "DataTable",
  //     name: "AdditionalServices",
  //     obj:   table,
  //     selection: selection,
  //     rawData: data,
  //     preparedData: tableData,
  //     title: function( title ) { this.obj.title( title ); },
  //     // data: function( data ) { this.rawData = data; this.preparedData = prepareData( this.rawData ); this.selection.datum( this.preparedData[0] ); this.obj.footer( preparedData[1] ); },
  //     filter: function( filterObj ) { this.preparedData = prepareData( this.rawData ); this.selection.datum( this.preparedData[0] ); this.obj.footer( preparedData[1] ); },
  //     update: function( transitionDuration ) { this.obj.update( transitionDuration ); }
  //   });

  //   function prepareData( data, filterObj ) {
  //     var filterObj = filterObj ? filterObj : {};
  //     var dataFiltered = filterData( data, filterObj );
  //     var dataGrouped  =  _.groupBy( dataFiltered, 'Product' );

  //     var dataReduced = [];
  //     for ( var key in  dataGrouped ) {
  //       dataReduced.push({
  //         'Product'          : key,
  //         'OrdersNumA'        : d3.sum( dataGrouped[key], function(d) { return isNumber(d.OrdersNumA) ? d.OrdersNumA : 0; } ),
  //         'ServicesNumA'      : d3.sum( dataGrouped[key], function(d) { return isNumber(d.ServicesNumA) ? d.ServicesNumA : 0; } ),
  //         'ServicesNumB'      : d3.sum( dataGrouped[key], function(d) { return isNumber(d.ServicesNumB) ? d.ServicesNumB : 0; } ),
  //         'ServicesNumC'      : d3.sum( dataGrouped[key], function(d) { return isNumber(d.ServicesNumC) ? d.ServicesNumC : 0; } ),
  //         'ServicesNumD'      : d3.sum( dataGrouped[key], function(d) { return isNumber(d.ServicesNumD) ? d.ServicesNumD : 0; } ),
  //         'ServicesNumE'      : d3.sum( dataGrouped[key], function(d) { return isNumber(d.ServicesNumE) ? d.ServicesNumE : 0; } ),
  //         'ServicesNumF'      : d3.sum( dataGrouped[key], function(d) { return isNumber(d.ServicesNumF) ? d.ServicesNumF : 0; } )
  //       });
  //     }

  //     var bodyData = _.map( dataReduced, function(d) {
  //       return  {
  //         // 'Location': d.Orglevel1 + ' ' + d.Orglevel2 + ' ' + d.Orglevel3,
  //         'Product'   :  d.Product,
  //         'A %'       :  isNumber( +d.OrdersNumA / d.ServicesNumA ) ? formatValue(+d.OrdersNumA / d.ServicesNumA * 100) + '%' : '',
  //         'B %'       :  isNumber( +d.OrdersNumA / d.ServicesNumB ) ? formatValue(+d.OrdersNumA / d.ServicesNumB * 100) + '%' : '',
  //         'C %'       :  isNumber( +d.OrdersNumA / d.ServicesNumC ) ? formatValue(+d.OrdersNumA / d.ServicesNumC * 100) + '%' : '',
  //         'D %'       :  isNumber( +d.OrdersNumA / d.ServicesNumD ) ? formatValue(+d.OrdersNumA / d.ServicesNumD * 100) + '%' : '',
  //         'E %'       :  isNumber( +d.OrdersNumA / d.ServicesNumE ) ? formatValue(+d.OrdersNumA / d.ServicesNumE * 100) + '%' : '',
  //         'F %'       :  isNumber( +d.OrdersNumA / d.ServicesNumF ) ? formatValue(+d.OrdersNumA / d.ServicesNumF * 100) + '%' : ''
  //       }
  //     });

  //     var footerData = {
  //       'Product': 'TOTAL',
  //       'A %': null,
  //       'B %': null,
  //       'C %': null,
  //       'D %': null,
  //       'E %': null,
  //       'F %': null
  //     };
  //     sumOrdersNumA     = d3.sum( dataReduced, function(d) { return +d.OrdersNumA; } );
  //     sumServicesNumA   = d3.sum( dataReduced, function(d) { return +d.ServicesNumA; } );
  //     footerData['A %'] = isNumber( sumOrdersNumA / sumServicesNumA ) ? formatValue( sumOrdersNumA / sumServicesNumA * 100 ) + '%' : '';
  //     sumServicesNumB   = d3.sum( dataReduced, function(d) { return +d.ServicesNumB; } );
  //     footerData['B %'] = isNumber( sumOrdersNumA / sumServicesNumB ) ? formatValue( sumOrdersNumA / sumServicesNumB * 100 ) + '%' : '';
  //     sumServicesNumC   = d3.sum( dataReduced, function(d) { return +d.ServicesNumC; } );
  //     footerData['C %'] = isNumber( sumOrdersNumA / sumServicesNumC ) ? formatValue( sumOrdersNumA / sumServicesNumC * 100 ) + '%' : '';
  //     sumServicesNumD   = d3.sum( dataReduced, function(d) { return +d.ServicesNumD; } );
  //     footerData['D %'] = isNumber( sumOrdersNumA / sumServicesNumD ) ? formatValue( sumOrdersNumA / sumServicesNumD * 100 ) + '%' : '';
  //     sumServicesNumE   = d3.sum( dataReduced, function(d) { return +d.ServicesNumE; } );
  //     footerData['E %'] = isNumber( sumOrdersNumA / sumServicesNumE ) ? formatValue( sumOrdersNumA / sumServicesNumE * 100 ) + '%' : '';
  //     sumServicesNumF   = d3.sum( dataReduced, function(d) { return +d.ServicesNumF; } );
  //     footerData['F %'] = isNumber( sumOrdersNumA / sumServicesNumF ) ? formatValue( sumOrdersNumA / sumServicesNumF * 100 ) + '%' : '';

  //     return [ bodyData, footerData ];
  //   }
  // },
  performanceWidget: function(data) {
    var chartData = prepareData(data);

    var colorMap = {
      "Measure1": "red",
      "Measure2": "blue",
      "Target": "orange"
    };

    var selection = d3.select('#Performance');
    var chart = performanceWidget.lineChart().title('Performance').palette(colorMap)(selection.datum(chartData));

    Dashboard.widgets.push({
      type: "LineChart",
      name: "Performance",
      obj: chart,
      selection: selection,
      rawData: data,
      preparedData: chartData,
      title: function(title) {
        this.obj.title(title);
      },
      // data: function( data ) { this.rawData = data; this.preparedData = prepareData( this.rawData ); this.selection.datum( this.preparedData ); },
      filter: function(filterObj) {
        this.preparedData = prepareData(this.rawData);
        this.selection.datum(this.preparedData);
      },
      update: function(transitionDuration) {
        this.obj.update(transitionDuration);
      }
    });

    function prepareData(data, filterObj) {
      var filterObj = filterObj ? filterObj : {};
      var dataFiltered = Helpers.filterData(data, filterObj);

      // Parse Date
      var format = d3.time.format('%Y-%m-%d');
      dataFiltered.forEach(function(d) {
        d.Date = format.parse(d.Date);
        d.Measure1 = parseFloat(d.Measure1);
        d.Measure2 = parseFloat(d.Measure2);
        d.Target = parseFloat(d.Target);
      });

      // Date Filter
      dataFiltered = _.filter(dataFiltered, function(d) {
        return d.Date > format.parse('2015-04-30') - 90 * 86400000;
      });

      var dataGrouped = _.groupBy(dataFiltered, 'Date');
      // console.log( "Data Grouped:", dataGrouped );

      var dataReduced = [];
      for (var key in dataGrouped) {
        dataReduced.push({
          'Date': new Date(key),
          'Measure1': d3.mean(dataGrouped[key], function(d) {
            return Helpers.isNumber(d.Measure1) ? d.Measure1 : 0;
          }),
          'Measure2': d3.mean(dataGrouped[key], function(d) {
            return Helpers.isNumber(d.Measure2) ? d.Measure2 : 0;
          }),
          'Target': d3.mean(dataGrouped[key], function(d) {
            return Helpers.isNumber(d.Target) ? d.Target : 0;
          })
        });
      }
      // console.log( "Data Reduced:", dataReduced );

      var chartData = _.reduce(dataReduced, function(memo, item) {
        var measure1Arr = _.chain(memo[0]).push(Helpers.renameProperty(_.pick(item, ['Date', 'Measure1']), 'Measure1', 'value')).value();
        var measure2Arr = _.chain(memo[1]).push(Helpers.renameProperty(_.pick(item, ['Date', 'Measure2']), 'Measure2', 'value')).value();
        var targetArr = _.chain(memo[2]).push(Helpers.renameProperty(_.pick(item, ['Date', 'Target']), 'Target', 'value')).value();

        return [measure1Arr, measure2Arr, targetArr];
      }, [
        [],
        [],
        []
      ]);
      // console.log( "Chart Data:",  chartData );

      return chartData;
    }
  }
}

// Dashboard.createWidget("CSV/Orders.csv", Dashboard.ordersWidget );
// Dashboard.createWidget("CSV/AdditionalServices.csv", Dashboard.additionalServicesWidget );

Dashboard.createWidget("CSV/CustomerScore.csv", Dashboard.performanceWidget);

d3.select(window).on('resize', function() {
  Dashboard.widgets.forEach(function(w) {
    w.update();
  });
});
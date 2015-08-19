import 'd3';
import _ from 'underscore';
import Papa from 'papaparse';
import Helpers from '../Utils/helpers.js';
import performanceWidget from './Widgets/Performance/Performance.render.js';
import ordersWidget from './Widgets/OrdersTable/OrdersTable.render.js';

let Dashboard = {
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
    var start = performance.now();
    Papa.parse(file, {
      header: true,
      download: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: function(results) {
        var end = performance.now();
        console.log( file, '. Parsing done in: ', end-start, ' ms' );
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

      var newFilterObj = {};
      Object.assign( newFilterObj, filterObj );
      newFilterObj.Year--;
      var dataFilteredPY = Helpers.filterData( data, newFilterObj );

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
          'Product'              : key,
          'Ordersnum'            : d3.sum( dataGrouped[key], function(d) { return Helpers.isNumber(d.Ordersnum) ? d.Ordersnum : 0; } ),
          'Orderstargetnum'      : d3.sum( dataGrouped[key], function(d) { return Helpers.isNumber(d.Orderstargetnum) ? d.Orderstargetnum : 0; } ),
          'Orderstargetnumprev'  : d3.sum( dataGrouped[key], function(d) { return Helpers.isNumber(d.Orderstargetnumprev) ? d.Orderstargetnumprev : 0; } ),
          'Ordersnumprev'        : d3.sum( dataGrouped[key], function(d) { return Helpers.isNumber(d.Ordersnumprev) ? d.Ordersnumprev : 0; } )
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
          '% of (prev y.)'  :  Helpers.isNumber( d.Ordersnum / d.Ordersnumprev ) ? Helpers.formatValue(+d.Ordersnum / d.Ordersnumprev * 100) + '%' : '',
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
        ordersTotalPY   = d3.sum( dataReduced, function(d) { return d.Ordersnumprev; } ),
        targetTotal     = d3.sum( dataReduced, function(d) { return d.Orderstargetnum; } ),
        targetTotalPY   = d3.sum( dataReduced, function(d) { return d.Orderstargetnumprev; } );
      footerData['Orders']      = ordersTotal === 0 ? '' : ordersTotal;
      footerData['Target']      = targetTotal === 0 ? '' : targetTotal;
      footerData['Target (prev y.)'] = targetTotalPY === 0 ? '' : targetTotalPY;
      footerData['% of']        = Helpers.isNumber( ordersTotal / targetTotal ) ? Helpers.formatValue( ordersTotal / targetTotal * 100 ) + '%' : '';
      footerData['% of (prev y.)']   = Helpers.isNumber( ordersTotal / ordersTotalPY ) ? Helpers.formatValue( ordersTotal / ordersTotalPY * 100 ) + '%' : '';

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
          d.Ordersnumprev       = prevYearElement.Ordersnum;
        } else {
          d.Orderstargetnumprev = null;
          d.Ordersnumprev       = null;
        }
      });
    }
  },
  additionalServicesWidget: function(data, filterObj) {
    var tableData = prepareData(data);
    
    var cellWidths = { 
      'Product': '22%',
      'A %': '13%',
      'B %': '13%',
      'C %': '13%',
      'D %': '13%',
      'E %': '13%',
      'F %': '13%'
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
          'A %': Helpers.isNumber( d.ServicesNumA / d.OrdersNumA ) ? Helpers.formatValue( d.ServicesNumA / d.OrdersNumA * 100) + '%' : '',
          'B %': Helpers.isNumber( d.ServicesNumB / d.OrdersNumA ) ? Helpers.formatValue( d.ServicesNumB / d.OrdersNumA * 100) + '%' : '',
          'C %': Helpers.isNumber( d.ServicesNumC / d.OrdersNumA ) ? Helpers.formatValue( d.ServicesNumC / d.OrdersNumA * 100) + '%' : '',
          'D %': Helpers.isNumber( d.ServicesNumD / d.OrdersNumA ) ? Helpers.formatValue( d.ServicesNumD / d.OrdersNumA * 100) + '%' : '',
          'E %': Helpers.isNumber( d.ServicesNumE / d.OrdersNumA ) ? Helpers.formatValue( d.ServicesNumE / d.OrdersNumA * 100) + '%' : '',
          'F %': Helpers.isNumber( d.ServicesNumF / d.OrdersNumA ) ? Helpers.formatValue( d.ServicesNumF / d.OrdersNumA * 100) + '%' : ''
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
      footerData['A %'] = Helpers.isNumber( sumServicesNumA / sumOrdersNumA ) ? Helpers.formatValue( sumServicesNumA / sumOrdersNumA * 100) + '%' : '';
      var sumServicesNumB = d3.sum(dataReduced, function(d) {
        return +d.ServicesNumB;
      });
      footerData['B %'] = Helpers.isNumber( sumServicesNumB / sumOrdersNumA ) ? Helpers.formatValue( sumServicesNumB / sumOrdersNumA * 100) + '%' : '';
      var sumServicesNumC = d3.sum(dataReduced, function(d) {
        return +d.ServicesNumC;
      });
      footerData['C %'] = Helpers.isNumber( sumServicesNumC / sumOrdersNumA ) ? Helpers.formatValue( sumServicesNumC / sumOrdersNumA * 100) + '%' : '';
      var sumServicesNumD = d3.sum(dataReduced, function(d) {
        return +d.ServicesNumD;
      });
      footerData['D %'] = Helpers.isNumber( sumServicesNumD / sumOrdersNumA ) ? Helpers.formatValue( sumServicesNumD / sumOrdersNumA * 100) + '%' : '';
      var sumServicesNumE = d3.sum(dataReduced, function(d) {
        return +d.ServicesNumE;
      });
      footerData['E %'] = Helpers.isNumber( sumServicesNumE / sumOrdersNumA ) ? Helpers.formatValue( sumServicesNumE / sumOrdersNumA * 100) + '%' : '';
      var sumServicesNumF = d3.sum(dataReduced, function(d) {
        return +d.ServicesNumF;
      });
      footerData['F %'] = Helpers.isNumber( sumServicesNumF / sumOrdersNumA ) ? Helpers.formatValue( sumServicesNumF / sumOrdersNumA * 100) + '%' : '';

      return [bodyData, footerData];
    }
  },
  performanceWidget: function(data, filterObj) {
    // Parse Date
    var format = d3.time.format('%Y-%m-%d'); 
    data.forEach( function(d){
      d.Date     = format.parse( d.Date );
      d.Measure1 = parseFloat( d.Measure1 );
      d.Measure2 = parseFloat( d.Measure2 );
      d.Target   = parseFloat( d.Target );
    });

    var chartData = prepareData( data, filterObj );

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
      obj:   chart,
      selection: selection,
      rawData: data,
      preparedData: chartData,
      title: function( title ) { this.obj.title( title ); },
      // data: function( data ) { this.rawData = data; this.preparedData = prepareData( this.rawData ); this.selection.datum( this.preparedData ); },
      // filter: function( filterObj ) {},
      filter: function( filterObj ) { this.preparedData = prepareData( this.rawData, filterObj ); this.selection.datum( this.preparedData ); },
      update: function( transitionDuration ) { this.obj.update( transitionDuration ); }
    });

    function prepareData( data, filterObj ) {
      var filterObj = filterObj ? filterObj : {};

      var newFilterObj = {};
      Object.assign( newFilterObj, filterObj );

      if ( !newFilterObj.hasOwnProperty( 'Orglevel2' ) && !newFilterObj.hasOwnProperty( 'Orglevel3' ) && newFilterObj.hasOwnProperty( 'Orglevel1' ) ) {
        newFilterObj[ 'Orglevel2' ] = newFilterObj[ 'Orglevel1' ];
        newFilterObj[ 'Orglevel3' ] = newFilterObj[ 'Orglevel1' ];
      } 

      if ( !newFilterObj.hasOwnProperty( 'Orglevel1' ) && !newFilterObj.hasOwnProperty( 'Orglevel3' ) && newFilterObj.hasOwnProperty( 'Orglevel2' ) ) {
        newFilterObj[ 'Orglevel3' ] = newFilterObj[ 'Orglevel2' ];
      } 

      var year, week;
      if ( newFilterObj.hasOwnProperty('Year') ){
        year = +newFilterObj.Year;
        delete newFilterObj.Year;
      }
      if ( newFilterObj.hasOwnProperty('Week') ){
        week = +newFilterObj.Week;
        delete newFilterObj.Week;
      }

      var dataFiltered = Helpers.filterData( data, newFilterObj );

      var formatYW = d3.time.format('%Y-%W-%w'); 
      var date = ( year && week )? formatYW.parse(year + '-' + (week+1) + '-0' ) : new Date();

      // console.log( year, week );
      // Date Filter
      dataFiltered = _.filter( dataFiltered, function(d) { 
        return (d.Date > date - 90 * 86400000) && ( d.Date < date );
      });
      if ( !dataFiltered ) return;
      var dataGrouped  =  _.groupBy( dataFiltered, 'Date' );
      // console.log( "Data Grouped:", dataGrouped );

      var dataReduced = [];
      for ( var key in  dataGrouped ) {
        dataReduced.push({
          'Date'        : new Date( key ),
          'Measure1'    : d3.mean( dataGrouped[key], function(d) { return Helpers.isNumber(d.Measure1) ? d.Measure1 : 0; } ),
          'Measure2'    : d3.mean( dataGrouped[key], function(d) { return Helpers.isNumber(d.Measure2) ? d.Measure2 : 0; } ),
          'Target'      : d3.mean( dataGrouped[key], function(d) { return Helpers.isNumber(d.Target) ? d.Target : 0; } )
        });
      }
      // console.log( "Data Reduced:", dataReduced );

      var chartData = _.reduce( dataReduced, function(memo, item){
        var measure1Arr  = _.chain( memo[0] ).push( Helpers.renameProperty( _.pick( item, ['Date', 'Measure1'] ), 'Measure1', 'value') ).value();
        var measure2Arr  = _.chain( memo[1] ).push( Helpers.renameProperty( _.pick( item, ['Date', 'Measure2'] ), 'Measure2', 'value') ).value();
        var targetArr    = _.chain( memo[2] ).push( Helpers.renameProperty( _.pick( item, ['Date', 'Target'] ), 'Target', 'value') ).value();

        return [ measure1Arr, measure2Arr, targetArr ];
      }, [ [], [], [] ]);
      // console.log( "Chart Data:",  chartData );

      return chartData;
    }
  }
}
Dashboard.createWidget("CSV/OrdersPrevYear.csv", Dashboard.ordersWidget, {Year: 2015, Week: 17 } );
Dashboard.createWidget("CSV/AdditionalServices.csv", Dashboard.additionalServicesWidget, {Year: 2015, Week: 17 });
Dashboard.createWidget("CSV/CustomerScore.csv", Dashboard.performanceWidget, {Year: 2015, Week: 17 } );

d3.select(window).on('resize', function() {
  Dashboard.widgets.forEach(function(w) {
    w.update();
  });
});

module.exports = Dashboard;
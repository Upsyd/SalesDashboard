import _ from 'underscore';
import Helpers from '../../../Utils/helpers.js';

export default class performanceWidget {
  static lineChart(options) {
    let title = null;
    let colorMap = null;

    function chart(selection) {
      let updates = [];
      selection.each(function(data) {
        let sel = d3.select(this);
        sel.selectAll('svg').remove();
        sel.style('opacity', 0)
          .transition()
          .duration(800)
          .style('opacity', 1);

        let selectionWidth = parseInt(sel.style('width'), 10), //selection[0][0].clientWidth,
          selectionHeight = /*selectionWidth*0.75; */ parseInt(sel.style('height'), 10); //selection[0][0].clientHeight;

        let margin = {
          top: 40,
          right: 40,
          bottom: 40,
          left: 40
        };
        let width = selectionWidth - margin.left - margin.right,
          height = selectionHeight - margin.top - margin.bottom;

        let bisectDate = d3.bisector(function(d) {
          return d.Date;
        }).left;
        let x = d3.time.scale().range([0, width]),
          y = d3.scale.linear().range([height, 0]);

        let yMin = d3.min(data, function(d) {
            return d3.min(d, function(c) {
              return c.value;
            })
          }),
          xMin = d3.min(data, function(d) {
            return d3.min(d, function(c) {
              return c.Date;
            })
          }),
          xMax = d3.max(data, function(d) {
            return d3.max(d, function(c) {
              return c.Date;
            })
          });

        x.domain([xMin, xMax]);
        y.domain([yMin - (100 - yMin) / 4, 100]);

        let chart = sel.append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        if (title) {
          chart.append('text')
            .attr('class', 'title')
            .style('text-anchor', 'middle')
            .attr('x', (width) / 2)
            .attr('y', -20)
            .text(title);
        }

        let line = d3.svg.line()
          .interpolate('basis')
          .x(function(d) {
            return x(d.Date)
          })
          .y(function(d) {
            return y(d.value)
          });

        let lineZero = d3.svg.line()
          .interpolate('basis')
          .x(function(d, i) {
            return x(d.Date)
          })
          .y(function(d, i) {
            return height
          });

        let colors = d3.scale.ordinal()
          .range(['#ff3d5d', '#ff825a', '#ffd16f', '#ff7218', '#04b3f3', '#6e0215', '#71d362', '#c37ec2', '#555', '#a05d56', '#', '#227', '#256']);

        let color = function(k) {
          return colorMap && k in colorMap ? colorMap[k] : colors(k);
        };

        let makeXAxis = d3.svg.axis().scale(x).orient('bottom').ticks(4),
          makeYAxis = d3.svg.axis().scale(y).tickFormat(function(d) {
            return d + '%';
          }).orient('left').ticks(5);

        function makeYGrid() {
          return d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(10);
        }

        function makeXGrid() {
          return d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .ticks(5);
        }

        let tooltip = d3.select(sel.node().parentNode).append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0);

        tooltip.append('div').attr('id', 'key');
        tooltip.append('div').attr('id', 'sep');
        tooltip.append('div').attr('id', 'date')
        tooltip.append('div').attr('id', 'val');

        let tooltipTail = d3.select(sel.node().parentNode).append('div')
          .attr('class', 'tooltip-tail')
          .style('opacity', 0);

        let xAxis = chart.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .style({
            '-moz-user-select': '-moz-none',
            '-khtml-user-select': 'none',
            '-webkit-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none',
          })
          .call(makeXAxis);

        let yAxis = chart.append('g')
          .attr('class', 'y axis')
          .style('font-size', '10pt')
          .style({
            '-moz-user-select': '-moz-none',
            '-khtml-user-select': 'none',
            '-webkit-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none',
          })
          .call(makeYAxis);

        let yGrid = chart.append('g')
          .attr('class', 'y grid')
          .style('stroke', 'lightgrey')
          .style('opacity', 0.7)
          .attr('id', 'ygrid')
          .call(makeYGrid().tickSize(-width, 0, 0).tickFormat(''));

        let xGrid = chart.append('g')
          .attr('class', 'x grid')
          .style('stroke', 'lightgrey')
          .style('opacity', 0.7)
          .attr('id', 'xgrid')
          .call(makeXGrid().tickSize(height, 0, 0).tickFormat(''));

        // xGrid.select('path.domain').remove();

        // Set style for axis
        d3.selectAll('.axis path, .axis line, .axis.tick')
          .style({
            'fill': 'none',
            'stroke': 'black', //'#630002',
            'shape-rendering': 'crispEdges'
          });

        let dataLabels = chart.selectAll('.dataLabels')
          .data(data)
          .enter()
          .append('text')
          .attr({
            x: width + 2,
            y(d) {
              return d.length > 0 ? y(d[d.length - 1].value) : null;
            },
            fill(d) {
              return d.length > 0 ? color(d[0].key) : '#fff';
            }
          })
          .text(function(d) {
            return d.length > 0 ? Helpers.formatValue(d[d.length - 1].value) + '%' : null;
          })
          .style('opacity', 0);

        dataLabels.transition()
          .duration(800)
          .style('opacity', 1);

        let lines = chart.selectAll('.dataLine')
          .data(data)
          .enter()
          .append('path')
          .attr('pointer-events', 'stroke')
          .attr('d', function(d) {
            return lineZero(d)
          })
          .style({
            'fill': 'none',
            'stroke-width': '2px',
            'stroke' (d) {
              return d.length > 0 ? color(d[0].key) : '#fff';
            }
          });

        lines.transition()
          .duration(600)
          .attr('d', function(d) {
            return line(d);
          });

        let linesTransparent = chart.selectAll('.helperLine')
          .data(data)
          .enter()
          .append('path')
          .attr('pointer-events', 'stroke')
          .attr('d', function(d) {
            return lineZero(d)
          })
          .style({
            'fill': 'none',
            'stroke-width': '10px',
            'stroke': '#fff0'
          });

        linesTransparent.transition()
          .duration(600)
          .attr('d', function(d) {
            return line(d);
          });

        linesTransparent.on('mousemove', function(d) {
            let mouseX = d3.mouse(this)[0],
              mouseY = d3.mouse(this)[1];

            let x0 = x.invert(mouseX),
              i = bisectDate(d, x0, 0),
              d0 = (i === 0) ? d[i] : d[i - 1],
              d1 = (i === d.length) ? d[i - 1] : d[i],
              c = (x0 - d0.Date) / (d1.Date - d0.Date);

            let val = d0.value + (d1.value - d0.value) * c;
            let eventX = d3.event.clientX; //left +  margin.left + d3.mouse( this )[0]; //d3.event.pageX
            let eventY = d3.event.clientY; //top + margin.top + d3.mouse( this )[1]; //d3.event.pageY

            tooltipTail
              .style('left', (eventX - 7 - 2) + 'px')
              .style('top', (eventY - 10) + 'px');

            tooltipTail.transition()
              .duration(200)
              .style('opacity', .9);

            let shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            let month = shortMonths[x0.getMonth()];
            tooltip.select('#key').html(d[0].key);
            tooltip.select('#sep').style('background', color(d[0].key));
            tooltip.select('#date').html(x0.getDate() + ' ' + month + ' ' + x0.getFullYear());
            tooltip.select('#val').html(Helpers.formatValue(val) + '%');

            let w = parseInt(d3.select('.tooltip').style('width'), 10);
            tooltip.style('left', (eventX - w / 2 - 2) + 'px')
              .style('top', (eventY - 70 - 10) + 'px');

            tooltip.transition()
              .duration(200)
              .style('opacity', .9);
          })
          .on('mouseleave', function(d) {
            tooltipTail.transition()
              .duration(200)
              .style('opacity', 0);

            tooltip
              .transition()
              .duration(200)
              .style('opacity', 0);
          });



        function update(transitionDuration) {
          data = sel[0][0].__data__;

          selectionWidth = parseInt(sel.style('width'), 10);
          selectionHeight = parseInt(sel.style('height'), 10);
          // selectionHeight = selectionWidth*0.75;
          width = selectionWidth - margin.left - margin.right;
          height = selectionHeight - margin.top - margin.bottom;

          d3.select(chart.node().parentNode)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);
          chart.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

          yMin = d3.min(data, function(d) {
              return d3.min(d, function(c) {
                return c.value;
              })
            }),
            xMin = d3.min(data, function(d) {
              return d3.min(d, function(c) {
                return c.Date;
              })
            }),
            xMax = d3.max(data, function(d) {
              return d3.max(d, function(c) {
                return c.Date;
              })
            });
          x.range([0, width]);
          y.range([height, 0]);

          lines.data( data );
          linesTransparent.data( data );
          dataLabels.data( data );

          if ( xMin && xMax ) {
            x.domain( [ xMin, xMax ] );
          }
          if ( yMin ) {
            y.domain( [ yMin-(100-yMin)/4, 100 ] );
          }

          if (title) {
            chart.select('text.title')
              .attr('x', (width) / 2)
              .attr('y', -20)
              .text(title);
          }

          if (transitionDuration) {
            xAxis.transition()
              .duration(transitionDuration)
              .attr('transform', 'translate(0,' + height + ')')
              .call(makeXAxis);

            yAxis.transition()
              .duration(transitionDuration)
              .call(makeYAxis);

            xGrid.transition()
              .duration(transitionDuration)
              .call(makeXGrid().tickSize(height, 0, 0).tickFormat(''));

            yGrid.transition()
              .duration(transitionDuration)
              .call(makeYGrid().tickSize(-width, 0, 0).tickFormat(''));

            lines.each( function(d){
              if ( d.length === 0 ) {
                d3.select( this ).transition()
                  .duration( transitionDuration )
                  .style( 'opacity', 0 );
              } else {
                d3.select( this )
                  .transition()
                  .duration( transitionDuration )
                  .attr( 'd', function(d) { return d.length === 0 ? null : line( d ); } )
                  .style( 'stroke', function(d) { return d.length > 0 ? color(d[0].key) : null; } )
                  .style( 'opacity', 1 );
              }
            });

            linesTransparent.transition()
              .duration( transitionDuration )
              .attr( 'd', function(d) { return d.length === 0 ? null : line( d ); } )
              .style( 'opacity', 1 );

            dataLabels.each( function(d){
              if ( d.length === 0 ) { 
                d3.select( this ).transition()
                  .duration( transitionDuration )
                  .style( 'opacity', 0 );
              } else { 
                d3.select( this )
                  .transition()
                  .duration( transitionDuration )
                  .attr({
                    x:      width+2,
                    y:      function(d) { return y( d[ d.length-1 ].value ); },
                    fill(d) { return d.length > 0 ? color(d[0].key) : '#fff'; }
                  })
                  .text( function(d) { return Helpers.formatValue( d[ d.length-1 ].value ) + '%'; } )
                  .style( 'opacity', 1 );
              }
            });
          } else {
            xAxis.attr('transform', 'translate(0,' + height + ')').call(makeXAxis);
            yAxis.call(makeYAxis);
            xGrid.call(makeXGrid().tickSize(height, 0, 0).tickFormat(''));
            yGrid.call(makeYGrid().tickSize(-width, 0, 0).tickFormat(''));
            
            lines.each( function(d){
              if ( d.length === 0 ) { d3.select( this ).style( 'opacity', 0 );} 
              else { d3.select( this )
                .attr( 'd', function(d) { return d.length === 0 ? null : line( d ); } )
                .style( 'stroke', function(d) { return d.length > 0 ? color(d[0].key) : null; } )
                .style( 'opacity', 1 );}
            });

            linesTransparent.attr( 'd', function(d) { return line( d ); } );
            
            dataLabels.each( function(d){
              if ( d.length === 0 ) { 
                d3.select( this ).style( 'opacity', 0 );
              } else { 
                d3.select( this )
                  .attr({
                    x:      width+2,
                    y:      function(d) { return y( d[ d.length-1 ].value ); },
                    fill(d) { return d.length > 0 ? color(d[0].key) : '#fff'; }
                  })
                  .text( function(d) { return Helpers.formatValue( d[ d.length-1 ].value ) + '%'; } )
                  .style( 'opacity', 1 );
              }
            });
          }
        }

        updates.push(update);
      });
      return {
        update(transitionDuration) {
            updates.forEach(function(up) {
              up(transitionDuration);
            });
            return this;
          },
          title(newTitle) {
            title = newTitle;
            return this;
          }
      };

    }

    chart.title = function(_) {
      if (!arguments.length) return title;
      title = _;
      return chart;
    };

    chart.palette = function(_) {
      if (!arguments.length) return colorMap;
      colorMap = _;
      return chart;
    };


    return chart;
  }
}
let React = require('react');
let BarChart = require('../../lib/base_charts_d3/BarChart');

require('./barChart.scss');
require('./chart-style.css');
let JnprBarChartComponents = React.createClass({
 
  componentDidMount: function(){
  },
  
  render: function(){
   
    var data = [{
              label: 'somethingA',
              values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
          }];
    return (
            
            <div className='myChart'>
             <BarChart
                  data={data}
                  width={400}
                  height={400}
                  margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
            </div>
            
    );
  }
});

module.exports = JnprBarChartComponents;
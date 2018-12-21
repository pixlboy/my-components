let BarChart = require('./base_charts_d3/BarChart');
let Waveform = require('./base_charts_d3/Waveform');
let PieChart = require('./base_charts_d3/PieChart');
let ScatterPlot = require('./base_charts_d3/ScatterPlot');
let LineChart = require('./base_charts_d3/LineChart');
let AreaChart = require('./base_charts_d3/AreaChart');
let Brush = require('./base_charts_d3/Brush');
let d3 = require('d3');

module.exports = {
    BarChart: BarChart,
    PieChart: PieChart,
    ScatterPlot: ScatterPlot,
    LineChart: LineChart,
    AreaChart: AreaChart,
    Waveform: Waveform,
    Brush: Brush,
    d3: d3
};

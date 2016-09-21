import React, { Component } from 'react';
import { Text, View, ART } from 'react-native';
const { Surface, Group, Shape, LinearGradient } = ART;
import Dimensions from 'Dimensions';

import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as color from 'd3-color';
import * as scaleChromatic from 'd3-scale-chromatic';
import * as core from 'd3';
const d3 = {
  scale,
  scaleChromatic,
  shape,
  core,
  color
};

class BarChartArt extends Component {
  render() {
    const totalWidth = Dimensions.get('window').width * 0.9;
    const totalHeight = Dimensions.get('window').height * 0.9;
    const data = [
      {index: 0, value: 50},
      {index: 1, value: 65},
      {index: 2, value: 107},
      {index: 3, value: 32}
    ];
    const x = d3.scale.scaleBand()
      .domain(data.map((d) => d.index))
      .rangeRound([0, totalWidth])
      .padding(0.1);
    const y = d3.scale.scaleLinear()
      .domain([0, Math.max(...(data.map((d) => d.value)))])
      .range([0, totalHeight]);
    const colorScale = d3.scale.scaleSequential(d3.scaleChromatic.interpolateRdYlGn)
      .domain([60, 32])
      .clamp(true);
    const rect = (d, i) => {
      const color = colorScale(d.value);
      const colorWithTransparency = d3.color.color(color);
      colorWithTransparency.opacity = 0.4;
      const stops = {'0': colorWithTransparency + "", '1': color};
      const fill = new LinearGradient(stops, 0, totalHeight, 0, totalHeight-y(d.value));
      const path = "M" + x(d.index) + " " + totalHeight + " " +
        "L" + (x(d.index) + x.bandwidth()) + " " + totalHeight + " " +
        "L" + (x(d.index) + x.bandwidth()) + " " + (totalHeight - y(d.value)) + " " +
        "L" + x(d.index) + " " + (totalHeight - y(d.value)) + " z";
      console.log(path);
      return <Shape key={i} d={path} fill={fill} />
    };
    const rects = data.map((d, i) => rect(d, i));
    const linePath = "M0 " + y(60) + " H" + totalWidth;
    return (
      <Surface width={totalWidth} height={totalHeight+1}>
        <Group x={0} y={0}>
          {rects}
          <Shape d={linePath} stroke="white" strokeWidth="1" />
        </Group>
      </Surface>
    )
  }
}

class PieChart extends Component {
  render() {
    var data = [];
    for (var i = 0; i <= 10; i++) {
      data.push(Math.random(20, 100));
    }
    const dataScale = d3.scale.scaleLinear().domain([Math.min(...data), Math.max(...data)]).range([0, 1]);
    const colorScale = d3.scale.scaleSequential(d3.scaleChromatic.interpolateSpectral);
    const colors = data.map(function (point) {
      console.log(dataScale(point));
      return colorScale(dataScale(point));
    });
    const pie = d3.shape.pie()(data);
    const arcs = pie.map(function (arc) {
      return d3.shape.arc()(Object.assign({}, arc, {outerRadius: 100, innerRadius: 50}));
    });

    const shapes = arcs.map(function (arc, i) {
      return <Shape
        key={i}
        d={arc}
        stroke="#000"
        fill={colors[i]}
        strokeWidth={1} />
    });
    return (
      <Surface width={500} height={500}>
        <Group x={250} y={250}>
          {shapes}
        </Group>
      </Surface>
    )
  }
}

class App extends Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black'}}>
        <BarChartArt />
      </View>
    )
  }
}

export default App;
import React, { Component } from 'react';
import { Text, View, ART } from 'react-native';
const { Surface, Group, Shape } = ART;
import Svg,{
  Rect,
  Line,
  LinearGradient,
  Stop,
  Defs
} from 'react-native-svg';

import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as color from 'd3-color';
import * as scaleChromatic from 'd3-scale-chromatic';
import * as core from 'd3';
import * as d3Array from 'd3-array';
const d3 = {
  scale,
  scaleChromatic,
  shape,
  core,
  color
};

class BarChart extends Component {
  render() {
    const totalWidth = 300;
    const totalHeight = 300;
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
    data.map((d) => {
      console.log("value: " + d.value + ", color: " + colorScale(d.value))
    });
    const fill = (d, i) =>
      <LinearGradient key={i} x1="0" x2="0" y1={totalHeight} y2={totalHeight-y(d.value)} id={"grad"+i}>
        <Stop offset="0%" stopColor={colorScale(d.value)} stopOpacity="0.4" />
        <Stop offset="100%" stopColor={colorScale(d.value)} stopOpacity="1" />
      </LinearGradient>;
    const rect = (d, i) => <Rect key={d.index} x={x(d.index)} width={x.bandwidth()} y={totalHeight-y(d.value)} height={y(d.value)} fill={"url(#grad"+i+")"}/>;
    const rects = data.map((d, i) => rect(d, i));
    const fills = data.map((d, i) => fill(d, i));

    return (
      <Svg width={totalWidth} height={totalHeight}>
        <Defs>
          {fills}
        </Defs>
        {rects}
        <Line x1={0} x2={totalWidth} y1={y(60)} y2={y(60)} stroke="black"/>
      </Svg>
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
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <BarChart/>
      </View>
    )
  }
}

export default App;
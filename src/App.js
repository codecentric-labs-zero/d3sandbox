import React, { Component } from 'react';
import { Text, View, ART } from 'react-native';
const { Surface, Group, Shape } = ART;

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

class App extends Component {
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
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Surface width={500} height={500}>
          <Group x={250} y={250}>
            {shapes}
          </Group>
        </Surface>
      </View>
    )
  }
}

export default App;
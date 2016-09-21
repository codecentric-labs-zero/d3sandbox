import React, { Component } from 'react';
import { Text, View, ART } from 'react-native';
const { Surface, Group, Shape } = ART;

import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as core from 'd3';
import * as d3Array from 'd3-array';
const d3 = {
  scale,
  shape,
  core
};

class App extends Component {
  render() {
    const data = [4, 8, 15, 16, 23, 42];
    const colors = ['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff'];
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
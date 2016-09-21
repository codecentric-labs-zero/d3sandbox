import React, { Component } from 'react';
import { Text, View, ART } from 'react-native';
const { Surface, Group, Shape } = ART;

import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as d3Array from 'd3-array';
const d3 = {
  scale,
  shape,
};

class App extends Component {
  render() {
    var arc = d3.shape.arc()
      .innerRadius(0)
      .outerRadius(100)
      .startAngle(0)
      .endAngle(Math.PI / 2)();
    return (
      <View>
        <Surface width={500} height={500}>
          <Group x={100} y={200}>
            <Shape
              d={arc}
              stroke="#000"
              strokeWidth={1} />
          </Group>
        </Surface>
      </View>
    )
  }
}

export default App;
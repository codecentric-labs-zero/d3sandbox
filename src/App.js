import React, { Component } from 'react';
import { Text, View, ART, TouchableOpacity, Dimensions, Animated } from 'react-native';
const { Surface, Group, Shape, LinearGradient } = ART;

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

class ColorChangingBackground extends Component {
  constructor(props) {
    super(props)
    // Some color definitions
    this.ORANGE = 'rgb(255, 153, 0)'
    this.GREY = 'rgb(102, 102, 102)'
    this.RED = 'rgb(192,33,8)'
    // Initialize everything to grey when mounting the component
    this.state = {
      currentColor: this.GREY,
      nextColor: this.GREY
    }
    // We'll almost always go from 0 to 100, transitioning from current to next color,
    // so initialize _colorValue to 0
    this._colorValue = new Animated.Value(0)
    this._flash = this._flash.bind(this)
    this._fadeOver = this._fadeOver.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    // Determine next color based on next intensity
    // Please note that this implementation assumes that intensity
    // can only be adjusted in steps of 1
    var nextColor
    switch (nextProps.intensity) {
      case 0:
        nextColor = this.GREY
        break
      case 1:
        nextColor = this.ORANGE
        break
      default:
        nextColor = this.RED
        break
    }
    // Only trigger animation when something changes
    if (this.props.intensity !== nextProps.intensity) {
      // Set target color
      this.setState({nextColor: nextColor})
      // We need to do some more things when the flashing animation is running
      if (this.props.intensity === 2) {
        // Stop flash animation and grab current value
        this._colorValue.stopAnimation((value) => {
          // Create new starting point for fading back to orange (remember
          // that we always fade from 0 - 100
          this._colorValue = new Animated.Value(100 - value)
          // Make sure that we fade from red to orange
          this.setState({currentColor: this.RED, nextColor: this.ORANGE})
          // And trigger normal fade
          this._fadeOver(nextProps, nextColor);
        })
      } else {
        // Reset to 0
        this._colorValue = new Animated.Value(0)
        // And trigger normal fade
        this._fadeOver(nextProps, nextColor);
      }

    }
  }

  render() {
    var {height, width} = Dimensions.get('window')
    var interpolatedColorAnimation = this._colorValue.interpolate({
      inputRange: [0, 100],
      outputRange: [this.state.currentColor, this.state.nextColor]
    });
    return (
      <Animated.View
        style={{
          flex: 0,
          flexDirection: 'column',
          height: height,
          width: width,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: interpolatedColorAnimation
        }}>
        <Text style={{color: 'white'}}>Intensity: {this.props.intensity}</Text>
        {this.props.children}
      </Animated.View>
    )
  }

  _fadeOver(nextProps, nextColor) {
    Animated.timing(this._colorValue, {
      toValue: 100,
      duration: 1000
    }).start((event) => {
      // When the animation finishes, we need to do some cleanup
      if (nextProps.intensity !== 2) {
        // For "normal" intensities, just make sure to update current color
        this.setState({currentColor: nextColor})
      } else {
        // For "flashing" intensity, we want to start the flashing effect after
        // we have faded to red
        this.setState({currentColor: this.ORANGE, nextColor: this.RED})
        this._flash()
      }
    })
  }

  _flash() {
    // This is just a sequence going from 100 to 0 and back.
    // As we always start _flash after a normal transition, colorValue will
    // already be 100, so start going to 0
    Animated.sequence([
      Animated.timing(this._colorValue, {
        toValue: 0,
        duration: 500,
      }),
      Animated.timing(this._colorValue, {
        toValue: 100,
        duration: 500
      })
    ]).start((event) => {
      // Only restart loop when we finished naturally. Otherwise
      // stopAnimation will not be able to interrupt the loop
      if (event.finished) {
        this._flash();
      }
    });
  }
}

let Button = (props) => {
  return (
    <TouchableOpacity style={{backgroundColor: 'white', margin: 20, padding: 10}} onPress={props.onPress}>
      <Text style={{textAlign: 'center', color: 'black'}}>{props.text}</Text>
    </TouchableOpacity>
  )
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      intensity: 0
    }
    this._increaseIntensity = this._increaseIntensity.bind(this)
    this._decreaseIntensity = this._decreaseIntensity.bind(this)
  }

  _increaseIntensity() {
    if (this.state.intensity < 2) {
      this.setState({intensity: this.state.intensity + 1})
    }
  }

  _decreaseIntensity() {
    if (this.state.intensity > 0) {
      this.setState({intensity: this.state.intensity - 1})
    }
  }

  render() {
    return (
      <ColorChangingBackground intensity={this.state.intensity}>
        <Button text="Increase intensity" onPress={this._increaseIntensity} />
        <Button text="Decrease intensity" onPress={this._decreaseIntensity} />
      </ColorChangingBackground>
    )
  }
}

export default App;
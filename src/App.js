import React, {Component} from 'react';
import {Text, View, Animated, Image, Easing} from 'react-native';
import TimerMixin from 'react-timer-mixin'

mixins: [TimerMixin]

class App extends Component {
    constructor(props) {
        super()
        this.spinValue = new Animated.Value(0)
        this.state = {
            spins: 0,
        }
    }

    componentDidMount() {
        this.spin()

        setInterval(() => {
            this.setState({
                spins: this.state.spins + 1
            })

        }, 1500);
    }

    spin() {
        this.spinValue.setValue(0)
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear
            }
        ).start(() => this.spin())

    }

    render() {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })

        return (

            <View style={{flex: 3, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white'}}>
                <View style={{flex: 1, alignItems: 'center'}}></View>
                <Animated.Image style={{width: 227, height: 200, transform: [{rotate: spin}]}}
                                source={require('../res/doge.png')}/>
                <View style={{flex: 1, alignItems: 'center', paddingTop: 40}}>
                    <Text>Spins: {this.state.spins}</Text>
                </View>
            </View>
        )
    }
}


export default App;
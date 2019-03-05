//

import React, { Component } from "react";
import { Animated } from "react-native";

import { animationPromise } from "./animationPromise";

export default class AnimationWrapper extends Component {
  animationValueStore = {};

  static defaultProps = {
    promiseReturn: undefined,
    children: null,
    animate: null,
    style: undefined
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { animate, animations } = this.props;

    if (animate && Object.keys(animations).includes(animate)) {
      this.runAnimation(animate);
    }
  }

  runAnimation(animationGroup) {
    const { promiseReturn } = this.props;
    const promise = this.startAnimation(animationGroup);

    if (promiseReturn) {
      const promiseKeyValue = {};
      promiseKeyValue[animationGroup] = promise;

      promiseReturn(promiseKeyValue);
    }
  }

  startAnimation(animationGroup) {
    const animationPromiseArray = [];
    const { animations } = this.props;

    const newState = this.getInitalisedState(animationGroup);

    Object.keys(animations[animationGroup]).forEach(animationProp => {
      const config = animations[animationGroup][animationProp];
      config.toValue = 1;
      // config.useNativeDriver = true;
      const promise = animationPromise(
        this.animationValueStore[animationProp],
        config
      );
      animationPromiseArray.push(promise);
    });

    this.setState(newState);

    return Promise.all(animationPromiseArray);
  }

  getInitalisedState(animationGroup) {
    const { animations } = this.props;

    const newState = {};

    Object.keys(animations[animationGroup]).forEach(animationProp => {
      this.animationValueStore[animationProp] = new Animated.Value(0);
      newState[animationProp] = this.getInterpolatedValue(
        animations[animationGroup][animationProp],
        animationProp
      );
    });

    console.log(newState);

    return newState;
  }

  getInterpolatedValue(animation, animationProp) {
    const { startValue, endValue } = animation;

    return this.animationValueStore[animationProp].interpolate({
      inputRange: [0, 1],
      outputRange: [startValue, endValue]
    });
  }

  componentDidUpdate(prevProps) {
    const { animate, animations } = this.props;
    if (
      animate &&
      prevProps.animate !== animate &&
      Object.keys(animations).includes(animate)
    ) {
      this.runAnimation(animate);
    }
  }

  getTransform() {
    const { state } = this;
    const transformArray = [];
    Object.keys(state).forEach(animationProp => {
      if (animationProp !== "opacity") {
        const transform = {};
        transform[animationProp] = state[animationProp];
        transformArray.push(transform);
      }
    });
    return transformArray;
  }

  render() {
    const { children, style } = this.props;
    const { opacity } = this.state;

    console.log("rendering");

    return (
      <Animated.View
        style={{ ...style, opacity, transform: this.getTransform() }}
      >
        {children}
      </Animated.View>
    );
  }
}

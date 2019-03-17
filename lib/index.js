//

import React, { Component } from "react";
import { Animated } from "react-native";

import { animationPromise } from "./animationPromise";

export default class AnimationWrapper extends Component {
  animationValueStore = {};
  animationActiveValue = {};
  animationListeners = [];
  disablePointerEvents = false;

  static defaultProps = {
    animations: {},
    text: undefined,
    textStyle: undefined,
    children: null,
    animate: null,
    style: undefined
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  groupKeys() {
    const { animations } = this.props;

    return Object.keys(animations);
  }

  startAnimation(groupKey) {
    const { animations } = this.props;
    const group = animations[groupKey];
    const propKeys = Object.keys(group);

    const animationPromiseArray = [];

    const groupState = this.initialiseGroupState(group, propKeys);

    propKeys.forEach(propKey => {
      const config = AnimationWrapper.getConfig(group, propKey);

      const promise = animationPromise(
        this.animationValueStore[propKey],
        config
      );
      animationPromiseArray.push(promise);
    });

    this.setState(groupState);

    return Promise.all(animationPromiseArray);
  }

  initialiseGroupState(group, propKeys) {
    const { animations } = this.props;

    const groupState = {};

    propKeys.forEach(propKey => {
      const prop = group[propKey];
      if (propKey === "opacity" && prop.endValue === 0) {
        this.disablePointerEvents = true;
      } else {
        this.disablePointerEvents = false;
      }
      if (!prop.disableListeners) {
        const currentRemainingValue = this.getRemainingAnimatedValue(propKey);

        AnimationWrapper.setAnimationDuration(prop, currentRemainingValue);

        const animatedValue = this.setAnimatedValue(
          propKey,
          1 - currentRemainingValue
        );

        this.addListener(animatedValue, propKey);
      } else {
        this.setAnimatedValue(propKey, 0);
      }

      groupState[propKey] = this.getInterpolatedValue(prop, propKey);
    });

    return groupState;
  }

  getRemainingAnimatedValue(propKey) {
    const currentAnimatedValue = this.animationActiveValue[propKey] || 1;
    return Math.round(currentAnimatedValue * 1000) / 1000;
  }

  static setAnimationDuration(prop, currentRemainingValue) {
    prop.fullDuration = prop.fullDuration || prop.duration;
    prop.duration = prop.fullDuration * currentRemainingValue;
  }

  setAnimatedValue(propKey, startValue) {
    const animatedValue = new Animated.Value(startValue);
    this.animationValueStore[propKey] = animatedValue;
    return animatedValue;
  }

  addListener(animatedValue, propKey) {
    this.animationListeners.push(
      animatedValue.addListener(object => {
        this.animationActiveValue[propKey] = object.value;
      })
    );
  }

  getInterpolatedValue(prop, propKey) {
    const { startValue, endValue } = prop;

    return this.animationValueStore[propKey].interpolate({
      inputRange: [0, 1],
      outputRange: [startValue, endValue]
    });
  }

  static getConfig(group, propKey) {
    const config = { ...group[propKey], toValue: 1 };
    return config;
  }

  getAnimatedStyle() {
    const { state } = this;
    const style = { text: {}, view: { transform: [] } };
    Object.keys(state).forEach(animationProp => {
      if (transformProps.includes(animationProp)) {
        const transform = {};
        transform[animationProp] = state[animationProp];
        style.view.transform.push(transform);
      } else if (
        animationProp === "fontSize" ||
        animationProp === "fontColor"
      ) {
        style.text[animationProp] = state[animationProp];
      } else {
        style.view[animationProp] = state[animationProp];
      }
    });
    return style;
  }

  render() {
    const { children, style, text, textStyle } = this.props;

    const animatedStyle = this.getAnimatedStyle();

    return (
      <Animated.View
        pointerEvents={this.disablePointerEvents ? "none" : "auto"}
        style={[style, animatedStyle.view]}
      >
        {text && (
          <Animated.Text style={[textStyle, animatedStyle.text]}>
            {text}
          </Animated.Text>
        )}
        {children}
      </Animated.View>
    );
  }
}

const transformProps = [
  "perspective",
  "rotate",
  "scale",
  "scaleX",
  "scaleY",
  "translateX",
  "translateY",
  "skewX",
  "skewY"
];

// @flow

import { View } from 'react-native';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import type AnimatedInterpolation from 'react-native/Libraries/Animated/src/nodes/AnimatedInterpolation';

export type AnimatedValueType = AnimatedValue;
export type AnimatedInterpolationType = AnimatedInterpolation;

export type ConfigType = {
  duration: number,
  delay?: number,
  easing?: Object,
};

export type AnimationPromiseType = Array<Promise<void>>;
export type PromiseReturnType = { [name: string]: AnimationPromiseType };
export type HandleAnimationType = PromiseReturnType => void;

export type AnimationPropType =
  | 'opacity'
  | 'perspective'
  | 'rotate'
  | 'scale'
  | 'scaleX'
  | 'scaleY'
  | 'translateX'
  | 'translateY'
  | 'skewX'
  | 'skewY';

export type AnimationType = {
  startValue: number,
  endValue: number,
  promiseReturn?: () => any,
} & ConfigType;

type AnimationGroupType = {
  [propName: AnimationPropType]: AnimationType,
};

export type PropsType = {
  animations: {
    [animationGroup: string]: AnimationGroupType,
  },
  promiseReturn?: PromiseReturnType => any,
  children?: ?React$Node,
  style?: View.propTypes.style,
  animate?: ?string,
};

export type StateType = {
  [prop: string]: AnimatedInterpolation,
};

export type AnimationValueStoreType = {
  [prop: string]: AnimatedValue,
};

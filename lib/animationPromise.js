//

import { Animated } from "react-native";

export const animationPromise = (value, config) =>
  new Promise(resolve => {
    // $FlowFixMe
    Animated.timing(value, config).start(({ finished }) => resolve(finished));
  });

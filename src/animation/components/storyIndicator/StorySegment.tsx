import React, { FC, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export interface Props {
  isComplete: boolean;
  autoPlay: boolean;
  segmentIndex: number;
  onStorySegmentTapped: (segment: number) => void;
  onStorySegmentCompleted: (segment: number) => void;
  height: number;
  segmentDurationInSeconds: number;
}

export const StorySegment: FC<Props> = ({
  height,
  isComplete,
  autoPlay,
  segmentDurationInSeconds,
  segmentIndex,
  onStorySegmentTapped,
  onStorySegmentCompleted,
}) => {
  const dynamicHeightStyle: ViewStyle = { height: height };
  const sharedValuePercentage: SharedValue<number> = useSharedValue(0);
  const dynamicWidthStyle: ViewStyle = useAnimatedStyle(() => ({
    width: `${sharedValuePercentage.value}%`,
  }), []);

  // Manages animating the segment progress
  useEffect(() => {
    if (!isComplete && autoPlay) {
      animateProgress();
    }
  }, [isComplete, autoPlay]);

  /**
   * Animates the current segment to from 0 to 100% width over the span of segmentDurationInSeconds
   */
  const animateProgress = () => {
    sharedValuePercentage.value = 0;
    sharedValuePercentage.value = withTiming(100, {
      duration: segmentDurationInSeconds * 1000,
      easing: Easing.linear,
    }, (finished) => {
      if (finished) {
        runOnJS(onStorySegmentCompleted)(segmentIndex);
      }
    });
  };

  return <TouchableOpacity
    style={[styles.itemContainerStyle, dynamicHeightStyle]}
    onPress={() => {
      onStorySegmentTapped(segmentIndex);
      animateProgress();
    }}
    hitSlop={{ top: 10, bottom: 10, left: 0, right: 0 }}>

    <View style={[{
      flex: 1,
      backgroundColor: "#FCFCFC",
      opacity: 0.2,
    }, dynamicHeightStyle]}
    />

    {isComplete
      ? <View style={[styles.itemBaseStyle, dynamicHeightStyle, styles.itemWidthFullStyle]} />
      : autoPlay
        ? <Animated.View style={[styles.itemBaseStyle, dynamicHeightStyle, dynamicWidthStyle]} />
        : <View style={[styles.itemBaseStyle, dynamicHeightStyle, styles.itemWidthEmptyStyle]} />
    }

  </TouchableOpacity>;
};

const styles = StyleSheet.create({
  itemContainerStyle: {
    flex: 1,
    justifyContent: "center",
  },

  itemBaseStyle: {
    borderRadius: 2,
    backgroundColor: "#FCFCFC",
    opacity: 1,
    position: "absolute",
    left: 0,
    top: 0,
  },
  itemWidthEmptyStyle: {
    width: 0,
  },
  itemWidthFullStyle: {
    width: "100%",
  },
});

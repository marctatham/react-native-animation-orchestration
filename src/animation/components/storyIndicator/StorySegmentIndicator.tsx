import React, { FC, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import Animated, {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const HEIGHT: number = 3;

type Props = {
  segmentDurationInSeconds: number;
  numberOfSegments: number;
  currentSegment: number;
  onStorySegmentTapped: (segment: number) => void;
  onStorySegmentCompleted: (segment: number) => void;
};

/**
 * This component displays a horizontal bar that mimics an instagram-style story indicator
 * @param segmentDurationInSeconds the duration of each segment in seconds
 * @param numberOfSegments the number segments in the story
 * @param currentSegment the current segment that is being displayed
 * @param onStorySegmentTapped the callback to be invoked when a segment is tapped
 * @param onStorySegmentCompleted the callback to be invoked when a segment has completed
 */
const StorySegmentIndicator: FC<Props> = ({
  segmentDurationInSeconds,
  numberOfSegments,
  currentSegment,
  onStorySegmentTapped,
  onStorySegmentCompleted,
}) => {
  // reanimated hooks to facilitate animating the current segment
  const sv: SharedValue<number> = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({ width: `${sv.value}%` }), []);

  // Begins incrementing progress of the current segment
  useEffect(() => {
    if (currentSegment < numberOfSegments) {
      handleAnimatePercentage();
    }
  }, [currentSegment]);

  /**
   * Animates the current segment to from 0 to 100% width over the span of segmentDurationInSeconds
   */
  const handleAnimatePercentage = () => {
    sv.value = 0;
    sv.value = withTiming(
      100,
      { duration: segmentDurationInSeconds * 1000, easing: Easing.linear },
      (finished) => {
        if (finished) {
          console.debug(`[StorySegmentIndicator] segment ${currentSegment} completed`);
          runOnJS(onStorySegmentCompleted)(currentSegment);
        }
      });
  };

  const renderContents = (): JSX.Element[] => {
    const storySegments: JSX.Element[] = [];
    for (let i = 0; i < numberOfSegments; i++) {
      const fragment = renderTouchableStorySegment(i);
      storySegments.push(fragment);

      // add margin next to each touchable story segment
      if (i !== numberOfSegments - 1) {
        storySegments.push(<View key={`marginView-${i}`} style={{ width: 8 }} />);
      }
    }

    return storySegments;
  };

  const renderTouchableStorySegment = (i: number): JSX.Element => {
    const baseStyle: ViewStyle = {
      height: HEIGHT,
      borderRadius: 2,
      backgroundColor: "#FCFCFC",
      opacity: 1,
      position: "absolute",
      left: 0,
      top: 0,
      width: `${i < currentSegment ? 100 : 0}%`, // covers any segment before/after current segment
    };

    return <TouchableOpacity
      style={styles.itemView}
      key={`touchableWrapper-${i}`}
      onPress={() => {
        handleAnimatePercentage();
        onStorySegmentTapped(i);
      }}
      hitSlop={{ top: 10, bottom: 10, left: 0, right: 0 }}>

      <View style={{
        flex: 1,
        height: HEIGHT,
        backgroundColor: "#FCFCFC",
        opacity: 0.2,
      }}
      />

      {i === currentSegment
        ? <Animated.View style={[baseStyle, animatedStyle]} />
        : <View style={baseStyle} />
      }
    </TouchableOpacity>;
  };

  return (
    <View style={styles.container}>
      {renderContents()}
    </View>
  );
};

export default StorySegmentIndicator;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    height: 20,
  },

  itemView: {
    flex: 1,
    height: HEIGHT,
    justifyContent: "center",
  },
});

import React, { FC, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const HEIGHT: number = 3;

type Props = {
  segmentDurationInSeconds: number;
  numberOfSegments: number;
  currentSegment: number;
  onStorySegmentTapped: (segment: number) => void;
  onStorySegmentCompleted: (segment: number) => void;
};

// the action that needs to be performed, either as a result of a
// user interaction or as a result of the timeout having expired
enum ActionType {
  NONE,
  NEW_SEGMENT_TAPPED,
  SEGMENT_COMPLETED,
}

// simple data carrying model to carry the action & the segment to which the action applies (if relevant)
interface Action {
  type: ActionType;
  segment: number;
}


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
  // facilitates current segment progress as a percentage from 0 to 100
  const [currentSegmentProgress, setCurrentSegmentProgress] = useState<number>(0);
  const [action, setAction] = useState<Action>({ type: ActionType.NONE, segment: currentSegment });

  // reanimated hooks to facilitate animating the current segment
  const sv = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({ width: `${sv.value}%` }), []);
  const handleAnimatePercentage = () => sv.value = withTiming(100, { duration: segmentDurationInSeconds * 1000 });

  // configures the component to update progress of the current segment
  // this is time-based, based on the segmentDurationInSeconds prop
  // note: only configure interval if the current segment is not the last segment
  useEffect(() => {
    if (currentSegment < numberOfSegments) {
      handleAnimatePercentage();
    }
  }, [currentSegment]);

  // manages notifying the consumer about completion of the current segment
  useEffect(() => {
    if (currentSegmentProgress === 100) {
      setAction({ type: ActionType.SEGMENT_COMPLETED, segment: currentSegment });
    }
  }, [currentSegmentProgress]);

  useEffect(() => {
    switch (action.type) {
      case ActionType.NONE:
        break;

      case ActionType.NEW_SEGMENT_TAPPED:
        setCurrentSegmentProgress(0);
        handleAnimatePercentage();
        onStorySegmentTapped(action.segment);
        break;

      case ActionType.SEGMENT_COMPLETED:
        onStorySegmentCompleted(action.segment);
        break;

      default:
        throw new Error(`[StorySegmentIndicator] unknown action: ${action}`);
    }
  }, [action]);

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
      onPress={() => setAction({
        type: ActionType.NEW_SEGMENT_TAPPED,
        segment: i,
      })}
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

import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { StorySegment } from "./StorySegment";

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

  const renderContents = (): JSX.Element[] => {
    const storySegments: JSX.Element[] = [];
    for (let i = 0; i < numberOfSegments; i++) {
      storySegments.push(<StorySegment
        key={`storySegment-${i}`}
        height={HEIGHT}
        segmentDurationInSeconds={segmentDurationInSeconds}
        isComplete={i < currentSegment}
        autoPlay={i === currentSegment}
        onStorySegmentCompleted={() => onStorySegmentCompleted(i)}
        onStorySegmentTapped={() => onStorySegmentTapped(i)}
        segmentIndex={i}
      />);

      // add margin next to each touchable story segment
      if (i !== numberOfSegments - 1) {
        storySegments.push(<View key={`marginView-${i}`} style={{ width: 8 }} />);
      }
    }

    return storySegments;
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
});

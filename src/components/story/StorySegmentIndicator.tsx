import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import StorySegment from "./StorySegment";

const HEIGHT: number = 3;

type Props = {
  segmentDurationInSeconds: number;
  numberOfSegments: number;
  currentSegment: number;
  onSegmentTapped: (segment: number) => void;
  onSegmentCompleted: (segment: number) => void;
};

/**
 * This component displays a horizontal bar that mimics an instagram-style story indicator
 * @param segmentDurationInSeconds the duration of each segment in seconds
 * @param numberOfSegments the number segments in the story
 * @param currentSegment the current segment that is being displayed
 * @param onSegmentTapped the callback to be invoked when a segment is tapped
 * @param onSegmentCompleted the callback to be invoked when a segment has completed
 */
const StorySegmentIndicator: FC<Props> = ({
  segmentDurationInSeconds,
  numberOfSegments,
  currentSegment,
  onSegmentTapped,
  onSegmentCompleted,
}) => {
  // facilitates current segment progress as a percentage from 0 to 100
  const [currentSegmentProgress, setCurrentSegmentProgress] = useState<number>(0);

  // facilitates interval management
  const unsubscribe: any = useRef();

  /**
   * configures the interval to update the progress of the current segment
   * interval duration is based on the given duration prop
   */
  useEffect(() => {
    const updateProgress = () => {
      setCurrentSegmentProgress((prevProgress: number) => {
        if (prevProgress >= 100) {
          cleanupResources();
          onSegmentCompleted(currentSegment);
          return prevProgress;
        } else {
          return prevProgress >= 100 ? 100 : prevProgress + 1;
        }
      });
    };

    const intervalDurationInMillis = (segmentDurationInSeconds * 1000) / 100;
    unsubscribe.current = setInterval(updateProgress, intervalDurationInMillis);
    return cleanupResources;
  }, [currentSegment]);

  const cleanupResources = () => {
    console.debug(`[StorySegmentIndicator] cleaning up resources`);
    if (unsubscribe.current) {
      clearInterval(unsubscribe.current);
      unsubscribe.current = null;
      console.debug(`[StorySegmentIndicator] resources have been cleanup up`);
    }
  };

  const renderTouchableStorySegment = (): JSX.Element[] => {
    const storySegments: JSX.Element[] = [];
    for (let i = 0; i < numberOfSegments; i++) {
      let progressPercentage = 0;
      if (i < currentSegment) {
        progressPercentage = 100;
      } else if (i === currentSegment) {
        progressPercentage = currentSegmentProgress;
      }

      const fragment =
        <Fragment>
          <TouchableOpacity
            key={`indicator-${i}`}
            onPress={() => onSegmentTapped(i)}
            style={{ ...styles.itemView, height: HEIGHT }}
            hitSlop={{ top: 10, left: 0, bottom: 10, right: 0 }}>
            <StorySegment key={`indicator-${i}`} progressPercentage={progressPercentage} height={HEIGHT} />
          </TouchableOpacity>

          {/*Add margin in between story segments when relevant*/}
          {i !== numberOfSegments - 1 && <View key={`${i}-marginView`} style={{ width: 8 }} />}
        </Fragment>;

      storySegments.push(fragment);
    }

    return storySegments;
  };

  return (
    <View style={styles.container}>
      {renderTouchableStorySegment()}
    </View>
  );
};

export default StorySegmentIndicator;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },

  itemView: {
    flex: 1,
    borderRadius: 2,
  },
});

import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import StorySegment from "./StorySegment";

const HEIGHT: number = 3;

type Props = {
  segmentDurationInSeconds: number;
  numberOfSegments: number;
  currentSegment: number;
  onCurrentSegmentReset: (segment: number) => void;
  onNewSegmentTapped: (segment: number) => void;
  onSegmentCompleted: (segment: number) => void;
};

/**
 * This component displays a horizontal bar that mimics an instagram-style story indicator
 * @param segmentDurationInSeconds the duration of each segment in seconds
 * @param numberOfSegments the number segments in the story
 * @param currentSegment the current segment that is being displayed
 * @param onCurrentSegmentReset the callback to be invoked when the current segment is reset by tapping on it
 * @param onNewSegmentTapped the callback to be invoked when a segment is tapped
 * @param onSegmentCompleted the callback to be invoked when a segment has completed
 */
const StorySegmentIndicator: FC<Props> = ({
  segmentDurationInSeconds,
  numberOfSegments,
  currentSegment,
  onCurrentSegmentReset,
  onNewSegmentTapped,
  onSegmentCompleted,
}) => {
  // facilitates current segment progress as a percentage from 0 to 100
  const [currentSegmentProgress, setCurrentSegmentProgress] = useState<number>(0);
  const unsubscribe: any = useRef(); // facilitates interval management

  // configures the component to update progress of the current segment
  // this is time-based, based on the segmentDurationInSeconds prop
  useEffect(() => {
    const updateProgress = () => {
      setCurrentSegmentProgress((prevProgress: number) => {
        if (prevProgress >= 100) {
          cleanupTimer();
          return prevProgress;
        } else {
          return prevProgress >= 100 ? 100 : prevProgress + 1;
        }
      });
    };

    // only configure interval if the current segment is not the last segment
    if (currentSegment < numberOfSegments) {
      console.debug(`[StorySegmentIndicator] setting up for segment: ${currentSegment} - reset progress & configure timer`);
      setCurrentSegmentProgress(0);
      const intervalDurationInMillis = (segmentDurationInSeconds * 1000) / 100;
      unsubscribe.current = setInterval(updateProgress, intervalDurationInMillis);
    }

    return cleanupTimer;
  }, [currentSegment]);

  // manages notifying the consumer about completion of the current segment
  useEffect(() => {
    if (currentSegmentProgress === 100) {
      onSegmentCompleted(currentSegment);
    }
  }, [currentSegmentProgress]);

  const cleanupTimer = () => {
    if (unsubscribe.current) {
      console.debug(`[StorySegmentIndicator] cleaning up interval timer for segment ${currentSegment}`);
      clearInterval(unsubscribe.current);
      unsubscribe.current = null;
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
        <Fragment key={`fragmentWrapper-${i}`}>
          <TouchableOpacity
            key={`touchableWrapper-${i}`}
            onPress={() => {
              if (currentSegment === i) {
                setCurrentSegmentProgress(0);
                onCurrentSegmentReset(i);
              } else {
                onNewSegmentTapped(i);
              }
            }}
            style={{ ...styles.itemView, height: HEIGHT }}
            hitSlop={{ top: 10, left: 0, bottom: 10, right: 0 }}>
            <StorySegment key={`storySegment-${i}`} progressPercentage={progressPercentage} height={HEIGHT} />
          </TouchableOpacity>

          {/*Add margin in between story segments when relevant*/}
          {i !== numberOfSegments - 1 && <View key={`marginView-${i}`} style={{ width: 8 }} />}
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
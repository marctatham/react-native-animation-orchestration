import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import StorySegmentIndicator from "./components/story/StorySegmentIndicator";

function AnimationScreen(): JSX.Element {
  const [currentSegment, setCurrentSegment] = useState<number>(0);

  const onCurrentSegmentResetHandler = (segment: number) => {
    console.debug(`[AnimationScreen] Segment ${segment} reset`);
  };

  const onNewSegmentTappedHandler = (segment: number) => {
    console.debug(`[AnimationScreen] Segment ${segment} tapped`);
    setCurrentSegment(segment);
  };

  const onSegmentCompletedHandler = (segment: number) => {
    console.debug(`[AnimationScreen] Segment ${segment} completed`);
    setCurrentSegment(previousSegment => previousSegment + 1);
  };

  return (
    <SafeAreaView style={styles.screen}>

      <StorySegmentIndicator
        currentSegment={currentSegment}
        numberOfSegments={4}
        onCurrentSegmentReset={onCurrentSegmentResetHandler}
        onNewSegmentTapped={onNewSegmentTappedHandler}
        onSegmentCompleted={onSegmentCompletedHandler}
        segmentDurationInSeconds={2}
      />

    </SafeAreaView>
  );
}

export default AnimationScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },
});

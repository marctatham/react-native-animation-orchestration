import { StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import StorySegmentIndicator from "./components/story/StorySegmentIndicator";

function AnimationScreen(): JSX.Element {

  const onSegmentTappedHandler = (segment: number) => {
    console.debug(`[AnimationScreen] Segment ${segment} tapped`);
  };

  const onSegmentCompletedHandler = (segment: number) => {
    console.debug(`[AnimationScreen] Segment ${segment} completed`);
  };

  return (
    <SafeAreaView style={styles.screen}>

      <StorySegmentIndicator
        currentSegment={1}
        numberOfSegments={4}
        onSegmentTapped={onSegmentTappedHandler}
        onSegmentCompleted={onSegmentCompletedHandler}
        segmentDurationInSeconds={4}
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

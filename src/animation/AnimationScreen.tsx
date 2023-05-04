import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import StorySegmentIndicator from "./components/storyIndicator/StorySegmentIndicator";
import StoryDescription from "./components/StoryDescription";

function AnimationScreen(): JSX.Element {
  const [currentSegment, setCurrentSegment] = useState<number>(3);

  const onCurrentSegmentResetHandler = (segment: number) => {
    console.debug(`[AnimationScreen] Segment ${segment} reset`);
  };

  const onNewSegmentTappedHandler = (segment: number) => {
    console.debug(`[AnimationScreen] Segment ${segment} tapped`);
    setCurrentSegment(segment);
  };

  const onSegmentCompletedHandler = (segment: number) => {
    if (currentSegment < 3) {
      setCurrentSegment(previousSegment => previousSegment + 1);
      console.debug(`[AnimationScreen] Segment ${segment} completed, starting next segment`);
    } else {
      console.debug(`[AnimationScreen] Segment ${segment} completed`);
    }
  };

  const onLottieAnimationComplete = () => {
    console.debug(`[AnimationScreen] onLottieAnimationComplete`);
  };

  return (
    <SafeAreaView style={styles.screen}>

      <View style={styles.sectionHeader}>
        <StorySegmentIndicator
          currentSegment={currentSegment}
          numberOfSegments={4}
          onCurrentSegmentReset={onCurrentSegmentResetHandler}
          onNewSegmentTapped={onNewSegmentTappedHandler}
          onSegmentCompleted={onSegmentCompletedHandler}
          segmentDurationInSeconds={2}
        />
        <StoryDescription segment={currentSegment} />
      </View>

      <View style={styles.sectionBody}>
        <LottieView
          source={require("../../assets/animations/animation_1.json")}
          loop={false}
          autoPlay={true}
          style={styles.animation}
          onAnimationFinish={onLottieAnimationComplete}
        />
      </View>

    </SafeAreaView>
  );
}

export default AnimationScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
  },

  sectionHeader: {
    flex: 1,
    flexDirection: "column",
  },
  sectionBody: {
    flex: 4,
    justifyContent: "center",
    alignContent: "center",
  },

  animation: {
    flex: 1,
  },
});
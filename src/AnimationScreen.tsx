import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
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
        <Text style={styles.title}>Story Part 1</Text>
        <Text style={styles.description}>This is the text to support part one of the story.</Text>
      </View>

      <View style={styles.sectionBody}>
        <LottieView
          source={require("../assets/animations/animation_1.json")}
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

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 12,
  },
  description: {
    fontSize: 18,
    color: "#FFF",
  },

  animation: {
    flex: 1,
  },
});

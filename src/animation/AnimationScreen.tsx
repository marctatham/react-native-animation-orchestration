import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView, { AnimationObject } from "lottie-react-native";
import StorySegmentIndicator from "./components/storyIndicator/StorySegmentIndicator";
import StoryDescription from "./components/StoryDescription";
import { ANIMATION_0, ANIMATION_1, ANIMATION_2, ANIMATION_3 } from "./AnimationScreenUtils";

function AnimationScreen(): JSX.Element {

  const [storyPart, setStoryPart] = useState<number>(0);
  const [currentSegment, setCurrentSegment] = useState<number>(0);
  const [animation, setAnimation] = useState<AnimationObject>();

  /**
   * Drives the story forward
   * The storyPart represents where we are within the current sequence of events
   */
  useEffect(() => {
    switch (storyPart) {
      case 0:
        setCurrentSegment(0);
        setAnimation(ANIMATION_0);
        break;
      case 1:
        setCurrentSegment(1);
        setAnimation(ANIMATION_1);
        break;
      case 2:
        setCurrentSegment(2);
        setAnimation(ANIMATION_2);
        break;
      case 3:
        setCurrentSegment(3);
        setAnimation(ANIMATION_3);
        break;

      default:
        console.warn(`Story part unhandled: ${storyPart}`);
    }
  }, [storyPart]);

  const onCurrentSegmentResetHandler = (segment: number) => {
    console.debug(`[AnimationScreen] Segment ${segment} reset`);
  };

  const onNewSegmentTappedHandler = (segment: number) => {
    console.debug(`[AnimationScreen] Segment ${segment} tapped`);
  };

  const onSegmentCompletedHandler = (segment: number) => {
    if (currentSegment < 3) {
      setStoryPart(previousStoryPart => previousStoryPart + 1);
      console.debug(`[AnimationScreen] Segment ${segment} completed, starting next segment`);
    } else {
      console.debug(`[AnimationScreen] Segment ${segment} completed`);
    }
  };

  const onLottieAnimationComplete = () => {
    console.debug(`[AnimationScreen] onLottieAnimationComplete`);
    // we ignore this callback for now, but we'll come back to it later when we start incorporating fade transitions
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
          segmentDurationInSeconds={4}
        />
        <StoryDescription segment={currentSegment} />
      </View>

      <View style={styles.sectionBody}>
        <LottieView
          // @ts-ignore - Can safely be ignored as it's actively managed is never left empty
          source={animation}
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

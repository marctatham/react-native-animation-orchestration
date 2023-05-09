import { Animated, InteractionManager, StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView, { AnimationObject } from "lottie-react-native";
import StorySegmentIndicator from "./components/storyIndicator/StorySegmentIndicator";
import StoryDescription from "./components/StoryDescription";
import { ANIMATION_0, ANIMATION_1, ANIMATION_2, ANIMATION_3 } from "./AnimationScreenUtils";

const FADE_DURATION: number = 750;

function AnimationScreen(): JSX.Element {

  const [storyPart, setStoryPart] = useState<number>(0);
  const [currentSegment, setCurrentSegment] = useState<number>(0);
  const [currentDescription, setCurrentDescription] = useState<number>(0);
  const [animation, setAnimation] = useState<AnimationObject>();

  // local refs to facilitate imperative animation control
  const refLottie = useRef<LottieView>(null);
  const descriptionFadeAnimation = useRef(new Animated.Value(1)).current;

  /**
   * Drives the story forward
   * The storyPart represents where we are within the current sequence of events
   */
  useEffect(() => startStoryPart(storyPart), [storyPart]);

  const startStoryPart = (part: number) => {
    switch (part) {
      case 0: // Begin Segment 0
        setCurrentSegment(0);
        setCurrentDescription(0);
        setAnimation(ANIMATION_0);
        InteractionManager.runAfterInteractions(() => resetAndPlayCurrentLottie());
        break;

      case 1: // Signals completion of segment 0, fade out old description
        descriptionFadeAnimation.setValue(1);
        Animated.timing(descriptionFadeAnimation, {
          toValue: 0,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }).start(() => incrementStoryPart());
        break;

      case 2: // set new description, fade in new description
        descriptionFadeAnimation.setValue(0);
        setCurrentDescription(1);
        setAnimation(ANIMATION_1);
        Animated.timing(descriptionFadeAnimation, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }).start(() => incrementStoryPart());
        break;

      case 3: // Begin Segment 1
        setCurrentSegment(1);
        setCurrentDescription(1);
        setAnimation(ANIMATION_1);
        InteractionManager.runAfterInteractions(() => resetAndPlayCurrentLottie());
        break;

      case 4: // Begin Segment 2
        setCurrentSegment(2);
        setCurrentDescription(2);
        setAnimation(ANIMATION_2);
        InteractionManager.runAfterInteractions(() => resetAndPlayCurrentLottie());
        break;

      case 5: // Begin Segment 3 (final segment)
        setCurrentSegment(3);
        setCurrentDescription(3);
        setAnimation(ANIMATION_3);
        InteractionManager.runAfterInteractions(() => resetAndPlayCurrentLottie());
        break;

      default:
        console.info(`Story part unhandled: ${storyPart}`);
    }
  };

  const incrementStoryPart = () => setStoryPart(previousStoryPart => previousStoryPart + 1);

  const resetAndPlayCurrentLottie = () => {
    refLottie.current?.reset();
    refLottie.current?.play();
  };

  const onCurrentSegmentResetHandler = (segment: number) => {
    console.debug(`[AnimationScreen] Segment Reset: ${segment} `);
    const derivedStoryPart = deriveStoryPartFromSegment(segment);
    startStoryPart(derivedStoryPart);
  };

  const onNewSegmentTappedHandler = (segment: number) => {
    console.debug(`[AnimationScreen] New Segment tapped: ${segment}`);
    const derivedStoryPart = deriveStoryPartFromSegment(segment);
    setStoryPart(derivedStoryPart);
  };

  const onSegmentCompletedHandler = (segment: number) => {
      console.debug(`[AnimationScreen] Segment Completed: ${segment}`);
      incrementStoryPart();
  };

  const onLottieAnimationComplete = () => {
    console.debug(`[AnimationScreen] onLottieAnimationComplete`);
    // we ignore this callback for now, but we'll come back to it later when we start incorporating fade transitions
  };

  const deriveStoryPartFromSegment = (segment: number) => {
    // TODO: flesh out mapping of story segments to an exact story part
    switch (segment) {
      case 0: return 0;
      case 1: return 3;
      case 2: return 4;
      case 3: return 5;
      default:
        console.warn(`TODO: let's finish fleshing this derivation logic when the rest of the orchestration is in place`);
        return 0;
    }
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
        <Animated.View style={{ opacity: descriptionFadeAnimation }}>
          <StoryDescription segment={currentDescription} />
        </Animated.View>
      </View>

      <View style={styles.sectionBody}>
        <LottieView
          ref={refLottie}
          // @ts-ignore - Can safely be ignored as it's actively managed is never left empty
          source={animation}
          loop={false}
          autoPlay={false}
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

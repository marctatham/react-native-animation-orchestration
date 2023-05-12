import { Animated, Platform, StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView, { AnimationObject } from "lottie-react-native";
import StorySegmentIndicator from "./components/storyIndicator/StorySegmentIndicator";
import StoryDescription from "./components/StoryDescription";
import { ANIMATION_0, ANIMATION_1, ANIMATION_2, ANIMATION_3 } from "./AnimationScreenUtils";

const FADE_DURATION_IN_MILLIS: number = 750;
const STORY_SEGMENT_DURATION_IN_SECONDS: number = 4;

function AnimationScreen(): JSX.Element {
  // local state to support the various aspects of the animation sequence
  const [storyPart, setStoryPart] = useState<number>(0);
  const [currentSegment, setCurrentSegment] = useState<number>(0);
  const [currentDescription, setCurrentDescription] = useState<number>(0);
  const [animation, setAnimation] = useState<AnimationObject>();

  // local refs to facilitate imperative animation control
  const refLottie = useRef<LottieView>(null);
  const descriptionFadeAnimation = useRef(new Animated.Value(1)).current;
  const multiSectionFadeAnimation = useRef(new Animated.Value(1)).current;
  const refTimeoutHandle: any = useRef<number>();

  /**
   * Drives the story forward
   * The storyPart represents where we are within the current sequence of events
   */
  useEffect(() => {
    startStoryPart(storyPart)

    return () => cleanup();
  }, [storyPart]);

  const startStoryPart = (part: number) => {
    cleanup(); // no harm in calling cleanup before starting a new story part #safetyfirst

    switch (part) {
      case 0: // Begin Segment 0
        multiSectionFadeAnimation.setValue(1);
        descriptionFadeAnimation.setValue(1);
        setCurrentSegment(0);
        setCurrentDescription(0);
        setAnimation(ANIMATION_0);
        resetAndPlayCurrentLottie();
        break;

      case 1: // Signals completion of segment 0, fade out old description
        descriptionFadeAnimation.setValue(1);
        Animated.timing(descriptionFadeAnimation, {
          toValue: 0,
          duration: FADE_DURATION_IN_MILLIS,
          useNativeDriver: true,
        }).start(onFadeCompleteIncrementingHandler);
        break;

      case 2: // set new description, fade in new description
        descriptionFadeAnimation.setValue(0);
        setCurrentDescription(1);
        setAnimation(ANIMATION_1);
        Animated.timing(descriptionFadeAnimation, {
          toValue: 1,
          duration: FADE_DURATION_IN_MILLIS,
          useNativeDriver: true,
        }).start(onFadeCompleteIncrementingHandler);
        break;

      case 3: // Begin Segment 1, play lottie & begin timer to invoke the next storyPart
        multiSectionFadeAnimation.setValue(1);
        descriptionFadeAnimation.setValue(1);
        setCurrentSegment(1);
        setCurrentDescription(1);
        setAnimation(ANIMATION_1);
        resetAndPlayCurrentLottie();

        // begin timer to invoke the next storyPart shortly before the next segment begins
        // in particular we want to support the fade out, the subsequent fade in & a little extra wiggle room
        const timeoutInMillis = (STORY_SEGMENT_DURATION_IN_SECONDS * 1000) - (FADE_DURATION_IN_MILLIS * 2);
        refTimeoutHandle.current = setTimeout(onTimeoutIncrementingHandler, timeoutInMillis);
        break;

      case 4: // lottie animation complete, fade out (multi-section)
        multiSectionFadeAnimation.setValue(1);
        Animated.timing(multiSectionFadeAnimation, {
          toValue: 0,
          duration: FADE_DURATION_IN_MILLIS,
          useNativeDriver: true,
        }).start(onFadeCompleteIncrementingHandler);
        break;

      case 5: // set new animation & description, fade in new multi-section
        setCurrentDescription(2);
        setAnimation(ANIMATION_2);
        Animated.timing(multiSectionFadeAnimation, {
          toValue: 1,
          duration: FADE_DURATION_IN_MILLIS,
          useNativeDriver: true,
        }).start((endResult: Animated.EndResult) => {
          // We do not need this to increment the storyPart. This fadeAnimation completes before this
          // StorySegment completes. And by simply doing nothing here, we allow the StorySegment to
          // complete and begin the next Segment by playing the animation, which is a more visually
          // appealing effect.
          console.debug(`[AnimationScreen]-[onFadeAnimationCompleteHandler] check ${JSON.stringify(endResult)} - result has no impact on animation sequence, wait for completion of story segment`);
        });
        break;

      case 6: // Begin Segment 2
        multiSectionFadeAnimation.setValue(1);
        descriptionFadeAnimation.setValue(1);
        setCurrentSegment(2);
        setCurrentDescription(2);
        setAnimation(ANIMATION_2);
        resetAndPlayCurrentLottie();
        break;

      case 7: // Begin Segment 3 (final segment)
        multiSectionFadeAnimation.setValue(1);
        descriptionFadeAnimation.setValue(1);
        setCurrentSegment(3);
        setCurrentDescription(3);
        setAnimation(ANIMATION_3);
        resetAndPlayCurrentLottie();
        break;

      case 8:
        console.info(`animation sequence completed.`);
        break;

      default:
        console.info(`Story part unhandled: ${storyPart}`);
    }
  };

  const incrementStoryPart = () => setStoryPart(previousStoryPart => {
    const nextIncrement = previousStoryPart + 1;
    console.debug(`[AnimationScreen]-[INCREMENTING] to ${nextIncrement}`);
    return nextIncrement;
  });

  const resetAndPlayCurrentLottie = () => {
    refLottie.current?.reset();
    refLottie.current?.play();
  };

  const stopAnyFadeAnimations = () => {
    descriptionFadeAnimation.stopAnimation();
    multiSectionFadeAnimation.stopAnimation();
  };

  const cleanup = (): void => {
    if (refTimeoutHandle.current) {
      console.debug(`[AnimationScreen]-[cleanup] timeoutHandle: ${refTimeoutHandle.current}`);
      clearInterval(refTimeoutHandle.current);
      refTimeoutHandle.current = null;
    }
  };

  // explicitly stops any potential animations that may be in progress, begins playing at the appropriate storyPart
  const onStorySegmentTappedHandler = (segment: number) => {
    stopAnyFadeAnimations();
    const derivedStoryPart = deriveStoryPartFromSegment(segment);

    console.debug(`[AnimationScreen] [StorySegment] tapped: ${segment}, derived story part: ${derivedStoryPart}`);
    if (derivedStoryPart === storyPart) {
      startStoryPart(derivedStoryPart);
    } else {
      setStoryPart(derivedStoryPart);
    }
  };

  const onStorySegmentCompleted = (segment: number) => {
    console.debug(`[AnimationScreen] [StorySegment] Completed: ${segment}`);
    incrementStoryPart();
  };

  /**
   * Increments the storyPart upon successful completion of a fade animation
   *
   * If the animation did not complete, this indicates an interruption to the animation sequence such
   * as changing the segment via the StorySegmentIndicator. Cancelled animations are therefore ignored.
   * @param endResult The EndResult indicating the successful completion state of the animation
   */
  const onFadeCompleteIncrementingHandler = (endResult: Animated.EndResult) => {
    const hasEndResult: boolean = endResult === undefined || endResult.finished;
    if (hasEndResult) {
      console.debug(`[AnimationScreen]-[onFadeCompleteIncrementingHandler] check ${JSON.stringify(endResult)} - incrementing`);
      incrementStoryPart();
    } else {
      console.debug(`[AnimationScreen]-[onFadeCompleteIncrementingHandler] check ${JSON.stringify(endResult)} - IGNORED`);
    }
  };

  const onTimeoutIncrementingHandler = () => {
    console.debug(`[AnimationScreen]-[onTimeoutIncrementingHandler] proceed to increment story part`);
    incrementStoryPart();
  }

  const deriveStoryPartFromSegment = (segment: number) => {
    switch (segment) {
      case 0:
        return 0;
      case 1:
        return 3;
      case 2:
        return 6;
      case 3:
        return 7;
      default:
        console.warn(`TODO: let's finish fleshing this derivation logic when the rest of the orchestration is in place`);
        return 0;
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/*Android benefits from some additional margin at the top of the screen*/}
      {Platform.OS === "android" && <View style={{ height: 16 }} />}

      <StorySegmentIndicator
        currentSegment={currentSegment} // 0-indexed
        numberOfSegments={4}
        onStorySegmentTapped={onStorySegmentTappedHandler}
        onStorySegmentCompleted={onStorySegmentCompleted}
        segmentDurationInSeconds={STORY_SEGMENT_DURATION_IN_SECONDS} />

      <Animated.View style={{ flex: 1, opacity: multiSectionFadeAnimation }}>
        <Animated.View style={{ ...styles.sectionHeader, opacity: descriptionFadeAnimation }}>
          <StoryDescription segment={currentDescription} />
        </Animated.View>

        <View style={styles.sectionBody}>
          <LottieView
            ref={refLottie}
            // @ts-ignore - Can safely be ignored as it's actively managed is never left empty
            source={animation}
            loop={false}
            autoPlay={false}
            style={styles.animation}
            // onAnimationFinish={...} Note: avoid relying on this as a callback
            // while it works reliably on iOS but android, which receives duplicate
            // calls with an isCancelled argument that can not be relied upon.
          />
        </View>
      </Animated.View>

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

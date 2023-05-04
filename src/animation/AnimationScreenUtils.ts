import { AnimationObject } from "lottie-react-native";

export const resolveAnimationObject = (currentSegment: number):AnimationObject => {
  switch (currentSegment) {
    case 0:
      return require("../../assets/animations/animation_1.json");

    case 1:
      return require("../../assets/animations/animation_2.json");

    case 2:
      return require("../../assets/animations/animation_3.json");

    case 3:
      return require("../../assets/animations/animation_4.json");

    default:
      throw new Error(`Unknown segment: ${currentSegment}`);
  }
}

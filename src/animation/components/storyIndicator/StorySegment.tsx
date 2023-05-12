import React, { PureComponent } from "react";
import { View } from "react-native";

export interface Props {
  progressPercentage: number;
  height: number;
}

class StorySegment extends PureComponent<Props> {
  render(): React.ReactNode {
    const { progressPercentage, height } = this.props;

    return (
      <View style={{ height: height }}>
        <View
          style={{
            flex: 1,
            height: height,
            backgroundColor: "#FCFCFC",
            opacity: 0.2,
          }}
        />

        <View
          style={{
            height: height,
            borderRadius: 2,
            backgroundColor: "#FCFCFC",
            opacity: 1,
            position: "absolute",
            left: 0,
            top: 0,
            width: `${progressPercentage}%`,
          }}
        />
      </View>
    );
  }
}

export default StorySegment;

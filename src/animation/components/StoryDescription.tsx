import React, { PureComponent } from "react";
import { StyleSheet, Text, View } from "react-native";

export interface Props {
  segment: number;
}

/**
 * This component is used to render the description of the story,
 * as is appropriate for the current segment
 */
class StoryDescription extends PureComponent<Props> {
  renderPart1(): JSX.Element {
    return (
      <View style={styles.textContainer}>
        <Text style={styles.title}>Story Part 1</Text>
        <Text style={styles.description}>This is the text to support part one of the story.</Text>
      </View>
    );
  }

  renderPart2(): JSX.Element {
    return (
      <View style={styles.textContainer}>
        <Text style={styles.title}>Story Part 2</Text>
        <Text style={styles.description}>Part 2 looks notably different.</Text>
      </View>
    );
  }

  renderPart3(): JSX.Element {
    return (
      <View style={styles.textContainer}>
        <Text style={styles.title}>Story Part 3</Text>
        <Text style={styles.description}>Here's some more supporting text to support part 3 of the instagram-style
          story</Text>
      </View>
    );
  }

  renderPart4(): JSX.Element {
    return (
      <View style={styles.textContainer}>
        <Text style={styles.title}>Story Part 4</Text>
        <Text style={styles.description}>Part 4 looks notably different again!</Text>
      </View>
    );
  }

  render(): React.ReactNode {
    switch (this.props.segment) {
      case 0:
        return this.renderPart1();

      case 1:
        return this.renderPart2();

      case 2:
        return this.renderPart3();

      case 3:
        return this.renderPart4();

      default:
        throw new Error(`Unknown segment: ${this.props.segment}`);
    }
  }
}

export default StoryDescription;

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: "column",
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
});

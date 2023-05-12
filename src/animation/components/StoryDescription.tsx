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
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse suscipit tellus ligula, non tincidunt
          erat tempus eu. Vivamus sed ultricies.
        </Text>
      </View>
    );
  }

  renderPart2(): JSX.Element {
    return (
      <View style={styles.textContainer}>
        <Text style={styles.title}>Story Part 2</Text>
        <Text style={styles.description}>
          Integer pretium quam eu molestie mollis. Mauris non ex varius, finibus urna sed, pharetra libero. Quisque sit
          amet nisi sed.
        </Text>
      </View>
    );
  }

  renderPart3(): JSX.Element {
    return (
      <View style={styles.textContainer}>
        <Text style={styles.title}>Story Part 3</Text>
        <Text style={styles.description}>
          Nullam sit amet convallis nibh. Morbi id interdum purus. Cras fringilla sit amet lectus quis laoreet. Aliquam
          aliquam sagittis erat.
        </Text>
      </View>
    );
  }

  renderPart4(): JSX.Element {
    return (
      <View style={styles.textContainer}>
        <Text style={styles.title}>Story Part 4</Text>
        <Text style={styles.description}>
          Etiam dapibus, magna id placerat laoreet, mauris lectus mollis nisl, in pellentesque est nisi eu leo. Sed sed
          nisi ornare.
        </Text>
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

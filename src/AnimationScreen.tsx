import { StyleSheet } from "react-native";
import React from "react";
import Section from "./Section";
import { SafeAreaView } from "react-native-safe-area-context";

function AnimationScreen(): JSX.Element {
  return (
    <SafeAreaView>
      <Section title="Step One">
        TODO: flesh out animation sequence here
      </Section>
    </SafeAreaView>
  );
}

export default AnimationScreen;

const styles = StyleSheet.create({
  // any relevant styles here
});

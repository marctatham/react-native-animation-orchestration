import { Button, useColorScheme, View } from "react-native";
import { Colors, Header } from "react-native/Libraries/NewAppScreen";
import React from "react";
import Section from "./Section";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "./navigation/RootNavigator";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

function DefaultScreen(): JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const isDarkMode = useColorScheme() === "dark";

  const buttonHandler = () => navigation.navigate("AnimationScreen");

  return (
    <SafeAreaView>
      <Header />
      <View style={{ height: "100%", backgroundColor: isDarkMode ? Colors.black : Colors.white }}>
        <Section title="Step One">Click the button to begin the animation sequence.</Section>
        <Button title="Start" onPress={buttonHandler} />
      </View>
    </SafeAreaView>
  );
}

export default DefaultScreen;

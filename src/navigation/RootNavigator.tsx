import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DefaultScreen from "../DefaultScreen";
import AnimationScreen from "../animation/AnimationScreen";

const Stack = createNativeStackNavigator();

export type StackParamList = {
  DefaultScreen: undefined;
  AnimationScreen: undefined;
};

export const RootNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator initialRouteName={"DefaultScreen"}>
      <Stack.Screen
        name="DefaultScreen"
        component={DefaultScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="AnimationScreen"
        component={AnimationScreen}
        options={{ title: "Animation" }}
      />
    </Stack.Navigator>
  );
};

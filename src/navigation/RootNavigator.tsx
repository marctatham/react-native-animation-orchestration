import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DefaultScreen from "../DefaultScreen";

const Stack = createNativeStackNavigator();

export type StackParamList = {
  DefaultScreen: undefined;
};

export const RootNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator initialRouteName={"DefaultScreen"}>
      <Stack.Screen
        name="DefaultScreen"
        component={DefaultScreen}
        options={{ title: "Home" }}
      />
    </Stack.Navigator>
  );
};

import "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { HomeScreen, VideoScreen, VideoPlayerScreen } from "./src";

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

const SettingsStack = createStackNavigator();

function VideoStackScreen() {
  return (
    <SettingsStack.Navigator mode="modal" headerMode="none">
      <SettingsStack.Screen name="Video" component={VideoScreen} />
      <SettingsStack.Screen name="Video Player" component={VideoPlayerScreen} />
    </SettingsStack.Navigator>
  );
}
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <HomeScreen />
    // <NavigationContainer>
    //   <Tab.Navigator
    //     screenOptions={({ route }) => ({
    //       tabBarIcon: ({ color, size }) => {
    //         let iconName: "ios-home" | "ios-videocam" = "ios-home";
    //         if (route.name === "Video") {
    //           iconName = "ios-videocam";
    //         }
    //         return <Ionicons name={iconName} size={size} color={color} />;
    //       },
    //     })}
    //   >
    //     <Tab.Screen name="Home" component={HomeStackScreen} />
    //     <Tab.Screen name="Video" component={VideoStackScreen} />
    //   </Tab.Navigator>
    // </NavigationContainer>
  );
}

import "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { HomeScreen, VideoScreen } from "./src";

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
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Video" component={VideoScreen} />
    </SettingsStack.Navigator>
  );
}
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = "ios-home";

            if (route.name === "Home") {
              iconName = "ios-home";
            } else if (route.name === "Video") {
              iconName = "ios-videocam";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Video" component={VideoStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

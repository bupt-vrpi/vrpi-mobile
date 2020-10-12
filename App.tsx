import "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { askAsync, MOTION } from "expo-permissions";
import { Accelerometer, Gyroscope, DeviceMotion } from "expo-sensors";
import React from "react";

import HomeScreen from "./src/HomeScreen";
import VideoScreen from "./src/VideoScreen";

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

async function getPermission() {
  const { status } = await askAsync(MOTION);
  if (status === "granted") {
    if (!(await Accelerometer.isAvailableAsync())) {
      throw new Error("Accelerometer sensor is not available");
    }
    if (!(await Gyroscope.isAvailableAsync())) {
      throw new Error("Gyroscope sensor is not available");
    }
    if (!(await DeviceMotion.isAvailableAsync())) {
      throw new Error("DeviceMotion sensor is not available");
    }
  } else {
    throw new Error("Motion permission not granted");
  }
}

export default function App() {
  getPermission();

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

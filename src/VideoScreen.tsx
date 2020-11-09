import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { Button, View, Text } from "react-native";

export const VideoScreen: FC<StackScreenProps<
  Record<string, object | undefined>
>> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 30 }}>This is the home screen!</Text>
      <Button
        onPress={() => navigation.navigate("Video Player")}
        title="Open Modal"
      />
    </View>
  );
};

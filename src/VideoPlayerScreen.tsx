import { Asset } from "expo-asset";
import { Video } from "expo-av";
import { lockAsync, OrientationLock } from "expo-screen-orientation";
import React, { useEffect, useState } from "react";
import { Dimensions, ScaledSize } from "react-native";

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export const VideoPlayerScreen = () => {
  // lockAsync(OrientationLock.LANDSCAPE);
  const [dimensions, setDimensions] = useState({ window, screen });

  const onChange = ({
    window,
    screen,
  }: {
    window: ScaledSize;
    screen: ScaledSize;
  }) => {
    setDimensions({ window, screen });
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });

  return (
    <Video
      source={Asset.fromModule(require("../assets/big_buck_bunny.mp4"))}
      rate={1.0}
      volume={1.0}
      isMuted={false}
      resizeMode="cover"
      shouldPlay
      isLooping
      style={{
        width: dimensions.window.width,
        height: dimensions.window.height / 2,
      }}
    />
  );
};

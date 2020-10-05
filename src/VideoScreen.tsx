import { Video } from "expo-av";
import React from "react";

export default function VideoScreen() {
  return (
    <Video
      source={{
        uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
      }}
      rate={1.0}
      volume={1.0}
      isMuted={false}
      resizeMode="cover"
      shouldPlay
      isLooping
      style={{ width: 300, height: 300 }}
    />
  );
}

import { DeviceMotion } from "expo-sensors";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MediaStream, RTCView } from "react-native-webrtc";

import { createAnswer, createOffer, rtc, sendMessage } from "./utils";

DeviceMotion.setUpdateInterval(5000);

DeviceMotion.addListener(({ rotation }) => {
  sendMessage("rotation", rotation);
});

export const HomeScreen = () => {
  /* const [localStream, setLocalStream] = useState<MediaStream | undefined>(
    undefined
  ); */
  const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>(
    undefined
  );

  useEffect(() => {
    rtc.onaddstream = ({ stream }) => {
      setRemoteStream(stream);
    };
  }, []);

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <RTCView
        style={{ flex: 1 }}
        key={2}
        streamURL={remoteStream?.toURL() ?? ""}
      />

      <TouchableOpacity onPress={createOffer}>
        <View>
          <Text>Offer</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={createAnswer}>
        <View>
          <Text>Answer</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

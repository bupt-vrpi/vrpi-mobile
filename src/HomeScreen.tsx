import { useKeepAwake } from "expo-keep-awake";
import { lockAsync, OrientationLock } from "expo-screen-orientation";
import { DeviceMotion } from "expo-sensors";
import { setStatusBarHidden } from "expo-status-bar";
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
  useKeepAwake();
  const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>(
    undefined
  );

  useEffect(() => {
    lockAsync(OrientationLock.LANDSCAPE);
    setStatusBarHidden(true, "slide");
    rtc.onaddstream = ({ stream }) => {
      setRemoteStream(stream);
    };

    return () => {
      lockAsync(OrientationLock.PORTRAIT);
      setStatusBarHidden(false, "slide");
    };
  }, []);

  return (
    <View
      style={{
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "row",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <RTCView
        style={{ flex: 1 }}
        key={1}
        streamURL={remoteStream?.toURL() ?? ""}
      />
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
      {/* <TouchableOpacity onPress={createAnswer}>
        <View>
          <Text>Answer</Text>
        </View>
      </TouchableOpacity> */}
    </View>
  );
};

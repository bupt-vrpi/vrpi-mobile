import "react-native-gesture-handler";
import { DeviceMotion, DeviceMotionMeasurement } from "expo-sensors";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

const ws = new WebSocket("http://www.vrcar.icu:24800/ws/");

export const HomeScreen = () => {
  const [updateInterval, setUpdateInterval] = useState(50);
  const [deviceMotionData, setDeviceMotionData] = useState({
    acceleration: null,
    accelerationIncludingGravity: { x: 0, y: 0, z: 0 },
    rotation: { alpha: 0, beta: 0, gamma: 0 },
    rotationRate: null,
    interval: 1000,
    orientation: 0,
  } as DeviceMotionMeasurement);

  DeviceMotion.setUpdateInterval(updateInterval);

  useEffect(() => {
    const handler = DeviceMotion.addListener((data) => {
      try {
        ws.send(JSON.stringify(data));
      } catch {}
      setDeviceMotionData(data);
    });

    return () => {
      handler.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>UpdateInterval: {updateInterval}</Text>
      <TouchableOpacity
        onPress={() => setUpdateInterval((oldValue) => oldValue + 10)}
        style={styles.button}
      >
        <Text>Increase</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          setUpdateInterval((oldValue) => oldValue - (oldValue > 10 ? 10 : 0))
        }
        style={styles.button}
      >
        <Text>Decrease</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.text}>Rotation:</Text>
        <Text style={styles.text}>{deviceMotionData.rotation.alpha}</Text>
        <Text style={styles.text}>{deviceMotionData.rotation.beta}</Text>
        <Text style={styles.text}>{deviceMotionData.rotation.gamma}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#eee",
    padding: 10,
  },
  text: {
    textAlign: "center",
  },
});

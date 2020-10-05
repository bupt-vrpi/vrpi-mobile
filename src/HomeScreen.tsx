import "react-native-gesture-handler";
import { askAsync, MOTION } from "expo-permissions";
import {
  Accelerometer,
  Gyroscope,
  DeviceMotion,
  DeviceMotionMeasurement,
  ThreeAxisMeasurement,
} from "expo-sensors";
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

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

let sentA = false;
let sentG = false;
let sentD = false;
const ws = new WebSocket("http://www.vrcar.icu:24800/ws/");

export default function HomeScreen() {
  const [updateInterval, setUpdateInterval] = useState(1000);
  const [accelerometerData, setAccelerometerData] = useState({
    x: 0,
    y: 0,
    z: 0,
  } as ThreeAxisMeasurement);
  const [gyroscopeData, setGyroscopeData] = useState({
    x: 0,
    y: 0,
    z: 0,
  } as ThreeAxisMeasurement);
  const [deviceMotionData, setDeviceMotionData] = useState({
    acceleration: null,
    accelerationIncludingGravity: { x: 0, y: 0, z: 0 },
    rotation: { alpha: 0, beta: 0, gamma: 0 },
    rotationRate: null,
    interval: 1000,
    orientation: 0,
  } as DeviceMotionMeasurement);

  const _setUpdateInterval = (interval: number) => {
    Accelerometer.setUpdateInterval(interval);
    Gyroscope.setUpdateInterval(interval);
    DeviceMotion.setUpdateInterval(interval);
  };

  getPermission()
    .then(() => {
      _setUpdateInterval(updateInterval);

      Accelerometer.addListener((data) => {
        setAccelerometerData((old) => {
          if (sentA && old !== data) {
            ws.send(JSON.stringify(data));
          }
          return data;
        });
      });
      Gyroscope.addListener((data) =>
        setGyroscopeData((old) => {
          if (sentG && old !== data) {
            ws.send(JSON.stringify(data));
          }
          return data;
        })
      );
      DeviceMotion.addListener((data) =>
        setDeviceMotionData((old) => {
          if (sentD && old !== data) {
            ws.send(JSON.stringify(data));
          }
          return data;
        })
      );
    })
    .catch(() => {});

  return (
    <View style={styles.container}>
      <Text style={styles.text}>UpdateInterval: {updateInterval}</Text>
      <TouchableOpacity
        onPress={() => {
          setUpdateInterval((oldValue) => oldValue + 100);
          _setUpdateInterval(updateInterval);
        }}
        style={styles.button}
      >
        <Text>Increase</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setUpdateInterval(
            (oldValue) => oldValue - (oldValue > 100 ? 100 : 0)
          );
          _setUpdateInterval(updateInterval);
        }}
        style={styles.button}
      >
        <Text>Decrease</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => (sentA = !sentA)} style={styles.button}>
        <Text>Sent Accelerometer</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => (sentG = !sentG)} style={styles.button}>
        <Text>Sent Gyroscope</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => (sentD = !sentD)} style={styles.button}>
        <Text>Sent DeviceMotion</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.text}>Accelerometer:</Text>
        <Text style={styles.text}>{accelerometerData.x}</Text>
        <Text style={styles.text}>{accelerometerData.y}</Text>
        <Text style={styles.text}>{accelerometerData.z}</Text>
        <Text style={styles.text}>Gyroscope:</Text>
        <Text style={styles.text}>{gyroscopeData.x}</Text>
        <Text style={styles.text}>{gyroscopeData.y}</Text>
        <Text style={styles.text}>{gyroscopeData.z}</Text>
        <Text style={styles.text}>DeviceMotion:</Text>
        <Text style={styles.text}>
          {JSON.stringify(deviceMotionData.acceleration)}
        </Text>
        <Text style={styles.text}>
          {JSON.stringify(deviceMotionData.rotation)}
        </Text>
        <Text style={styles.text}>
          {JSON.stringify(deviceMotionData.rotationRate)}
        </Text>
        <Text style={styles.text}>{deviceMotionData.orientation}</Text>
      </View>
    </View>
  );
}

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

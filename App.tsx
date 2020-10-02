import { askAsync, MOTION } from "expo-permissions";
import { Accelerometer, Gyroscope, ThreeAxisMeasurement } from "expo-sensors";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";

async function getPermission() {
  const { status } = await askAsync(MOTION);
  if (status === "granted") {
    if (!(await Accelerometer.isAvailableAsync())) {
      throw new Error("Accelerometer sensor is not available");
    }
    if (!(await Gyroscope.isAvailableAsync())) {
      throw new Error("Gyroscope sensor is not available");
    }
  } else {
    throw new Error("Motion permission not granted");
  }
}

export default function App() {
  const [url, setUrl] = useState("");
  const [sent, setSent] = useState(false);
  const [available, setAvailable] = useState(false);
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

  const _setUpdateInterval = (interval: number) => {
    Accelerometer.setUpdateInterval(interval);
    Gyroscope.setUpdateInterval(interval);
  };

  let ws: WebSocket;

  getPermission()
    .then(() => {
      setAvailable(true);

      Accelerometer.addListener((data) => {
        setAccelerometerData(data);
        try {
          ws.send(JSON.stringify(data));
        } catch {}
      });
      Gyroscope.addListener((data) => {
        setGyroscopeData(data);
        // ws.send(JSON.stringify(data));
      });
      _setUpdateInterval(updateInterval);
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
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1, width: 320 }}
        onChangeText={(text) => setUrl(text)}
        value={url}
      />
      <TouchableOpacity
        onPress={() => {
          setSent((oldValue) => {
            try {
              ws.close();
            } catch {}
            if (!oldValue) {
              ws = new WebSocket(url);
            }
            return !oldValue;
          });
        }}
        style={styles.button}
      >
        <Text>Sent: {`${sent}`}</Text>
      </TouchableOpacity>
      {available && (
        <View>
          <Text style={styles.text}>Accelerometer:</Text>
          <Text style={styles.text}>{accelerometerData.x}</Text>
          <Text style={styles.text}>{accelerometerData.y}</Text>
          <Text style={styles.text}>{accelerometerData.z}</Text>
          <Text style={styles.text}>Gyroscope:</Text>
          <Text style={styles.text}>{gyroscopeData.x}</Text>
          <Text style={styles.text}>{gyroscopeData.y}</Text>
          <Text style={styles.text}>{gyroscopeData.z}</Text>
        </View>
      )}
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

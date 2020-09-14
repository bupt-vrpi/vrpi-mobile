import { Accelerometer, Gyroscope, ThreeAxisMeasurement } from 'expo-sensors';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

export default function App() {
  const [data, setData] = useState({} as ThreeAxisMeasurement);
  const [name, setName] = useState('Gyroscope');

  let ip = '';
  let port = '';
  let sent = false;
  let subscription = Gyroscope.addListener((gyroscopeData) => {
    sent && fetch(`http://${ip}:${port}`);
    setData(gyroscopeData);
  });
  let interval: number = 220;

  const _slow = () => {
    interval += 100;
    Gyroscope.setUpdateInterval(interval);
    Accelerometer.setUpdateInterval(interval);
  };

  const _fast = () => {
    if (interval > 20) {
      interval -= 100;
    }
    Gyroscope.setUpdateInterval(interval);
    Accelerometer.setUpdateInterval(interval);
  };

  const _toggle = () => {
    setName((prevName) => {
      subscription.remove();
      if (prevName === 'Gyroscope') {
        subscription = Accelerometer.addListener((accelerometerData) => {
          sent &&
            fetch(`http://${ip}:${port}`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(accelerometerData),
            });
          setData(accelerometerData);
        });
        return 'Accelerometer';
      } else {
        subscription = Gyroscope.addListener((gyroscopeData) => {
          sent &&
            fetch(`http://${ip}:${port}`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(gyroscopeData),
            });
          setData(gyroscopeData);
        });
        return 'Gyroscope';
      }
    });
  };

  const { x, y, z } = data;
  return (
    <View style={styles.sensor}>
      <TextInput style={{ height: 40 }} placeholder="IP" onChangeText={(text) => (ip = text)} />
      <TextInput style={{ height: 40 }} placeholder="Port" onChangeText={(text) => (port = text)} />
      <Text style={styles.text}>{name}</Text>
      <Text style={styles.text}>x: {x}</Text>
      <Text style={styles.text}>y: {y}</Text>
      <Text style={styles.text}>z: {z}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={_toggle} style={styles.button}>
          <Text>Toggle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            sent = !sent;
          }}
          style={styles.button}>
          <Text>Sent</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 45,
    paddingHorizontal: 10,
  },
  text: {
    textAlign: 'center',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Button, FlatList, Text } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const App = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [devices, setDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);
  
    useEffect(() => {
        console.log(1);
      initializeBluetooth();
    }, []);
  
    const bleManager = new BleManager();

    const initializeBluetooth = async () => {
    try {
        const state = await bleManager.state();
        setIsEnabled(state === 'PoweredOn');
    } catch (error) {
        console.log('Failed to check Bluetooth status:', error);
    }
    };

    const enableBluetooth = async () => {
    try {
        await bleManager.enable();
        setIsEnabled(true);
        scanDevices();
    } catch (error) {
        console.log('Failed to enable Bluetooth:', error);
    }
    };

    const scanDevices = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
        console.log('Failed to scan devices:', error);
        return;
        }
        if (!devices.find((existingDevice) => existingDevice.id === device.id)) {
        setDevices((prevDevices) => [...prevDevices, device]);
        }
    });
    };

    const connectToDevice = async (device) => {
    try {
        await device.connect();
        setConnectedDevice(device);
        sendData();
        console.log(`Connected to device: ${device.name}`);
    } catch (error) {
        console.log('Failed to connect to device:', error);
    }
    };

    const sendData = async () => {
    try {
        const message = 'Hello, world!';
        const characteristicUUID = 'your_characteristic_UUID';
        const serviceUUID = 'your_service_UUID';
        await connectedDevice.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        message
        );
        console.log('Data successfully transferred:', message);
    } catch (error) {
        console.log('Failed to send data:', error);
    }
    };
    return (
        <View>
          <Button
            title={isEnabled ? 'Bluetooth Enabled' : 'Enable Bluetooth'}
            onPress={isEnabled ? scanDevices : enableBluetooth}
            disabled={isEnabled}
          />
      
          {devices.length > 0 && (
            <FlatList
              data={devices}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => connectToDevice(item)}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          )}
      
          {connectedDevice && (
            <View>
              <Text>Connected to: {connectedDevice.name}</Text>
              <Button title="Send Data" onPress={sendData} />
            </View>
          )}
        </View>
      );
  }
  export default App;

  
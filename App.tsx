/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevices,
} from 'react-native-vision-camera';
import {Button, Dimensions} from 'react-native';

function App() {
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>();
  const [microphonePermission, setMicrophonePermission] =
    useState<CameraPermissionStatus>();

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission);
    Camera.getMicrophonePermissionStatus().then(setMicrophonePermission);
  }, []);

  if (cameraPermission == null || microphonePermission == null) {
    // still loading
    return null;
  }

  if (device == null || cameraPermission === undefined) {
    return <></>;
  }
  return (
    <>
      <Camera
        device={device!}
        isActive={true}
        style={{
          height: Dimensions.get('window').height - 100,
          width: Dimensions.get('window').width,
        }}
      />
      {/* TODO::use this button to capture */}
      <Button title="Capture" />
    </>
  );
}

export default App;

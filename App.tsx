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
  useFrameProcessor,
} from 'react-native-vision-camera';
import {Button, Dimensions, Platform, useWindowDimensions} from 'react-native';
import {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import 'react-native-reanimated';

function objectDetect(frame: any) {
  'worklet';
  return __objectDetect(frame);
}

function App() {
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>();
  const [microphonePermission, setMicrophonePermission] =
    useState<CameraPermissionStatus>();

  const flag = useSharedValue({height: 0, left: 0, top: 0, width: 0});
  const flagOverlayStyle = useAnimatedStyle(
    () => ({
      backgroundColor: 'blue',
      position: 'absolute',
      ...flag.value,
    }),
    [flag],
  );

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission);
    Camera.getMicrophonePermissionStatus().then(setMicrophonePermission);
  }, []);

  const dimensions = useWindowDimensions();
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const rectangle = objectDetect(frame);

    const xFactor =
      dimensions.width / (Platform.OS === 'ios' ? frame.width : frame.height);
    const yFactor =
      dimensions.height / (Platform.OS === 'ios' ? frame.height : frame.width);

    if (rectangle.x) {
      flag.value = {
        height: rectangle.height * yFactor,
        left: rectangle.x * xFactor,
        top: rectangle.y * yFactor,
        width: rectangle.width * xFactor,
      };
    } else {
      flag.value = {height: 0, left: 0, top: 0, width: 0};
    }
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
        frameProcessor={frameProcessor}
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

import { View, Text, StyleSheet, Pressable, Platform, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialCommunityIcons  } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import * as LocalAuthentication from 'expo-local-authentication';

export default function WelcomeContent() {
  const [input, setInput] = useState([]);

  const codeDots = Array(6).fill(0);

  const offset = useSharedValue(0);
  const style = useAnimatedStyle(()=>{
    return {
        transform: [{translateX: offset.value}]
    }
  })

  const keyboardLayout = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  const bottomKeyboardLayout = [
    <MaterialCommunityIcons name="face-recognition" size={24} color="black" key="facereco"/>,
    <Text style={styles.buttonText} key={0}>
      0
    </Text>,
    <Ionicons name="backspace" size={24} color="black" key="backspace" />,
  ];

  const handleInputPress = (value: any, type: string) => {
    Haptics.selectionAsync();

    if (input.length > 5) {
      return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    if (type === 'number') {
      return setInput((prev) => [...prev, value]);
    }
  };

  const handleBottomInputPress = async(type: any) => {
    Haptics.selectionAsync();

    if(type === 'facereco'){
        const {success} = await LocalAuthentication.authenticateAsync();
        if(success){
            Alert.alert('Success', 'Authenticated', [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ]);
        }
    }

    if (type === 'backspace') {
      const newArray = [...input];
      newArray.pop();
      setInput(newArray);
      return;
    }

    if (input.length > 5) {
      return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    if (type == 0) {
      return setInput((prev) => [...prev, 0]);
    }
  };

  useEffect(()=>{
    
    if(input.length === 6){

        if(input.join('') === '123456'){
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Authenticated', [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ])
        }else{
            offset.value= withSequence(
                withTiming(-20, {duration: 80/2}),
                withRepeat(withTiming(20, {duration: 80}), 4, true),
                withTiming(0, {duration: 80/2}),
            )
             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

    }

  },[input])

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.codeView, style]}>
        {codeDots?.map((_, i) => (
          <View
            key={i}
            style={{
              ...styles.codeDots,
              backgroundColor: input[i] || input[i] === 0 ? 'blue' : 'gray',
            }}
          />
        ))}
      </Animated.View>
      <View style={styles.containerKeyboard}>
        {keyboardLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((number, numIndex) => (
              <Pressable
                android_ripple={{ color: 'gray', borderless: true }}
                style={({ pressed }) => [
                  Platform.select({
                    ios: {
                      backgroundColor: pressed ? 'rgba(0,0,0,0.1)' : 'transparent',
                      borderRadius: '800px',
                    },
                  }),
                ]}
                key={numIndex}
                onPress={() => handleInputPress(number, 'number')}>
                <View style={styles.keys}>
                  <Text style={styles.buttonText}>{number}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ))}
        <View style={styles.row}>
          {bottomKeyboardLayout.map((ele, i) => (
            <Pressable
              android_ripple={{ color: 'gray', borderless: true }}
              style={({ pressed }) => [
                Platform.select({
                  ios: {
                    backgroundColor: pressed ? 'rgba(0,0,0,0.1)' : 'transparent',
                    borderRadius: '800px',
                  },
                }),
              ]}
              key={i}
              onPress={() => {
                handleBottomInputPress(ele.key);
              }}>
              <View style={styles.keys} key={i}>
                {ele}
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  codeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    marginVertical: 100,
  },
  codeDots: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  containerKeyboard: {
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 20,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
    columnGap: 20,
  },
  keys: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

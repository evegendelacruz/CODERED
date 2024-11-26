import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router'
import { KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Octicons, } from '@expo/vector-icons'
import Animated from 'react-native-reanimated'

const DashboardLayout = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarStyle: {
          height: '11%',
          backgroundColor: '#fe0009',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          paddingTop: 12,
          display: isKeyboardVisible ? 'none' : 'flex'
        },
        tabBarShowLabel: false, 
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Animated.View
              style={{
                transform: [{ scale: focused ? 1.2 : 1 }],
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: focused ? 'white' : 'transparent',
                borderRadius: 25, // Makes the background circular
                width: 50,
                height: 50,
              }}
            >
              <Octicons
                name={focused ? 'home' : 'home'}
                size={28}
                color={focused ? 'red' : 'white'}
              />
            </Animated.View>
          ),
        }}
      />
    
      <Tabs.Screen
        name="location"
        options={{
          headerSearchBarOptions: {
                placeholder: 'Search',
                onChangeText: (text) => {
                    // Do something
                },
                },
          title: 'TRACKER',
          tabBarIcon: ({ focused }) => (
            <Animated.View
              style={{
                transform: [{ scale: focused ? 1.2 : 1 }],
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: focused ? 'white' : 'transparent',
                borderRadius: 25, // Makes the background circular
                width: 50,
                height: 50,
              }}
            >
              <Octicons
                name={focused ? 'location' : 'location'}
                size={28}
                color={focused ? 'red' : 'white'}
              />
            </Animated.View>
          ),
        }}
      />

    <Tabs.Screen
            name="event"
            options={{
            title: 'Event',
            tabBarIcon: ({ focused }) => (
                <Animated.View
                style={{
                    transform: [{ scale: focused ? 1.2 : 1 }],
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: focused ? 'white' : 'transparent',
                    borderRadius: 25, // Makes the background circular
                    width: 50,
                    height: 50,
                }}
                >
                <Octicons
                    name={focused ? 'calendar' : 'calendar'}
                    size={28}
                    color={focused ? 'red' : 'white'}
                />
                </Animated.View>
            ),
            }}
        />

      <Tabs.Screen
        name="notif"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ focused }) => (
            <Animated.View
              style={{
                transform: [{ scale: focused ? 1.2 : 1 }],
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: focused ? 'white' : 'transparent',
                borderRadius: 25, 
                width: 50,
                height: 50,
              }}
            >
              <Octicons
                name={focused ? 'bell' : 'bell'}
                size={28}
                color={focused ? 'black' : 'white'}
              />
            </Animated.View>
          ),
        }}
      />
    </Tabs>
  )
}

export default DashboardLayout

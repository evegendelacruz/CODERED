import React from 'react'
import { useFonts } from "expo-font";
import { TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router'
import { Feather } from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {supabase} from "../utils/supabase";

const RootLayout = () => {

  const [loaded] = useFonts({
    Poppins: require("../../assets/font/Poppins-Medium.ttf"),
    PoppinsBold: require("../../assets/font/Poppins-Bold.ttf"),
  });
  

  if (!loaded) {
    return null; 
  }

  return (
    <PaperProvider>
        <SafeAreaProvider>
          <Stack
            screenOptions={{        
              animation: 'fade',
            }}
          >
            <Stack.Screen name="index" options={{headerShown: false, headerStyle: {
                backgroundColor: 'red', elevation: 0
              },}} />
            <Stack.Screen name="portal" options={{
              title: 'PORTAL', 
              headerShown: true,  
              headerStyle: {
                backgroundColor: 'red',
                elevation: 0
              },
              headerTintColor: 'white', 
              headerTitleStyle: {
                fontFamily: 'PoppinsBold', 
                fontSize: 20,
              },
              headerTitleAlign: 'center', 
            }} />
            <Stack.Screen name="register" options={{
              title: 'REGISTRATION', 
              headerShown: true,  
              headerStyle: {
                backgroundColor: 'red',
              },
              headerTintColor: 'white', 
              headerTitleStyle: {
                fontFamily: 'PoppinsBold', 
                fontSize: 20,
              },
              headerTitleAlign: 'center', 
            }} />
            
            <Stack.Screen name="regorganization" options={{
              title: 'REGISTRATION', 
              headerShown: true,  
              headerStyle: {
                backgroundColor: 'red',
              },
              headerTintColor: 'white', 
              headerTitleStyle: {
                fontFamily: 'PoppinsBold', 
                fontSize: 20,
              },
              headerTitleAlign: 'center', 
            }} />

            <Stack.Screen name="bloodtype" options={{ title: 'BLOOD TYPE', 
            headerShown: true,
            headerStyle: {
                backgroundColor: 'red',
              },
              headerTintColor: 'white', // Makes the button and title white
              headerTitleStyle: {
                fontFamily: 'PoppinsBold', // Poppins font for title
                fontSize: 20,
              },
              headerTitleAlign: 'center', // Centers the title
            }} />
            <Stack.Screen name="recover" options={{ title: 'FORGOT PASSWORD', 
            headerShown: true,
            headerStyle: {
                backgroundColor: 'red',
              },
              headerTintColor: 'white', // Makes the button and title white
              headerTitleStyle: {
                fontFamily: 'PoppinsBold', // Poppins font for title
                fontSize: 20,
              },
              headerTitleAlign: 'center', // Centers the title
            }} />

            <Stack.Screen name="dashboard" 
              options={{ 
                title: 'Dashboard',
                headerShown: false 
              }} 
            />
          </Stack>
        </SafeAreaProvider>       
    </PaperProvider>
   
  )
}

export default RootLayout
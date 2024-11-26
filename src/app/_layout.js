import React from 'react'
import { useFonts } from "expo-font";
import { TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router'
import { Feather } from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

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
            <Stack.Screen name="index" options={{headerShown: false, }} />
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

          <Stack.Screen
            name="message"
            options={({ route, navigation }) => ({
              title: 'MESSAGES',
              headerShown: true,
              drawerActiveTintColor: '#fe0009',
              headerStyle: {
                backgroundColor: '#fe0009',
                elevation: 0,
                shadowOpacity: 0,
                shadowOffset: { height: 0, width: 0 },
                shadowRadius: 0,
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                fontFamily: 'PoppinsBold',
                fontSize: 20,
              },
              headerTitleAlign: 'center',

              // Adding the right icon to the header
              headerRight: () => (
                <TouchableOpacity>
                  <Feather name="edit" size={23} color="white" style={{ marginRight: 10 }} />
                </TouchableOpacity>
              ),
            })}
          />
          </Stack>
        </SafeAreaProvider>       
    </PaperProvider>
   
  )
}

export default RootLayout
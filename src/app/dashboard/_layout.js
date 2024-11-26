import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Text } from 'react-native'
import { Button } from 'react-native-paper';
import DrawerContent from '../../components/Drawer';
import {AntDesign, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DrawerLayout() {
    const router = useRouter();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer drawerContent={DrawerContent}>

        <Drawer.Screen
            name="(tabs)"
            options={{
                headerRight: () => (
                    <Button 
                        icon={() => <AntDesign name="message1" size={24} color="white" marginRight={-10} />}
                        title="Info" 
                        onPress={() => router.push('/message')}
                        
                        
                    />
                ),
                drawerLabel: ({ focused }) => (
                <Text
                    style={{
                    fontFamily: 'Poppins',
                    fontSize: 15,
                    marginTop: 5,
                    color: focused ? '#fe0009' : 'gray',
                    }}
                        >HOME</Text>
                        ),
                        title: 'CODE RED',
                        drawerActiveTintColor: '#fe0009',
                        headerStyle: {
                        backgroundColor: '#fe0009', elevation:0
                        },
                        headerTintColor: 'white',
                        headerTitleStyle: {
                        fontFamily: 'PoppinsBold',
                        fontSize: 20,
                        },
                        headerTitleAlign: 'center',
                        drawerIcon: ({ focused }) => (
                        <Octicons
                            name="home"
                            size={20}
                            color={focused ? '#fe0009' : 'gray'}
                        />
                        ),
                    }}
                    />


            <Drawer.Screen
                name="profile"
                options={{
                drawerLabel: ({ focused }) => (
                <Text
                    style={{
                    fontFamily: 'Poppins',
                    fontSize: 15,
                    marginTop: 5,
                    color: focused ? '#fe0009' : 'gray',
                    }}
                    > PROFILE</Text>
                    ),
                    title: 'PROFILE',
                    drawerActiveTintColor: '#fe0009',
                    headerStyle: {
                    backgroundColor: '#fe0009',
                    elevation: 0
                    },
                    headerTintColor: 'white',
                    headerTitleStyle: {
                    fontFamily: 'PoppinsBold',
                    fontSize: 20,
                    },
                    headerTitleAlign: 'center',
                    drawerIcon: ({ focused }) => (
                    <Octicons
                        name="person"
                        size={20}
                        color={focused ? '#fe0009' : 'gray'}
                    />
                    ),
                }}
                />

            <Drawer.Screen
                name="eligibility"
                options={{
                drawerLabel: ({ focused }) => (
                <Text
                    style={{
                    fontFamily: 'Poppins',
                    fontSize: 15,
                    marginTop: 5,
                    color: focused ? '#fe0009' : 'gray',
                    }}
                    >ELIGIBILITY TEST</Text>
                    ),
                    title: 'ELIGIBILITY TEST',
                    drawerActiveTintColor: '#fe0009',
                    headerStyle: {
                    backgroundColor: '#fe0009',
                    },
                    headerTintColor: 'white',
                    headerTitleStyle: {
                    fontFamily: 'PoppinsBold',
                    fontSize: 20,
                    },
                    headerTitleAlign: 'center',
                    drawerIcon: ({ focused }) => (
                    <Octicons
                        name="checklist"
                        size={20}
                        color={focused ? '#fe0009' : 'gray'}
                    />
                    ),
                }}
                />

            <Drawer.Screen
                name="education" // This is the name of the page and must match the url from root
                options={{
                drawerLabel: ({ focused }) => (
                <Text
                    style={{
                    fontFamily: 'Poppins',
                    fontSize: 15,
                    marginTop: 5,
                    color: focused ? '#fe0009' : 'gray',
                    }}
                    > LEARN MORE</Text>
                    ),
                    title: 'LEARN MORE',
                    drawerActiveTintColor: '#fe0009',
                    headerStyle: {
                    backgroundColor: '#fe0009',
                    },
                    headerTintColor: 'white',
                    headerTitleStyle: {
                    fontFamily: 'PoppinsBold',
                    fontSize: 20,
                    },
                    headerTitleAlign: 'center',
                    drawerIcon: ({ focused }) => (
                    <Octicons
                        name="light-bulb"
                        size={20}
                        color={focused ? '#fe0009' : 'gray'}
                    />
                    ),
                }}
                />

        </Drawer>
    </GestureHandlerRootView>
  );

}
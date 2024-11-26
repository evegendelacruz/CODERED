import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function DrawerContent(props) {
    const router = useRouter();
    const year = new Date().getFullYear();

    const handleLogout = async () => {
        router.replace('/');
    };

    const handleProfile = async () => {
        router.push('/dashboard/profile');
    };

    const { top, bottom } = useSafeAreaInsets();

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                {...props}
                scrollEnabled={true}
            >
                <Image 
                    source={require('../../assets/drawerlogo.png')} 
                    style={{ height: 50, width: 200, alignSelf: 'center', marginTop: 15 }} 
                />
                <TouchableOpacity 
                    style={[styles.container, { justifyContent: "center", alignItems: "center", marginTop: 15, marginBottom: -10, borderRadius: 10}]} 
                    onPress={handleProfile}
                >
                    <Image
                        source={require('../../assets/myprofile.png')} 
                        style={styles.avatar}
                    />
                    <View style={styles.textContainer}>
                        <Text
                            style={styles.name}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            Alaiza Rose Olores
                        </Text>
                        <Text
                            style={styles.email}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            olores.alaiza88@gmail.com
                        </Text>
                    </View>
                </TouchableOpacity>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: 5,
                        paddingBottom: 20
                    }}
                >
                </View>
                <DrawerItemList {...props} />
                <DrawerItem
                    label="LOG OUT"
                    icon={({ color, size }) => (
                        <MaterialCommunityIcons name='logout' color={color} size={size} />
                    )}
                    labelStyle={{ fontFamily: 'Poppins' }}
                    onPress={handleLogout}
                />
            </DrawerContentScrollView>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: 20 + bottom
                }}
            >
                <Text style={{fontFamily:'Poppins', fontSize: 10, color:'gray'}}>
                    Copyright &copy; {year}. All rights reserved.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f5f5f5',
        margin: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
        borderRadius: 10
    },
    name: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'PoppinsBold',
    },
    email: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins',
    },
});

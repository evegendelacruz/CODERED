import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function DrawerContent(props) {
    const router = useRouter();
    const year = new Date().getFullYear();
    const [modalVisible, setModalVisible] = useState(false);

    const handleLogout = () => {
        setModalVisible(true);
    };

    const confirmLogout = async () => {
        try {
            await router.replace('/');
        } catch (error) {
            console.error("Error during logout:", error.message);
        } finally {
            setModalVisible(false);
        }
    };

    const cancelLogout = () => {
        setModalVisible(false);
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
                    style={{ height: 50, width: 200, alignSelf: 'flex-start', marginTop: 15 }} 
                />

                <DrawerItemList {...props} />
                <DrawerItem
                    label="Log Out"
                    icon={({ color, size }) => (
                        <Feather name='log-out' color={color} size={18} />
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
                <Text style={{ fontFamily: 'Poppins', fontSize: 10, color: 'gray' }}>
                    Copyright &copy; {year}. All rights reserved.
                </Text>
            </View>

            {/* Modal for Logout */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={modalVisible}
                onRequestClose={cancelLogout}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="logout" size={40} color="#ea3939" />
                        </View>
                        <Text style={styles.modalHeading}>Log Out</Text>
                        <Text style={styles.modalSubtext}>
                            Are you sure you want to log out?
                        </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={cancelLogout}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.logoutButton]}
                                onPress={confirmLogout}
                            >
                                <Text style={styles.logoutButtonText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor:  'rgba(255, 105, 180, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalHeading: {
        fontSize: 18,
        color: 'black',
        marginBottom: 10,
        fontFamily: 'PoppinsBold'
    },
    modalSubtext: {
        fontSize: 14,
        color: 'gray',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Poppins'
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'red',
    },
    cancelButtonText: {
        color: 'red',
        fontFamily: 'PoppinsBold'
    },
    logoutButton: {
        backgroundColor: 'red',
    },
    logoutButtonText: {
        color: 'white',
        fontFamily: 'PoppinsBold'
    },
});
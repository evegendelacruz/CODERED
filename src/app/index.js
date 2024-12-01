import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';  // Added Alert import
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from "../../src/styles/styles";
import { TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { supabase } from "../utils/supabase";

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [logoSize, setLogoSize] = useState(150);
    const [isLoginLoading, setIsLoginLoading] = useState(false);  // Added state for loading
    const footer = require("../../assets/gradient.png");
    const logo = require("../../assets/codered.png");

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setLogoSize(70);
            setIsKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setLogoSize(150);
            setIsKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleLogin = async () => {
        setIsLoginLoading(true); // Show loading during login attempt

        if (!email || !password) {
            Alert.alert("Error", "Please fill in both email and password.");
            setIsLoginLoading(false); // Hide loading on error
            return;
        }

        try {
            // Log in the user using Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                Alert.alert("Log In Failed", "Invalid email or password.");
                setIsLoginLoading(false); // Hide loading on error
                return;
            }

            // Successful login
            Alert.alert("Login Successful", "Welcome back!");
            router.replace('dashboard'); // Navigate to the dashboard or desired screen

        } catch (error) {
            console.error("Error logging in:", error.message);
            Alert.alert("Error", "An error occurred while logging in. Please try again.");
            setIsLoginLoading(false); // Hide loading on error
        } finally {
            setIsLoginLoading(false); // Hide loading after process is complete
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
            <KeyboardAvoidingView
                style={{ justifyContent: 'center', alignItems: 'center' }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            />
            <Image source={logo} style={[styles.logoImage, { width: logoSize, height: logoSize }]} />
            <View style={indexStyle.header}>
                <Text style={indexStyle.headingTitle}>Welcome, Pulse!</Text>
                <Text style={indexStyle.subheadingTitle}>Find Blood with Speed, Be the Hope They Need!</Text>
                <Text style={indexStyle.pageTitle}>Log In</Text>
            </View>

            <View style={{ alignItems: 'center' }}>
                <TextInput
                    label='EMAIL'
                    value={email}
                    mode="outlined"
                    activeOutlineColor="red"
                    outlineColor="red"
                    textColor="black"
                    onChangeText={(newEmail) => setEmail(newEmail)}
                    style={[indexStyle.textInput, { fontFamily: "PoppinsBold" }]}
                />

                <TextInput
                    label="PASSWORD"
                    value={password}
                    mode="outlined"
                    activeOutlineColor="red"
                    outlineColor="red"
                    textColor="red"
                    onChangeText={(newPassword) => setPassword(newPassword)}
                    secureTextEntry={!isPasswordVisible}
                    right={
                        <TextInput.Icon
                            icon={isPasswordVisible ? "eye-off" : "eye"}
                            color="gray"
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        />
                    }
                    style={[indexStyle.textInput, { fontFamily: "PoppinsBold" }]}
                />
            </View>

            <View style={{ alignItems: 'center' }}>
                <Button
                    mode="text"
                    onPress={() => router.push('recover')}
                    labelStyle={{
                        fontSize: 14,
                        textAlign: 'center',
                        color: 'red',
                        fontFamily: "Poppins"
                    }}
                    style={{ padding: 0 }}
                >
                    Forgot Password?
                </Button>
            </View>

            <View style={{ alignItems: 'center', marginBottom: isKeyboardVisible ? -100 : 0 }}>
                <Button
                    mode="elevated"
                    onPress={handleLogin} // Fixed to call handleLogin
                    buttonColor="#fe0009"
                    labelStyle={{
                        fontSize: 18,
                        textAlign: 'center',
                        color: 'white',
                        fontFamily: "PoppinsBold",
                        marginBottom: -5
                    }}
                    style={[styles.button, { borderRadius: 100, width: 290, height: 50 }]}
                    loading={isLoginLoading} // Show loading indicator while logging in
                    disabled={isLoginLoading} // Disable button while loading
                >
                    LOG IN
                </Button>

                {!isKeyboardVisible && (
                    <>
                        <View style={{ alignItems: 'center' }}>
                            <Button
                                mode="elevated"
                                onPress={() => router.push('register')}
                                buttonColor="#1dc5fd"
                                labelStyle={{
                                    fontSize: 18,
                                    textAlign: 'center',
                                    color: 'white',
                                    fontFamily: "PoppinsBold"
                                }}
                                style={{
                                    paddingVertical: 7,
                                    paddingHorizontal: 5,
                                    margin: 10,
                                    borderRadius: 100,
                                    width: 290,
                                    height: 50
                                }}
                            >
                                CREATE AN ACCOUNT
                            </Button>
                        </View>
                    </>
                )}
            </View>

            {!isKeyboardVisible && (
                <View style={[styles.footerContainer, { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: -1 }]}>
                    <Image source={footer} style={styles.footerImage} />
                </View>
            )}
        </SafeAreaView>
    );
};

export default Login;

const indexStyle = styles;

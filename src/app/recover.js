import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform, Keyboard, Stylesheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/styles";
import { TextInput, Button } from "react-native-paper";
import { supabase } from "../utils/supabase";

const RecoverPass = ({ navigation }) => {
    const logo = require("../../assets/RecoverPass.png");
    const footer = require("../../assets/gradient.png");
    const [email, setEmail] = useState("");
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [logoSize, setLogoSize] = useState(150);
    const [isRegisterPressed, setIsRegisterPressed] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);

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

    const handlePasswordReset = async () => {
        setIsLoginLoading(true);
        if (!email) {
            Alert.alert("Error", "Please enter your email address.");
            setIsLoginLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "Please enter a valid email address.");
            setIsLoginLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);

            if (error) {
                Alert.alert("Error", "Something went wrong. Please try again.");
            } else {
                Alert.alert("Success", "An email has been sent to your account for password reset.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setIsLoginLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={forgotStyle.container}>
                <View>
                    <Text style={[forgotStyle.headingTitle, { alignSelf: 'center', marginBottom: 10, marginTop: 50}]} >
                        Password Recovery
                    </Text>
                    <Text style={[styles.subheadingTitle, { marginLeft: 22, marginRight: 22, textAlign: 'center', marginBottom: 10, fontSize: 13, marginTop: -2 }]} >
                        Enter your email account to reset password.
                    </Text>
                    <Image source={logo} style={[styles.logoImage, { width: logoSize, height: logoSize, marginTop: 10 }]} />
                </View>
                <View>
                    <TextInput
                        label="EMAIL"
                        value={email}
                        mode="outlined"
                        activeOutlineColor="red"
                        outlineColor="red"
                        textColor="black"
                        onChangeText={setEmail}
                        style={[styles.textInput, { fontFamily: "PoppinsBold", marginTop: 20 }]}
                    />
                </View>
                <View style={{ alignItems: 'center' }} >
                    <Button
                        mode="contained"
                        onPress={handlePasswordReset}
                        onPressIn={() => setIsRegisterPressed(true)}
                        onPressOut={() => setIsRegisterPressed(false)}
                        buttonColor={isRegisterPressed ? "#ff8e92" : "red"}
                        labelStyle={{ fontSize: 18, textAlign: 'center', color: 'white', fontFamily: "PoppinsBold" }}
                        style={{ paddingVertical: 7, paddingHorizontal: 5, borderRadius: 5, width: 290, height: 50, marginTop: 20 }}
                        loading={isLoginLoading}
                        disabled={isLoginLoading}
                    >
                        RECOVER
                    </Button>
                </View>
                {!isKeyboardVisible && (
                    <View style={[styles.footerContainer, { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: -1 }]} >
                        <Image source={footer} style={styles.footerImage} />
                    </View>
                )}
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default RecoverPass;

const forgotStyle = StyleSheet.create({
  ...styles,
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
});


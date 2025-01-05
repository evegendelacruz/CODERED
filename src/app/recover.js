import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Button } from "react-native-paper";
import { supabase } from "../utils/supabase";
import styles from "../styles/styles";

const RecoverPass = ({ navigation }) => {
    const logo = require("../../assets/RecoverPass.png");
    const footer = require("../../assets/gradient.png");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [logoSize, setLogoSize] = useState(150);
    const [isRegisterPressed, setIsRegisterPressed] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Toggle for switching input fields
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
    const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

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
                setIsEditing(true); // Switch to new password fields
                Alert.alert("Account Found", "Submit new password now!");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setIsLoginLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        setIsLoginLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) {
                Alert.alert("Error", "Error updating password. Please try different password.");
            } else {
                Alert.alert("Success", "Password reset successfully.");
                setIsEditing(false);
                setEmail("");
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
                    {!isEditing ? (
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
                    ) : (
                        <>
                        <TextInput
                                label="NEW PASSWORD"
                                value={newPassword}
                                mode="outlined"
                                activeOutlineColor="red"
                                outlineColor="red"
                                textColor="black"
                                secureTextEntry={!isPasswordVisible}
                                onChangeText={setNewPassword}
                                right={<TextInput.Icon icon={isPasswordVisible ? "eye-off" : "eye"} color="red" onPress={togglePasswordVisibility} />}
                                style={[styles.textInput, { fontFamily: "PoppinsBold" }]}
                            />
                            <TextInput
                                label="CONFIRM PASSWORD"
                                value={confirmPassword}
                                mode="outlined"
                                activeOutlineColor="red"
                                outlineColor="red"
                                textColor="black"
                                secureTextEntry={!isConfirmPasswordVisible}
                                onChangeText={setConfirmPassword}
                                right={<TextInput.Icon icon={isConfirmPasswordVisible ? "eye-off" : "eye"} color="red" onPress={toggleConfirmPasswordVisibility} />}
                                style={[styles.textInput, { fontFamily: "PoppinsBold" }]}
                            />
                            {newPassword !== confirmPassword && confirmPassword.length > 0 && (
                                <Text style={{ color: 'red', fontFamily: "Poppins", marginLeft: 16, fontSize: 12 }}>
                                    Passwords don't match
                                </Text>
                            )}
                        </>
                    )}
                </View>
                <View style={{ alignItems: 'center' }} >
                    <Button
                        mode="contained"
                        onPress={!isEditing ? handlePasswordReset : handleResetPassword}
                        onPressIn={() => setIsRegisterPressed(true)}
                        onPressOut={() => setIsRegisterPressed(false)}
                        buttonColor={isRegisterPressed ? "#ff8e92" : "red"}
                        labelStyle={{ fontSize: 18, textAlign: 'center', color: 'white', fontFamily: "PoppinsBold" }}
                        style={{ paddingVertical: 7, paddingHorizontal: 5, borderRadius: 5, width: 290, height: 50, marginTop: 20 }}
                        loading={isLoginLoading}
                        disabled={isLoginLoading}
                    >
                        {isEditing ? "RESET PASSWORD" : "RECOVER"}
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

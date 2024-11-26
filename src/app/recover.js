import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Keyboard, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../src/styles/styles";
import { useRouter } from 'expo-router';
import { TextInput, Button } from "react-native-paper";  

const ForgotPassword = ({ navigation }) => {
  const router = useRouter();
  const logo = require("../../assets/RecoverPass.png");
  const footer = require("../../assets/gradient.png");  // Footer Image
  const [logoSize, setLogoSize] = useState({ width: 190, height: 190 });
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false); 
  const [email, setEmail] = useState(""); // Initialize the email state
  const [isLoading, setIsLoading] = useState(false); // Initialize the isLoading state
  const [isRegisterPressed, setIsRegisterPressed] = useState(false);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setLogoSize({ width: 100, height: 100 }); // Shrink logo when keyboard is visible
      setIsKeyboardVisible(true); // Set keyboard visible
    });
    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setLogoSize({ width: 190, height: 190 }); // Restore logo size when keyboard is hidden
      setIsKeyboardVisible(false); // Set keyboard not visible
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);


  return (
    <SafeAreaView style={forgotStyle.container}>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust based on platform
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={forgotStyle.contentContainer}>
              {/* Reset Password Title */}
              <Text style={[forgotStyle.headingTitle, { marginVertical: 5, alignSelf: 'center', color: 'red', fontSize: 25 }]}>
                Reset Password
              </Text>
              <Text style={[styles.subheadingTitle, { marginHorizontal: 22, textAlign: 'center', marginBottom: 10, fontSize: 14 }]}>
              Enter your email to receive password reset instructions.
              </Text>

              {/* Logo */}
              <Image source={logo} style={[forgotStyle.logoImage, logoSize]} />

              {/* Email Input */}
              <TextInput
                label="EMAIL"
                value={email} 
                mode="outlined"
                activeOutlineColor="red"
                outlineColor="red"
                textColor="red"
                onChangeText={setEmail} 
                style={[forgotStyle.textInput, { fontFamily: "PoppinsBold", marginTop: isKeyboardVisible ? 10 : 20 }]}
              />

              {/* Submit Button */}
              <View style={{ alignItems: 'center', marginBottom: isKeyboardVisible ? 10 : 120 }}>
                <Button
                  mode="elevated"
                  onPress={() => router.push('/')}
                  onPressIn={() => setIsRegisterPressed(true)}
                  onPressOut={() => setIsRegisterPressed(false)}
                  buttonColor={isRegisterPressed ? "red" : "red"}
                  labelStyle={{ fontSize: 18, textAlign: 'center', color: 'white', fontFamily: "PoppinsBold" }}
                  style={{ paddingVertical: 7, margin: 5, borderRadius: 100, width: 290, height: 50, marginTop: 20 }}
                >
                  SUBMIT
                </Button>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>

        
        {!isKeyboardVisible && <Image source={footer} style={[forgotStyle.footerImage, { position: 'absolute', bottom: 0, width: '100%', alignSelf:'center', zIndex:-1 }]} />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const forgotStyle = StyleSheet.create({
  ...styles, // Inherit external styles
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoImage: {
    width: 170,
    height: 170,
    alignSelf: 'center',
  },
  headingTitle: {
    fontSize: 22,
    fontFamily: "PoppinsBold",
    color: "black",
    textAlign: 'center',
  },
});

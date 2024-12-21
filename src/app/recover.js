import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/styles";
import { TextInput, Button } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import {supabase} from "../utils/supabase";

const RecoverPass = ({ navigation }) => {
  const logo = require("../../assets/RecoverPass.png");
  const footer = require("../../assets/gradient.png");
  const [email, setEmail] = useState("");
  const [isRegisterPressed, setIsRegisterPressed] = useState(false);

 const handlePasswordReset = async () => {
  if (!email) {
    Alert.alert("Error", "Please enter your email address.");
    return;
  }

  // Basic email format validation (no domain check)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert("Error", "Please enter a valid email address.");
    return;
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      console.log("Error sending password reset email:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } else {
      Alert.alert("Success", "Your password has been successfully reset!");
    
    }
  } catch (error) {
    console.log("Error sending password reset email:", error);
    Alert.alert("Error", "Something went wrong. Please try again.");
  }
};

  

  return (
    <SafeAreaView style={forgotStyle.container}>
      <View>
        <Text style={[forgotStyle.headingTitle, { alignSelf: 'center', marginBottom: 10, marginTop: -150 }]}>
          Password Recovery
        </Text>
        <Text style={[styles.subheadingTitle, { marginLeft: 22, marginRight: 22, textAlign: 'center', marginBottom: 10, fontSize: 13, marginTop: -2 }]}>
          Please enter your email address to receive instructions for resetting your password.
        </Text>
        <Image source={logo} style={[styles.logoImage, { width: 150, height: 150, marginTop: 10 }]} />
      </View>
      <View>
        <TextInput
          label="EMAIL"
          value={email}
          mode="outlined"
          activeOutlineColor="red"
          outlineColor="red"
          textColor="red"
          onChangeText={setEmail}
          style={[styles.textInput, { fontFamily: "PoppinsBold", marginTop: 20 }]}
        />
      </View>
      <View style={{ alignItems: 'center' }}>
        <Button
          mode="elevated"
          onPress={handlePasswordReset} // Trigger password reset
          onPressIn={() => setIsRegisterPressed(true)}
          onPressOut={() => setIsRegisterPressed(false)}
          buttonColor={isRegisterPressed ? "#ff8e92" : "red"}
          labelStyle={{ fontSize: 18, textAlign: 'center', color: 'white', fontFamily: "PoppinsBold" }}
          style={{ paddingVertical: 7, paddingHorizontal: 5, borderRadius: 5, width: 290, height: 50, marginTop: 20 }}
        >
          RECOVER
        </Button>
      </View>
      <View style={[styles.footerContainer, { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: -1 }]}>
        <Image source={footer} style={styles.footerImage} />
      </View>
    </SafeAreaView>
  );
};

export default RecoverPass;

const forgotStyle = StyleSheet.create(styles);

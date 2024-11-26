import React, { useState, useEffect } from "react";
import { StyleSheet, Text, Image, View, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, PaperProvider } from "react-native-paper";
import styles from "../styles/styles";
import { useRouter } from 'expo-router';

const Device = () => {
  const router = useRouter();
  const [logoSize, setLogoSize] = useState(150);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null); // Track the selected blood group
  const [isRegisterPressed, setIsRegisterPressed] = useState(false);
  const footer = require("../../assets/gradient.png");

  useEffect(() => {
    // Listener for keyboard events
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setLogoSize(50); // Size when keyboard is visible
      setIsKeyboardVisible(true); // Set keyboard visible state
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setLogoSize(150); // Original size
      setIsKeyboardVisible(false); // Reset keyboard visible state
    });
    // Cleanup listeners on unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <PaperProvider>
      <SafeAreaView style={typeStyle.container}>
        <Image source={require("../../assets/codered.png")} style={[typeStyle.logoImage, { width: logoSize, height: logoSize }]} />
        <Text style={[typeStyle.headerTitle, { textAlign: 'center' }]}>
          Please pick your blood group
        </Text>

        <View style={typeStyle.buttonGallery}>
          {['A', 'B', 'O', 'AB'].map((label, index) => {
            const isSelected = selectedBloodGroup === label;
            const elevationStyle = isSelected ? { elevation: 8, backgroundColor: '#f0f0f0' } : {};

            return (
              <TouchableOpacity
                key={index}
                style={[typeStyle.galleryButton, elevationStyle]}
                onPress={() => setSelectedBloodGroup(isSelected ? null : label)} 
              >
                <Text style={typeStyle.galleryButtonText}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Add margin-top to space it out from the button gallery */}
        <View style={typeStyle.plusMinusContainer}>
          <TouchableOpacity
            style={typeStyle.plusMinusButton}
          >
            <Text style={typeStyle.plusMinusText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={typeStyle.plusMinusButton}
          >
            <Text style={typeStyle.plusMinusText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', marginTop: 10, marginBottom: isKeyboardVisible ? -60 : 140 }}>
          <Button
            mode="elevated"
            onPress={() => router.push('/')}
            onPressIn={() => setIsRegisterPressed(true)}
            onPressOut={() => setIsRegisterPressed(false)}
            buttonColor={isRegisterPressed ? "red" : "red"}
            labelStyle={typeStyle.submitButtonLabel}
            style={typeStyle.submitButton}
          >
            SUBMIT
          </Button>
        </View>
        <Image source={footer} style={styles.footerImage} />
      </SafeAreaView>
    </PaperProvider>
  );
};

export default Device;

const typeStyle = StyleSheet.create({
  ...styles,
  container: {
    backgroundColor: 'white',
  },
  headerTitle: {
    color: 'red',
    fontFamily: 'Poppins',
    fontSize: 22,
    marginHorizontal: 80,
    marginTop: -15
  },

  logoImage: {
    width: 170,
    height: 170,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
  },
  galleryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '40%',
    height: 80,
    margin: 10,
    backgroundColor: 'white',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  galleryButtonText: {
    fontSize: 25,
    fontFamily: 'Poppins',
    color: 'red',
  },
  plusMinusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 10
    
  },
  plusMinusButton: {
    width: 50,
    height: 50,
    backgroundColor: 'red',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    textAlign: 'center'
  },
  plusMinusText: {
    fontSize: 30,
    color: 'white',
    fontFamily: 'Poppins',
    marginTop: 3
  },
  submitButtonLabel: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    fontFamily: "PoppinsBold",
  },
  submitButton: {
    paddingVertical: 7,
    paddingHorizontal: 5,
    margin: 10,
    borderRadius: 100,
    width: 290,
    height: 50,
  },
});

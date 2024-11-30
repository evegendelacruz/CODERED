import React, { useState, useEffect } from "react";
import { StyleSheet, Text, Image, View, TouchableOpacity, Keyboard, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, PaperProvider } from "react-native-paper";
import styles from "../styles/styles";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import {supabase} from "../utils/supabase";

const Device = () => {
  const router = useRouter();
  const [logoSize, setLogoSize] = useState(150);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);
  const [selectedRhFactor, setSelectedRhFactor] = useState(null);
  const [isRegisterPressed, setIsRegisterPressed] = useState(false);
  const footer = require("../../assets/gradient.png");

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setLogoSize(50);
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setLogoSize(150);
      setIsKeyboardVisible(false);
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSubmit = async () => {
    if (selectedBloodGroup && selectedRhFactor) {
      try {
        // Insert data into Supabase
        const { data, error } = await supabase
          .from("blood_type") // Adjust the table name if needed
          .insert([
            {
              type_blood_group: selectedBloodGroup,
              type_rh_factor: selectedRhFactor,
            },
          ]);

        if (error) {
          console.error("Error inserting data: ", error.message);
        } else {
          console.log("Data inserted successfully: ", data);
          
          router.push("/");
        }
      } catch (error) {
        console.error("Error with Supabase operation: ", error.message);
      }
    } else {
      console.log("Please select a blood group and Rh factor.");
    }
  };

  const clearInput = () => {
    setSelectedBloodGroup(null);
    setSelectedRhFactor(null);
  };

  return (
    <PaperProvider>
      <SafeAreaView style={typeStyle.container}>
        <ScrollView contentContainerStyle={typeStyle.scrollContent}>
          <Image
            source={require("../../assets/codered.png")}
            style={[typeStyle.logoImage, { width: logoSize, height: logoSize }]}
          />
          <Text style={[typeStyle.headerTitle, { textAlign: "center" }]}>
            Please pick your blood group
          </Text>

          <View style={typeStyle.buttonGallery}>
            {["A", "B", "O", "AB"].map((label, index) => {
              const isSelected = selectedBloodGroup === label;
              const elevationStyle = isSelected ? { elevation: 8, backgroundColor: "#f0f0f0" } : {};

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

          <View style={typeStyle.plusMinusContainer}>
            <TouchableOpacity
              style={typeStyle.plusMinusButton}
              onPress={() => setSelectedRhFactor("-")}
            >
              <Text style={typeStyle.plusMinusText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={typeStyle.plusMinusButton}
              onPress={() => setSelectedRhFactor("+")}
            >
              <Text style={typeStyle.plusMinusText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={typeStyle.textInputContainer}>
            <TextInput
              style={[typeStyle.readOnlyTextInput, , { width: 220 }]}
              value={`${selectedBloodGroup || ""}${selectedRhFactor || ""}`}
              editable={false}
            />
            <TouchableOpacity style={typeStyle.clearButton} onPress={clearInput}>
              <FontAwesome5 name="backspace" style={typeStyle.clearButtonText}/>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: "center", marginTop: 10, marginBottom: 100 }}>
            <Button
              mode="elevated"
              onPress={handleSubmit}
              onPressIn={() => setIsRegisterPressed(true)}
              onPressOut={() => setIsRegisterPressed(false)}
              buttonColor={isRegisterPressed ? "red" : "red"}
              labelStyle={typeStyle.submitButtonLabel}
              style={typeStyle.submitButton}
            >
              SUBMIT
            </Button>
          </View>

          <View style={[styles.footerContainer, { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex:-1 }]}>
            <Image source={footer} style={styles.footerImage} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default Device;

const typeStyle = StyleSheet.create({
  ...styles,
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  headerTitle: {
    color: "red",
    fontFamily: "Poppins",
    fontSize: 22,
    marginHorizontal: 80,
    marginTop: -15,
  },
  logoImage: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonGallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
  },
  galleryButton: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "40%",
    height: 80,
    margin: 10,
    backgroundColor: "white",
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  galleryButtonText: {
    fontSize: 25,
    fontFamily: "Poppins",
    color: "red",
  },
  plusMinusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 10,
  },
  plusMinusButton: {
    width: 50,
    height: 50,
    backgroundColor: "red",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    textAlign: "center",
  },
  plusMinusText: {
    fontSize: 30,
    color: "white",
    fontFamily: "Poppins",
    marginTop: 3,
  },
  textInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  readOnlyTextInput: {
    height: 50,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 18,
    fontFamily: "Poppins",
    color: "black",
    backgroundColor: "#f0f0f0",
  },
  clearButton: {
    marginLeft: 10,
    backgroundColor: "red",
    borderRadius: 5,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  submitButtonLabel: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
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
  footerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
});

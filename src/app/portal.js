import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/styles";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";

const Portal = ({ navigation }) => {
  const router = useRouter();
  const footer = require("../../assets/gradient.png");
  const codered = require("../../assets/codered.png");
  const [isUserPressed, setIsUserPressed] = useState(false);
  const [isAdminPressed, setIsAdminPressed] = useState(false);

  return (
    <SafeAreaView style={portalStyle.container}>
      <Image
        source={codered}
        style={[
          styles.logoImage,
          { width: 180, height: 180, marginTop: 20, marginBottom: -20 },
        ]}
      />
      <Text style={[styles.headingTitle, { textAlign: "center" }]}>
        Join Us, Pulse!
      </Text>
      <Text
        style={{
          color: "black",
          fontFamily: "Poppins",
          fontSize: 13,
          alignSelf: "center",
          textAlign: "center",
          marginTop: 1,
          marginHorizontal: 30,
          marginVertical: 10,
        }}
      >
        Join Code Red to help save lives by donating blood or connecting donors
        with those in urgent need!
      </Text>

      <Text
        style={{
          color: "black",
          fontFamily: "Poppins",
          fontSize: 18,
          alignSelf: "center",
          textAlign: "center",
          marginTop: 15,
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        Which one are you?
      </Text>

      <View style={{ alignItems: "center", marginVertical: 10 }}>
        <Button
          mode="contained"
          onPress={() => router.push("register")}
          onPressIn={() => setIsUserPressed(true)}
          onPressOut={() => setIsUserPressed(false)}
          labelStyle={{
            fontSize: 18,
            textAlign: "center",
            color: "white",
            fontFamily: "PoppinsBold",
          }}
          style={{
            backgroundColor: isUserPressed ? "#ff8e92" : "#fe0009",
            paddingVertical: 7,
            paddingHorizontal: 5,
            margin: 10,
            borderRadius: 7,
            width: 240,
            height: 50,
          }}
        >
          USER
        </Button>
      </View>

      <Text style={{ fontFamily: "Poppins" }}>OR</Text>

      <View style={{ alignItems: "center", marginBottom: 200 }}>
        <Button
          mode="contained"
          onPress={() => router.push("regorganization")}
          onPressIn={() => setIsUserPressed(true)}
          onPressOut={() => setIsUserPressed(false)}
          labelStyle={{
            fontSize: 18,
            textAlign: "center",
            color: "white",
            fontFamily: "PoppinsBold",
          }}
          style={{
            backgroundColor: isUserPressed ? "#ff8e92" : "#fe0009",
            paddingVertical: 7,
            paddingHorizontal: 5,
            margin: 10,
            borderRadius: 7,
            width: 240,
            height: 50,
          }}
        >
          ORGANIZATION
        </Button>
      </View>

      <View
        style={[
          styles.footerContainer,
          { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: -1 },
        ]}
      >
        <Image source={footer} style={styles.footerImage} />
      </View>
    </SafeAreaView>
  );
};

export default Portal;

const portalStyle = StyleSheet.create(styles);

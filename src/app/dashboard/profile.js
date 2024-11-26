import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

const myprofile = require("../../assets/myprofile.png");

const Profile = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.darkContainer]}
    >
      <View style={[styles.header, isDarkMode && styles.darkHeader]}/>
      <Image
        source={myprofile}
        style={[
          styles.profileImage,
          { borderColor: isDarkMode ? "#bbb" : "#dddddd" }, 
        ]}
      />
      <Text style={[styles.name, isDarkMode && styles.darkText]}>
        Alaiza Rose Olores
      </Text>
      <Text
        style={[
          { fontSize: 14, fontFamily: "Poppins", marginBottom: 10 },
          isDarkMode && styles.darkText,
        ]}
      >
        Joined 2 years ago
      </Text>

      <View style={styles.statsContainer}>
        <View>
          <Text style={[styles.statsValue, isDarkMode && styles.darkText]}>
            51
          </Text>
          <Text style={[styles.statsTitle, isDarkMode && styles.darkSubtitle]}>
            Projects
          </Text>
        </View>
        <View>
          <Text style={[styles.statsValue, isDarkMode && styles.darkText]}>
            50
          </Text>
          <Text style={[styles.statsTitle, isDarkMode && styles.darkSubtitle]}>
            Clients
          </Text>
        </View>
        <View>
          <Text style={[styles.statsValue, isDarkMode && styles.darkText]}>
            69
          </Text>
          <Text style={[styles.statsTitle, isDarkMode && styles.darkSubtitle]}>
            Repositories
          </Text>
        </View>
      </View>

      <View>
        <Text
          style={[
            styles.statsValue,
            { marginLeft: -208, color: isDarkMode ? "#bbb" : "red" },
          ]}
        >
          Profile
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isDarkMode && styles.darkButton]}
      >
        <MaterialCommunityIcons
          name="account-outline"
          size={24}
          color={isDarkMode ? "white" : "gray"}
          marginLeft={50}
        />
        <Text
          style={[
            styles.buttonLabel,
            { marginLeft: 21, color: isDarkMode ? "white" : "black" },
          ]}
        >
          Manage Account
        </Text>
      </TouchableOpacity>

      <View>
        <Text
          style={[
            styles.statsValue,
            { marginLeft: -190, color: isDarkMode ? "#bbb" : "red" },
          ]}
        >
          Generals
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isDarkMode && styles.darkButton]}
      >
        <Ionicons
          name="settings-outline"
          size={23}
          color={isDarkMode ? "white" : "gray"}
          marginLeft={50}
        />
        <Text
          style={[
            styles.buttonLabel,
            { marginLeft: 21, color: isDarkMode ? "white" : "black" },
          ]}
        >
          Settings
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, isDarkMode && styles.darkButton]} onPress={toggleDarkMode}
      >
        <Ionicons
          name="moon-outline"
          size={23}
          color={isDarkMode ? "white" : "gray"}
          marginLeft={50}
        />
        <Text
          style={[
            styles.buttonLabel,
            { marginLeft: 21, color: isDarkMode ? "white" : "black" },
          ]}
        >
          Dark Mode
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isDarkMode && styles.darkButton]}
      >
        <Ionicons
          name="chatbubbles-outline"
          size={24}
          color={isDarkMode ? "white" : "gray"}
          marginLeft={50}
        />
        <Text
          style={[
            styles.buttonLabel,
            { marginLeft: 21, color: isDarkMode ? "white" : "black" },
          ]}
        >
          Give Feedback
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Poppins",
  },
  darkContainer: {
    backgroundColor: "#333",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 180,
    paddingHorizontal: 16,
    backgroundColor: "#fe0009",
    paddingVertical: 15,
    fontFamily: "PoppinsBold",
    marginTop: -120,
  },
  darkHeader: {
    backgroundColor: "#444",
  },
  headerTitle: {
    fontSize: 18,
    color: "white",
    fontFamily: "PoppinsBold",
  },
  iconButton: {
    padding: 8,
    fontFamily: "Poppins",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    marginTop: -60,
    borderWidth: 5,
    borderColor: "white",
    fontFamily: "Poppins",
  },
  name: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: "PoppinsBold",
    color:'red'
  },
  darkText: {
    color: "white",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
    fontFamily: "Poppins",
  },
  statsValue: {
    fontSize: 18,
    textAlign: "center",
    marginHorizontal: 25,
    fontFamily: "PoppinsBold",
    color: 'red'
  },
  statsTitle: {
    textAlign: "center",
    fontSize: 14,
    marginHorizontal: 25,
    fontFamily: "Poppins",
    color: "gray",
  },
  darkSubtitle: {
    color: "#bbb",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    width: "100%",
    marginVertical: 8,
    borderRadius: 10,
    justifyContent: "left",
    alignItems: "left",
  },
  darkButton: {
    backgroundColor: "#333",
  },
  buttonLabel: {
    color: "black",
    marginLeft: 5,
    fontFamily: "Poppins",
    fontSize: 16,
  },
});

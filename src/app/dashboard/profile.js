import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../utils/supabase";
import { Ionicons } from "@expo/vector-icons";

const avatar = require("../../assets/default_avatar.jpg");

const Profile = ({ navigation }) => {
  const [fetchError, setFetchError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fileName, setFileName] = useState("");
  const [image, setImage] = useState(avatar);
  const [userName, setUserName] = useState("Loading...");
  const [bloodType, setBloodType] = useState("Loading...");
  const [imageUri, setImageUri] = useState(null); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser?.user) {
          console.error("Error fetching authenticated user:", authError?.message);
          setUserName("Unable to load user");
          return;
        }
  
        const authId = authUser.user.id;
  
        // Fetch user information
        const { data: userData, error: userError } = await supabase
          .from("user")
          .select("user_firstname, user_middlename, user_lastname")
          .eq("auth_id", authId)
          .single();
  
        if (userError) {
          console.error("Error fetching user data:", userError.message);
          setUserName("Name not available");
          return;
        }
  
        // Fetch blood type information
        const { data: bloodData, error: bloodError } = await supabase
          .from("blood_type")
          .select("type_blood_group, type_rh_factor")
          .eq("auth_id", authId)
          .single();
  
        if (bloodError) {
          console.error("Error fetching blood type data:", bloodError.message);
          setBloodType("Blood type not available");
          return;
        }
  
        const firstName = userData?.user_firstname || "";
        const middleName = userData?.user_middlename || "";
        const lastName = userData?.user_lastname || "";
        const middleInitial = middleName ? `${middleName[0]}.` : "";
        const fullName = `${firstName} ${middleInitial} ${lastName}`.trim();
  
        setUserName(fullName || "Name not available");
  
        const fullBloodType = `${bloodData?.type_blood_group || ""} ${bloodData?.type_rh_factor || ""}`.trim();
        setBloodType(fullBloodType || "Blood type not available");
  
        // Fetch the profile picture using the correct file path with cache busting
      const filePath = `user_profile/${authId}.jpg`;  // Use the same path as the upload
      const { data: profilePicData, error: picError } = await supabase
        .storage
        .from("uploads")
        .getPublicUrl(filePath);

      if (picError) {
        console.error("Error fetching profile picture:", picError.message);
        setImage(avatar); // Default image if error occurs
      } else {
        // Add cache-busting query string to ensure the latest image is shown
        const cacheBustedUrl = `${profilePicData?.publicUrl}?t=${Date.now()}`;
        setImage(cacheBustedUrl);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      setUserName("Error loading name");
    }
  };

  fetchUserData();
}, []); // Empty dependency array ensures this runs once on component mount
  
  // Function to handle image selection
  const handleImagePickerPress = async (source) => {
    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
    }
  
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri); // Temporarily display the picked image
      setImageUri(uri);
    }
  };
  
  const uploadImage = async () => {
    if (!imageUri) return;
  
    try {
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        console.error("Error fetching authenticated user:", authError?.message);
        return;
      }
  
      const userId = authUser.user.id;
      const filePath = `user_profile/${userId}.jpg`;
  
      const fileExtension = imageUri.split('.').pop();
  
      // Upload the image to Supabase storage with overwrite (upsert)
      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(filePath, {
          uri: imageUri,
          type: `image/${fileExtension}`,
        }, { upsert: true });
  
      if (error) {
        console.error("Error uploading image:", error.message);
        return;
      }
  
      console.log("Image uploaded successfully:", data);
      alert("Profile image saved successfully!");
  
      // After upload, immediately fetch and update the profile picture
      const { data: profilePicData, error: picError } = await supabase
        .storage
        .from("uploads")
        .getPublicUrl(filePath);
  
      if (picError) {
        console.error("Error fetching profile picture:", picError.message);
        return;
      }
  
      // Set the image state with the fetched public URL and cache busting query string
      const cacheBustedUrl = `${profilePicData?.publicUrl}?t=${Date.now()}`;
      setImage(cacheBustedUrl);
  
    } catch (error) {
      console.error("Error during image upload:", error.message);
      alert("Failed to upload the image.");
    }
  };
  
  
  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <View style={{ position: "relative" }}>
          <Image
            source={typeof image === "string" ? { uri: image } : image} 
            style={[styles.profileImage, { borderColor: isDarkMode ? "#bbb" : "#dddddd" }]}
          />
          {/* Camera Button */}
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => handleImagePickerPress("library")}
          >
            <Ionicons name="camera" size={16} color="black" />
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "flex-start" }}>
          <Text
            style={[styles.name, isDarkMode && styles.darkText, { textAlign: "left" }]}
          >
            {userName}
          </Text>

          <Text
            style={[styles.bloodtype, isDarkMode && styles.darkText, { textAlign: "left" }]}
          >
            BLOOD TYPE: {bloodType}
          </Text>
        </View>
      </View>

      {/* Save Button */}
      {imageUri && (
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={uploadImage}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    fontFamily: "Poppins",
  },
  darkContainer: {
    backgroundColor: "#333",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    height: 120,
    paddingHorizontal: 16,
    backgroundColor: "#fe0009",
    paddingVertical: 5,
    fontFamily: "PoppinsBold",
    alignItems: "center",
    marginTop: -10,
  },
  darkHeader: {
    backgroundColor: "#444",
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 100,
    borderWidth: 3,
    marginLeft: 20,
    borderColor: "white",
    marginHorizontal: 10,
  },
  cameraButton: {
    position: "absolute",
    bottom: 5,
    right: 12,
    backgroundColor: "#E2E5E9",
    padding: 2,
    borderRadius: 15,
  },
  name: {
    marginVertical: -1,
    fontSize: 18,
    fontFamily: "PoppinsBold",
    color: "white",
    textAlign: "left",
    alignItems: "flex-start",
  },
  bloodtype: {
    fontFamily: "Poppins",
    textAlign: "left",
    color: "white",
  },
  darkText: {
    color: "white",
  },
  saveButtonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#fe0009",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

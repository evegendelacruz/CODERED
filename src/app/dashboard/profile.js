import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { List } from "react-native-paper";

const avatar = require("../../assets/default_avatar.jpg");

const Profile = ({ navigation }) => {
  const [fetchError, setFetchError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fileName, setFileName] = useState("");
  const [image, setImage] = useState(avatar);
  const [userName, setUserName] = useState("Loading...");
  const [bloodType, setBloodType] = useState("Loading...");
  const [imageUri, setImageUri] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: authUser, error: authError } =
          await supabase.auth.getUser();
        if (authError || !authUser?.user) {
          console.error(
            "Error fetching authenticated user:",
            authError?.message
          );
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

        const fullBloodType = `${bloodData?.type_blood_group || ""} ${
          bloodData?.type_rh_factor || ""
        }`.trim();
        setBloodType(fullBloodType || "Blood type not available");

        // Fetch the profile picture using the correct file path with cache busting
        const filePath = `user_profile/${authId}.jpg`; // Use the same path as the upload
        const { data: profilePicData, error: picError } = await supabase.storage
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

  // Handle image picker when editing
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
    if (!imageUri) {
      console.log("No image URI provided.");
      return;
    }

    try {
      // Log the image URI to verify it's valid
      console.log("Uploading image from URI:", imageUri);

      const { data: authUser, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authUser) {
        console.error("Error fetching authenticated user:", authError?.message);
        return;
      }

      const userId = authUser.user.id;
      const filePath = `user_profile/${userId}.jpg`; // Store image with user ID
      const fileExtension = imageUri.split(".").pop(); // Get file extension

      // Upload the image to Supabase storage
      const { data, error } = await supabase.storage.from("uploads").upload(
        filePath,
        {
          uri: imageUri,
          type: `image/${fileExtension}`,
        },
        { upsert: true } // Use upsert to overwrite the image if it already exists
      );

      // Check for errors during the upload
      if (error) {
        console.error("Error uploading image:", error.message);
        return;
      }

      console.log("Image uploaded successfully:", data);

      // After uploading, fetch the public URL of the uploaded image
      const { data: profilePicData, error: picError } = await supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      if (picError) {
        console.error("Error fetching profile picture:", picError.message);
        return;
      }

      // Set the image state with the fetched public URL and cache busting query string
      const cacheBustedUrl = `${profilePicData?.publicUrl}?t=${Date.now()}`;
      setImage(cacheBustedUrl); // Set the new image URL in the state
    } catch (error) {
      console.error("Error during image upload:", error.message);
      alert("Failed to upload the image.");
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    bloodType: "",
    birthdate: "",
    phone: "",
    location: "",
    email: "",
    password: "",
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch the authenticated user
        const { data: authUser, error: authError } =
          await supabase.auth.getUser();
        if (authError || !authUser?.user) {
          console.error(
            "Error fetching authenticated user:",
            authError?.message
          );
          return;
        }

        const authId = authUser.user.id;

        // Fetch user details using auth_id
        const { data: userData, error: userError } = await supabase
          .from("user")
          .select(
            "user_firstname, user_middlename, user_lastname, user_gender, user_birthdate, user_phoneNumber, user_currentAddress, user_email, user_password"
          )
          .eq("auth_id", authId)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError.message);
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
          return;
        }

        // Combine first, middle, and last names
        const fullName = `${userData.user_firstname} ${
          userData.user_middlename ? `${userData.user_middlename} ` : ""
        }${userData.user_lastname}`;

        // Combine blood type information
        const fullBloodType = `${bloodData.type_blood_group} ${bloodData.type_rh_factor}`;

        // Set form data with fetched values
        setFormData({
          name: fullName,
          gender: userData.user_gender,
          bloodType: fullBloodType,
          birthdate: userData.user_birthdate,
          phone: userData.user_phoneNumber
            ? userData.user_phoneNumber.toString()
            : "",
          location: userData.user_currentAddress,
          email: userData.user_email,
          password: userData.user_password,
        });
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array to run only once when the component mounts

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdate = async () => {
    if (isEditing) {
      try {
        // Fetch authenticated user
        const { data: authUser, error: authError } =
          await supabase.auth.getUser();
        if (authError || !authUser?.user) {
          console.error(
            "Error fetching authenticated user:",
            authError?.message
          );
          alert("Error fetching authenticated user. Please log in again.");
          return;
        }

        const authId = authUser.user.id;

        // Normalize the phone number
        const phoneWithoutPrefix = formData.phone.startsWith("+63 ")
          ? formData.phone.slice(3) // Remove +63 prefix
          : formData.phone;

        // Prepare updated user details
        const updatedUserDetails = {};

        // Only update fields that have changed or are non-empty
        if (formData.name !== "default name") {
          const nameParts = formData.name.trim().split(" ");
          updatedUserDetails.user_firstname = nameParts[0]; // First name
          updatedUserDetails.user_middlename =
            nameParts.length > 2 ? nameParts[1] || "" : "";
          updatedUserDetails.user_lastname = nameParts.slice(2).join(" ");
        }
        if (formData.gender) updatedUserDetails.user_gender = formData.gender;
        if (formData.birthdate)
          updatedUserDetails.user_birthdate = formData.birthdate;
        if (phoneWithoutPrefix)
          updatedUserDetails.user_phoneNumber = phoneWithoutPrefix;
        if (formData.location)
          updatedUserDetails.user_currentAddress = formData.location;
        if (formData.email) updatedUserDetails.user_email = formData.email;
        if (formData.password)
          updatedUserDetails.user_password = formData.password;

        // Update user details in the 'user' table
        const { data: userUpdateData, error: userUpdateError } = await supabase
          .from("user")
          .update(updatedUserDetails)
          .eq("auth_id", authId);

        if (userUpdateError) {
          console.error("Error updating user data:", userUpdateError.message);
          alert("Error updating user details.");
          return;
        }

        console.log("User details updated successfully:", userUpdateData);

        const updatedBloodType = {};
        if (formData.bloodType) {
          updatedBloodType.type_blood_group = formData.bloodType.split(" ")[0];
          updatedBloodType.type_rh_factor =
            formData.bloodType.split(" ")[1] || "";
        }

        if (Object.keys(updatedBloodType).length > 0) {
          const { data: bloodUpdateData, error: bloodUpdateError } =
            await supabase
              .from("blood_type")
              .update(updatedBloodType)
              .eq("auth_id", authId);

          if (bloodUpdateError) {
            console.error(
              "Error updating blood type data:",
              bloodUpdateError.message
            );
            alert("Error updating blood type.");
            return;
          }

          console.log("Blood type updated successfully:", bloodUpdateData);
        }

        // Handle image upload if provided
        if (imageUri) {
          try {
            await uploadImage(); // Call the uploadImage function
            console.log("Image uploaded successfully");
            alert("Profile and image updated successfully!");
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError.message);
            alert("Failed to upload image.");
          }
        } else {
          alert("Profile updated successfully!");
        }
      } catch (error) {
        console.error("Error during update operation:", error.message);
        alert("An error occurred while updating the profile.");
      }
    } else {
      handleEditToggle();
    }
  };

  return (
    <ScrollView>
      <SafeAreaView
        style={[styles.container, isDarkMode && styles.darkContainer]}
      >
        <View style={[styles.header, isDarkMode && styles.darkHeader]}>
          <View style={{ position: "relative" }}>
            <Image
              source={typeof image === "string" ? { uri: image } : image}
              style={[
                styles.profileImage,
                { borderColor: isDarkMode ? "#bbb" : "#dddddd" },
              ]}
            />

            {/* Camera Button shown only when editing */}
            {isEditing && (
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => handleImagePickerPress("library")}
              >
                <Ionicons name="camera" size={16} color="black" />
              </TouchableOpacity>
            )}
          </View>

          <View style={{ alignItems: "flex-start" }}>
            <Text
              style={[
                styles.name,
                isDarkMode && styles.darkText,
                { textAlign: "left" },
              ]}
            >
              {userName}
            </Text>

            <Text
              style={[
                styles.bloodtype,
                isDarkMode && styles.darkText,
                { textAlign: "left" },
              ]}
            >
              Blood Type: {bloodType}
            </Text>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>Full Name</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.name}
                editable={isEditing}
                onChangeText={(text) => handleInputChange("name", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>Gender</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.gender}
                editable={isEditing}
                onChangeText={(text) => handleInputChange("gender", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>Blood Type</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.bloodType}
                editable={isEditing}
                onChangeText={(text) => handleInputChange("bloodType", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>Birthdate</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.birthdate}
                editable={isEditing}
                onChangeText={(text) => handleInputChange("birthdate", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>Phone Number</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.phone}
                editable={isEditing}
                maxLength={10}
                keyboardType="phone-pad"
                onChangeText={(text) => handleInputChange("phone", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>Address</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.location}
                editable={isEditing}
                ellipsizeMode="tail"
                numberOfLines={1}
                onChangeText={(text) => handleInputChange("location", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>Email</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.email}
                editable={isEditing}
                onChangeText={(text) => handleInputChange("email", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>Password</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.password}
                editable={isEditing}
                secureTextEntry={true}
                onChangeText={(text) => handleInputChange("password", text)}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                isEditing ? styles.saveButton : styles.editButton,
              ]}
              onPress={() => {
                handleUpdate();
              }}
            >
              <Text style={styles.buttonText}>
                {isEditing ? "UPDATE" : "EDIT PROFILE"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
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
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 3,
    marginLeft: 10,
    borderColor: "white",
    marginHorizontal: 10,
  },
  cameraButton: {
    position: "absolute",
    bottom: 6,
    right: 15,
    backgroundColor: "#E2E5E9",
    padding: 2,
    borderRadius: 15,
  },
  formContainer: {
    padding: 20,
    justifyContent: "center",
  },
  inputTitle: {
    fontFamily: "Poppins",
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  inputDisabled: {
    backgroundColor: "#f0f0f0",
    color: "#888",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "red",
  },
  saveButton: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  name: {
    marginVertical: -1,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    color: "white",
    textAlign: "left",
    alignItems: "flex-start",
  },
  bloodtype: {
    fontFamily: "Poppins",
    textAlign: "left",
    color: "white",
    fontSize: 13,
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

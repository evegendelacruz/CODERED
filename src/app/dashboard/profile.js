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
  Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker"; 
import { ActivityIndicator } from "react-native-paper";
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
  const [isLoading, setIsLoading] = useState(false);

  const getImageSource = () => {
    return imageUri ? { uri: imageUri } : avatar;
  };

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
  
    // Fetch user data once on mount
    fetchUserData();
  
    // Set up a realtime subscription for user changes
    const userChannel = supabase
      .channel("user_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user" },
        (payload) => {
          console.log("User table changed:", payload);
          fetchUserData(); // Re-fetch user data on any change
        }
      )
      .subscribe();
  
    const bloodTypeChannel = supabase
      .channel("blood_type_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "blood_type" },
        (payload) => {
          console.log("Blood type table changed:", payload);
          fetchUserData(); // Re-fetch user data on any change
        }
      )
      .subscribe();
  
    // Clean up the subscriptions when the component unmounts
    return () => {
      supabase.removeChannel(userChannel);
      supabase.removeChannel(bloodTypeChannel);
    };
  }, []);
  

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
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    if (isEditing) {
      try {
        // Fetch authenticated user
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser?.user) {
          console.error("Error fetching authenticated user:", authError?.message);
          alert("Error fetching authenticated user. Please log in again.");
          setIsLoading(false);
          return;
        }
  
        const authId = authUser.user.id;
  
        // Normalize the phone number
        const phoneWithoutPrefix = formData.phone.startsWith("+63 ")
          ? formData.phone.slice(3) // Remove +63 prefix
          : formData.phone;
  
        // Prepare updated user details
        const updatedUserDetails = {};
  
        // Update user profile details
        if (formData.name !== "default name") {
          const nameParts = formData.name.trim().split(" ");
          updatedUserDetails.user_firstname = nameParts[0]; // First name
          updatedUserDetails.user_middlename = nameParts.length > 2 ? nameParts[1] || "" : "";
          updatedUserDetails.user_lastname = nameParts.slice(2).join(" ");
        }
        if (formData.gender) updatedUserDetails.user_gender = formData.gender;
        if (formData.birthdate) updatedUserDetails.user_birthdate = formData.birthdate;
        if (phoneWithoutPrefix) updatedUserDetails.user_phoneNumber = phoneWithoutPrefix;
        if (formData.location) updatedUserDetails.user_currentAddress = formData.location;
  
        // Fetch the current password from the user table
        const { data: userData, error: userFetchError } = await supabase
          .from("user")
          .select("user_password")
          .eq("auth_id", authId)
          .single();
  
        if (userFetchError) {
          console.error("Error fetching current password:", userFetchError.message);
          alert("Error fetching current user data.");
          setIsLoading(false);
          return;
        }
  
        const currentPassword = userData?.user_password;
  
        // Update the password only if it's different from the current password
        if (formData.password && formData.password !== currentPassword) {
          const { data: authData, error: authUpdateError } = await supabase.auth.updateUser({
            password: formData.password,
          });
  
          if (authUpdateError) {
            console.error("Error updating password:", authUpdateError.message);
            alert("Error updating password. Please try again.");
            setIsLoading(false);
            return;
          }
  
          console.log("Password updated successfully:", authData);
  
          // Update the password in the user table
          const { data: userUpdateData, error: userUpdateError } = await supabase
            .from("user")
            .update({ user_password: formData.password })
            .eq("auth_id", authData.user.id);
  
          if (userUpdateError) {
            console.error("Error updating user password in the database:", userUpdateError.message);
            alert("Error updating user password in the database.");
            setIsLoading(false);
            return;
          }
  
          console.log("User password updated successfully:", userUpdateData);
        } else if (formData.password) {
          console.log("New password is the same as the current password. No update required.");
        }
  
        // Update email via Supabase authentication API
        if (formData.email) {
          const { data: emailData, error: emailUpdateError } = await supabase.auth.updateUser({
            email: formData.email,
          });
          if (emailUpdateError) {
            console.error("Error updating email:", emailUpdateError.message);
            alert("Error updating email. Please try again.");
            setIsLoading(false);
            return;
          }
          console.log("Email updated successfully:", emailData);
        }
  
        // Update other user details in the 'user' table
        const { data: userUpdateData, error: userUpdateError } = await supabase
          .from("user")
          .update(updatedUserDetails)
          .eq("auth_id", authId);
  
        if (userUpdateError) {
          console.error("Error updating user data:", userUpdateError.message);
          alert("Error updating user details.");
          setIsLoading(false);
          return;
        }
  
        console.log("User details updated successfully:", userUpdateData);
  
        // Update blood type if provided
        const updatedBloodType = {};
        if (formData.bloodType) {
          updatedBloodType.type_blood_group = formData.bloodType.split(" ")[0];
          updatedBloodType.type_rh_factor = formData.bloodType.split(" ")[1] || "";
        }
  
        if (Object.keys(updatedBloodType).length > 0) {
          const { data: bloodUpdateData, error: bloodUpdateError } = await supabase
            .from("blood_type")
            .update(updatedBloodType)
            .eq("auth_id", authId);
  
          if (bloodUpdateError) {
            console.error("Error updating blood type data:", bloodUpdateError.message);
            alert("Error updating blood type.");
            setIsLoading(false);
            return;
          }
  
          console.log("Blood type updated successfully:", bloodUpdateData);
        }
  
        // Handle image upload if provided
        if (imageUri) {
          try {
            await uploadImage(); // Call the uploadImage function
            console.log("Image uploaded successfully");
            Alert.alert("Confirmation", "Profile information updated successfully!");
            setIsLoading(false);
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError.message);
            alert("Failed to upload image.");
            setIsLoading(false);
          }
        } else {
          Alert.alert("Confirmation", "Profile information updated successfully!");
          setIsLoading(false);
        }
  
        // Return to view mode
        setIsEditing(false);
      } catch (error) {
        console.error("Error during update operation:", error.message);
        alert("An error occurred while updating the profile.");
        setIsLoading(false);
      }
    } else {
      // Enter edit mode
      setIsEditing(true);
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
            source={(!image || image === avatar) ? avatar : { uri: image }}
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
              onPress={async () => {
                if (isEditing) {
                  setIsLoading(true); // Show loader when "UPDATE" is clicked
                  await handleUpdate();
                  setIsLoading(false); // Hide loader after update completes
                } else {
                  setIsEditing(true); // Enter edit mode
                }
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>
                  {isEditing ? "UPDATE" : "EDIT PROFILE"}
                </Text>
              )}
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

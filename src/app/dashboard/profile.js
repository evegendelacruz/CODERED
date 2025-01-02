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
  Alert,
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
  const [isOrganization, setIsOrganization] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const getImageSource = () => {
    return imageUri ? { uri: imageUri } : avatar;
  };

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

        // Check if auth_id exists in the user table
        const { data: userExists, error: userCheckError } = await supabase
          .from("user")
          .select("auth_id")
          .eq("auth_id", authId)
          .limit(1); // Ensures only a single row is returned

        if (userCheckError || !userExists || userExists.length === 0) {
          // If user not found, check organization table
          const { data: orgExists, error: orgCheckError } = await supabase
            .from("organization")
            .select("auth_id")
            .eq("auth_id", authId)
            .limit(1); // Ensures only a single row is returned

          if (orgCheckError || !orgExists || orgExists.length === 0) {
            console.error("auth_id not found in either table");
            setUserName("User or organization not found");
            return;
          }

          // Fetch organization data
          const { data: orgData, error: orgError } = await supabase
            .from("organization")
            .select("org_name, org_type")
            .eq("auth_id", authId)
            .limit(1) // Ensure only one record is returned
            .single(); // Ensure only a single row is returned

          if (orgError || !orgData) {
            console.error(
              "Error fetching organization data:",
              orgError.message
            );
            setUserName("Organization name not available");
            return;
          }

          // Set organization data into the state
          setUserName(orgData?.org_name || "Name not Found");
          setBloodType(orgData?.org_type || "Type not available");
          setIsOrganization(true); // Set the user as an organization
        } else {
          // Fetch user data
          const { data: userData, error: userError } = await supabase
            .from("user")
            .select("user_firstname, user_middlename, user_lastname")
            .eq("auth_id", authId)
            .single(); // Ensures only a single row is returned

          if (userError || !userData) {
            console.error("Error fetching user data:", userError.message);
            setUserName("Name not available");
            return;
          }

          const { user_firstname, user_middlename, user_lastname } = userData;
          const firstName = user_firstname || "";
          const middleName = user_middlename || "";
          const lastName = user_lastname || "";
          const middleInitial = middleName ? `${middleName[0]}.` : "";
          const fullName = `${firstName} ${middleInitial} ${lastName}`.trim();
          setUserName(fullName || "Name not available");

          // Fetch blood type information
          const { data: bloodData, error: bloodError } = await supabase
            .from("blood_type")
            .select("type_blood_group, type_rh_factor")
            .eq("auth_id", authId)
            .single();

          if (bloodError || !bloodData) {
            console.error(
              "Error fetching blood type data:",
              bloodError?.message || "No blood type found"
            );
            setBloodType("Blood type not available");
            return;
          }

          const fullBloodType = `${bloodData?.type_blood_group || ""} ${
            bloodData?.type_rh_factor || ""
          }`.trim();
          setBloodType(fullBloodType || "Blood type not available");
          setIsOrganization(false); // Set the user as a regular user
        }

        // Fetch profile picture
        const filePath = `user_profile/${authId}.jpg`; // Use the same path as the upload
        const { data: profilePicData, error: picError } = await supabase.storage
          .from("uploads")
          .getPublicUrl(filePath);

        if (picError) {
          console.error("Error fetching profile picture:", picError.message);
          setImage(avatar); // Default image if error occurs
        } else {
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

    // Set up real-time subscriptions for user and organization changes
    const userChannel = supabase
      .channel("user_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user" },
        () => {
          fetchUserData(); // Re-fetch user data on any change
        }
      )
      .subscribe();

    const orgChannel = supabase
      .channel("organization_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "organization" },
        () => {
          fetchUserData(); // Re-fetch organization data on any change
        }
      )
      .subscribe();

    // Clean up subscriptions when the component unmounts
    return () => {
      supabase.removeChannel(userChannel);
      supabase.removeChannel(orgChannel);
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
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser?.user) {
          console.error("Error fetching authenticated user:", authError?.message);
          return;
        }

        const authId = authUser.user.id;

        // Check if user exists in the "user" table
        const { data: userExists, error: userCheckError } = await supabase
          .from("user")
          .select("auth_id")
          .eq("auth_id", authId)
          .limit(1);

        if (userCheckError) {
          console.error("Error checking user existence:", userCheckError.message);
          return;
        }

        if (!userExists || userExists.length === 0) {
          // Check if the user exists in the organization table
          const { data: orgExists, error: orgCheckError } = await supabase
            .from("organization")
            .select("auth_id")
            .eq("auth_id", authId)
            .limit(1);

          if (orgCheckError) {
            console.error("Error checking organization existence:", orgCheckError.message);
            return;
          }

          if (!orgExists || orgExists.length === 0) {
            console.error("auth_id not found in either `user` or `organization` table");
            setUserName("User or organization not found");
            return;
          }

          // Fetch organization data
          const { data: orgData, error: orgError } = await supabase
            .from("organization")
            .select(
              "org_name, org_type, org_phoneNumber, org_currentAddress, org_dateStarted, org_email, org_password"
            )
            .eq("auth_id", authId)
            .limit(1);

          if (orgError) {
            console.error("Error fetching organization data:", orgError.message || "Unknown error");
            setUserName("Organization name not available");
            return;
          }

          const organization = orgData?.[0];
          if (!organization) {
            console.error("No organization data found");
            setUserName("Organization name not available");
            return;
          }

          setFormData({
            name: organization.org_name || "Organization name not available",
            gender: "", // Organizations do not have gender
            bloodType: organization.org_type || "Type not available",
            birthdate: organization.org_dateStarted
            ? new Date(organization.org_dateStarted.split("/").reverse().join("-"))
                .toISOString()
                .split("T")[0]
            : null, 
            phone: organization.org_phoneNumber?.toString() || "Phone number not available",
            location: organization.org_currentAddress || "Address not available",
            email: organization.org_email || "Email not available",
            password: organization.org_password || "Password not available",
          });
          setIsOrganization(true);
          setUserName(organization.org_name || "Name not available");
          setBloodType(organization.org_type || "Type not available");
        } else {
          // Fetch user data for a regular user
          const { data: userData, error: userError } = await supabase
            .from("user")
            .select(
              "user_firstname, user_middlename, user_lastname, user_gender, user_birthdate, user_phoneNumber, user_currentAddress, user_email, user_password"
            )
            .eq("auth_id", authId)
            .limit(1);

          if (userError) {
            console.error("Error fetching user data:", userError.message);
            return;
          }

          const user = userData?.[0];
          if (!user) {
            console.error("No user data found");
            return;
          }

          const fullName = `${user.user_firstname} ${
            user.user_middlename ? `${user.user_middlename} ` : ""
          }${user.user_lastname}`;

          const { data: bloodData, error: bloodError } = await supabase
            .from("blood_type")
            .select("type_blood_group, type_rh_factor")
            .eq("auth_id", authId)
            .limit(1);

          if (bloodError) {
            console.error("Error fetching blood type data:", bloodError.message);
            return;
          }

          const bloodType = bloodData?.[0]
            ? `${bloodData[0].type_blood_group} ${bloodData[0].type_rh_factor}`
            : "Blood type not available";

          setFormData({
            name: fullName || "Name not available",
            gender: user.user_gender || "Gender not available",
            bloodType,
            birthdate: user.user_birthdate || "Birthdate not available",
            phone: user.user_phoneNumber?.toString() || "Phone number not available",
            location: user.user_currentAddress || "Address not available",
            email: user.user_email || "Email not available",
            password: user.user_password || "Password not available",
          });
          setIsOrganization(false);
        }

        // Fetch profile picture if available
        const filePath = `user_profile/${authId}.jpg`;
        const { data: profilePicData, error: picError } = await supabase.storage
          .from("uploads")
          .getPublicUrl(filePath);

        if (picError) {
          console.error("Error fetching profile picture:", picError.message);
          setImage(avatar); // Default image if error occurs
        } else {
          setImage(`${profilePicData?.publicUrl}?t=${Date.now()}`); // Cache-busting
        }
      } catch (error) {
        console.error("Unexpected error:", error.message);
        setUserName("Error loading name");
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

      // Normalize the phone number for both users and organizations
      const phoneWithoutPrefix = formData.phone.startsWith("+63 ")
        ? formData.phone.slice(3) // Remove +63 prefix
        : formData.phone;

      // Prepare the updated details object
      const updatedDetails = {};

      // Check if it's an organization or user
      if (isOrganization) {
        // Fetch current organization data (password and email)
        const { data: orgData, error: orgFetchError } = await supabase
            .from("organization")
            .select("org_password, org_email")
            .eq("auth_id", authId)
            .single(); // Ensure only one row is returned

        if (orgFetchError || !orgData) {
            console.error("Error fetching current organization data:", orgFetchError?.message);
            alert("Error fetching current organization data.");
            setIsLoading(false);
            return;
        }

        const currentOrgPassword = orgData?.org_password;
        const currentOrgEmail = orgData?.org_email;

        // Update organization details (name, bloodType, etc.)
        if (formData.name && formData.name !== "default name") updatedDetails.org_name = formData.name;
        if (formData.bloodType) updatedDetails.org_type = formData.bloodType;
        if (formData.phone) updatedDetails.org_phoneNumber = formData.phone;
        if (formData.location) updatedDetails.org_currentAddress = formData.location;
        if (formData.birthdate) {
          // Format the birthdate before updating
          const formattedBirthdate = formData.birthdate
            .split("/")
            .reverse()
            .join("-");
            updatedDetails.org_dateStarted = formattedBirthdate;
        }        
        if (formData.email && formData.email !== currentOrgEmail) updatedDetails.org_email = formData.email;

        // Update password for organization if needed
        if (formData.password && formData.password !== currentOrgPassword) {
            const { data: authData, error: authUpdateError } = await supabase.auth.updateUser({
                password: formData.password,
            });

            if (authUpdateError) {
                console.error("Error updating password:", authUpdateError.message);
                alert("Error updating password. Please try again.");
                setIsLoading(false);
                return;
            }

            // Update the password in the organization table
            const { error: orgPasswordUpdateError } = await supabase
                .from("organization")
                .update({ org_password: formData.password })
                .eq("auth_id", authData.user.id);

            if (orgPasswordUpdateError) {
                console.error("Error updating organization password:", orgPasswordUpdateError.message);
                alert("Error updating organization password.");
                setIsLoading(false);
                return;
            }

        }

        // Update organization details in the "organization" table
        const { error: orgUpdateError } = await supabase
            .from("organization")
            .update(updatedDetails)
            .eq("auth_id", authId);

        if (orgUpdateError) {
            console.error("Error updating organization data:", orgUpdateError.message);
            alert("Error updating organization details.");
            setIsLoading(false);
            return;
        }
      } else {
        // Update user details (same structure as before for users)
        const updatedUserDetails = {};

        if (formData.name !== "default name") {
          const nameParts = formData.name.trim().split(" ");
          updatedUserDetails.user_firstname = nameParts[0]; // First name
          updatedUserDetails.user_middlename = nameParts.length > 2 ? nameParts[1] || "" : "";
          updatedUserDetails.user_lastname = nameParts.slice(2).join(" ");
        }
        if (formData.gender) updatedUserDetails.user_gender = formData.gender;
        if (formData.birthdate) {
          // Format the birthdate before updating
          const formattedBirthdate = formData.birthdate
            .split("/")
            .reverse()
            .join("-");
          updatedUserDetails.user_birthdate = formattedBirthdate;
        }        
        if (phoneWithoutPrefix) updatedUserDetails.user_phoneNumber = phoneWithoutPrefix;
        if (formData.location) updatedUserDetails.user_currentAddress = formData.location;

        // Fetch current password from the user table
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

        // Update password only if it's different from the current one
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

          // Update the password in the user table
          const { data: userUpdateData, error: userUpdateError } = await supabase
            .from("user")
            .update({ user_password: formData.password })
            .eq("auth_id", authData.user.id);

          if (userUpdateError) {
            console.error("Error updating user password:", userUpdateError.message);
            alert("Error updating user password.");
            setIsLoading(false);
            return;
          }

        }

        // Update email if provided
        if (formData.email) {
          const { data: emailData, error: emailUpdateError } = await supabase.auth.updateUser({
            email: formData.email,
          });
          if (emailUpdateError) {
            console.error("Error updating email:", emailUpdateError.message);
            alert("Error updating email.");
            setIsLoading(false);
            return;
          }
        }

        // Update user details in the "user" table
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
      }

      // Update blood type if provided
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
          setIsLoading(false);
          return;
        }
      }
      // Handle image upload if provided
      if (imageUri) {
        try {
          await uploadImage(); // Call the uploadImage function
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
              source={!image || image === avatar ? avatar : { uri: image }}
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
              numberOfLines={0}
              ellipsizeMode="tail"
            >
              {userName.length > 20 ? `${userName.slice(0, 20)}...` : userName}
            </Text>

            <Text
              style={[
                styles.bloodtype,
                isDarkMode && styles.darkText,
                { textAlign: "left" },
              ]}
            >
              {isOrganization
                ? `Type: ${bloodType}`
                : `Blood Type: ${bloodType}`}
            </Text>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.formContainer}>
            {/* Full Name / Organization Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>
                {isOrganization ? "Organization Name" : "Full Name"}
              </Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.name}
                editable={isEditing}
                multiline={true}
                onChangeText={(text) => handleInputChange("name", text)}
              />
            </View>

            {/* Gender (Visible only for user) */}
            {!isOrganization && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputTitle}>Gender</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={formData.gender}
                  editable={isEditing}
                  onChangeText={(text) => handleInputChange("gender", text)}
                />
              </View>
            )}

            {/* Blood Type / Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>
                {isOrganization ? "Type" : "Blood Type"}
              </Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.bloodType}
                editable={isEditing}
                onChangeText={(text) => handleInputChange("bloodType", text)}
              />
            </View>

            {/* Birthdate / Date Started */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>
                {isOrganization ? "Date Started" : "Birthdate"}
              </Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.birthdate}
                editable={isEditing}
                onChangeText={(text) => handleInputChange("birthdate", text)}
              />
            </View>

            {/* Phone Number */}
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

            {/* Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>Address</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.location}
                editable={isEditing}
                ellipsizeMode="tail"
                multiline={true}
                onChangeText={(text) => handleInputChange("location", text)}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputTitle}>Email</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.email}
                editable={isEditing}
                multiline={true}
                onChangeText={(text) => handleInputChange("email", text)}
              />
            </View>

            {/* Password */}
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

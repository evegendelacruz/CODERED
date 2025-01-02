import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Alert, Modal } from "react-native";
import { supabase } from "../../utils/supabase";
import { ActivityIndicator, Button } from "react-native-paper";
import Popover from "react-native-popover-view";
import { FontAwesome6, AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';
import RequestFormModal from '../../components/Form';
import Interaction from "../../components/Interaction";

// Helper function for intervals
const useInterval = (callback, delay) => {
  const savedCallback = React.useRef();

  // Update the saved callback if it changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const PostCard = ({ post }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [bagQuantity, setBagQuantity] = useState(0);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [fileName, setFileName] = useState("");
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const noimage = require("../../assets/noimage.jpg");
  const [isModalOpen, setModalOpen] = useState(false);
  const {
    request_created_at,
    post_time_ago,
    request_recipient,
    request_blood_type,
    request_hospital,
    request_urgency_lvl,
    request_bag_qnty,
    request_caption,
    request_file,
    request_donation_status,
    auth_id,
    request_id,
  } = post;

  const [userFullName, setUserFullName] = useState("Loading...");
  const [relativeTime, setRelativeTime] = useState("");
  const [showOptionsButton, setShowOptionsButton] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [image, setImage] = useState("");
  const getFileExtension = (url) => {
    if (typeof url === 'string' && url.includes('.')) {
      return url.split('.').pop(); // Return file extension
    }
    return null; // Return null if URL is invalid or doesn't contain an extension
  };
  

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
      setImage(uri); 
  
      const fileName = uri.split('/').pop(); 
  
      setFileName(fileName);  
    }
  };
  

  const increaseQuantity = () => {
    if (bagQuantity < 10) setBagQuantity(bagQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (bagQuantity > 1) setBagQuantity(bagQuantity - 1);
  };


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user full name
        const { data: userData, error: userError } = await supabase
          .from("user")
          .select("user_firstname, user_middlename, user_lastname")
          .eq("auth_id", auth_id)
          .single();

        if (userError) {
          setUserFullName("Name not available");
          return;
        }

        // Combine firstname, middlename, and lastname
        const fullName = `${userData.user_firstname || ""} ${
          userData.user_middlename || ""
        } ${userData.user_lastname || ""}`.trim();
        setUserFullName(fullName || "Name not available");

        // Calculate relative time
        setRelativeTime(getRelativeTime(request_created_at));
      } catch (error) {
        console.error("Error fetching user full name:", error.message);
        setUserFullName("Name not available");
      }
    };

    fetchUserData();
  }, [auth_id, request_created_at]);

  

  useEffect(() => {
    const checkAuthenticatedUser = async () => {
      try {
        // Fetch the authenticated user's UID
        const { data: authSession, error: authError } = await supabase.auth.getSession();

        if (authError || !authSession?.session?.user?.id) {
          setShowOptionsButton(false);
          return;
        }

        const auth_id = authSession.session.user.id; // Get the UID of the logged-in user
        // Ensure request_id is valid before querying
        if (!request_id || request_id === "undefined") {
          console.error("Invalid request_id:", request_id);
          setShowOptionsButton(false);
          return;
        }

        // Query the blood_request table to check if the logged-in user owns the post
        const { data: requestData, error: requestError } = await supabase
          .from("blood_request")
          .select("request_id")
          .eq("auth_id", auth_id) // Check if the auth_id matches
          .eq("request_id", request_id); // Match the specific request_id

        if (requestError) {
          setShowOptionsButton(false);
          return;
        }

        // Show the button if the user owns the post
        if (requestData && requestData.length > 0) {
          setShowOptionsButton(true);
        } else {
          setShowOptionsButton(false);
        }
      } catch (error) {
        setShowOptionsButton(false);
      }
    };

    // Run the checkAuthenticatedUser function
    checkAuthenticatedUser();
  }, [request_id]);
  
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "Just Now";

    const postTime = new Date(timestamp).getTime();
    if (isNaN(postTime)) return "Invalid time";

    const now = Date.now();
    const diff = now - postTime;

    if (diff < 0) return "Just Now";

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "Just Now";
    } else if (minutes < 60) {
      return `${minutes} min ago`;
    } else if (hours < 24) {
      return `${hours} hr ago`;
    } else {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  useInterval(() => {
    setRelativeTime(getRelativeTime(request_created_at));
  }, 60000); // Update every minute

  // Function to fetch user profile image
  const fetchProfileImage = async () => {
    try {
      const { data: authUser, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authUser) {
        console.error("Error fetching authenticated user:", authError?.message);
        return;
      }

      const filePath = `user_profile/${auth_id}.jpg`; // File path for the user's profile image

      const { data: profilePicData, error: picError } = await supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      if (picError) {
        console.error("Error fetching profile picture:", picError.message);
        return;
      }

      return profilePicData?.publicUrl;
    } catch (error) {
      console.error("Error fetching profile image:", error.message);
    }
  };

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchProfileImage().then((url) => setProfileImage(url));
  }, []);

  const [postImage, setPostImage] = useState(noimage);

  const fetchPostImage = async () => {
    if (!post?.request_id) return noimage; // Return noimage if no request_id

    try {
      const fileExtensions = ["jpeg", "png", "jpg"];
      let imageUrl = null; // Start with null to show noimage initially

      for (const extension of fileExtensions) {
        const filePath = `request_images/${post.request_id}.${extension}`;
        const { data, error } = await supabase.storage
          .from("uploads")
          .getPublicUrl(filePath);

        if (data?.publicUrl && !error) {
          imageUrl = data.publicUrl;
          break;
        }
      }

      return imageUrl;
    } catch (error) {
      console.error("Error fetching post image:", error.message);
      return null; // Return null if an error occurs
    }
  };

  useEffect(() => {
    const loadPostImage = async () => {
      setLoading(true);
      const imageUrl = await fetchPostImage();
      setPostImage(imageUrl); // Set the post image or fallback
      setLoading(false);
    };

    loadPostImage();
  }, [post?.request_id]);

  const togglePopover = () => {
    setIsPopoverVisible(!isPopoverVisible);
  };

  const handleEditPress = async () => {
    // Show the modal first
    setModalVisible(true);
  
    // Fetch user data
    const { data: user, error } = await supabase.auth.getUser();
    if (error || !user) {
      alert("You must be logged in to edit your request.");
      setModalVisible(false); // Close the modal if the user is not logged in
      return;
    }
  
    // Fetch the blood request data for this request_id from the database
    const { data: requestData, error: dbError } = await supabase
      .from("blood_request")
      .select("*")
      .eq("request_id", request_id) // Use the request_id passed in the state or context
      .single(); // Assuming you only want one request
  
    if (dbError || !requestData) {
      alert("Failed to fetch your request data.");
      setModalVisible(false); // Close the modal if fetching fails
      return;
    }
  
    // Set the form fields with the fetched data
    setRecipientName(requestData.request_recipient || "");
    setSelectedBloodType(requestData.request_blood_type || "");
    setBagQuantity(requestData.request_bag_qnty || 0);
    setSelectedHospital(requestData.request_hospital || "");
    setSelectedUrgency(requestData.request_urgency_lvl || "");
    setSelectedStatus(requestData.request_donation_status || "");
    setCaption(requestData.request_caption || "");
  };
  
  const handleDeletePress = async () => {
    // Show the delete modal first
    setDeleteOpen(true);
  
    // Fetch the blood request data for this request_id from the database
    const { data: requestData, error: dbError } = await supabase
      .from("blood_request")
      .select("*")
      .eq("request_id", request_id) // Use the request_id passed in the state or context
      .single(); // Assuming you only want one request
  
    if (dbError || !requestData) {
      alert("Failed to fetch request data.");
      setDeleteOpen(false); // Close the modal if fetching fails
      return;
    }
  };
  
  const handleConfirmDelete = async () => {
    // Ensure request_id is defined and valid
    if (!request_id) {
      alert("Request ID is not available.");
      return;
    }
  
    try {
      // 1. Check if the request exists before trying to delete it
      const { data: requestData, error: fetchError } = await supabase
        .from("blood_request")
        .select("*")
        .eq("request_id", request_id)
        .single();  // We only want a single entry
  
      if (fetchError) {
        console.error("Error fetching request data:", fetchError.message);
        alert("Failed to find the request. Please ensure the request ID is correct.");
        return;
      }
  
      if (!requestData) {
        return;
      }
  
      // 2. Delete the associated image from storage (if needed)
      if (imagePreviewUrl) {
        const fileExtension = getFileExtension(imagePreviewUrl); // Assuming this function exists
        const filePath = `request_images/${request_id}.${fileExtension}`; // Construct file path
  
        const { error: deleteImageError } = await supabase.storage
          .from("uploads")
          .remove([filePath]);
  
        if (deleteImageError) {
          console.error("Error deleting image:", deleteImageError.message);
          alert("Failed to delete the associated image. Continuing with the deletion of the request.");
        } else {

        }
      } else {

      }
  
      // 3. Delete the row from the `blood_request` table
      const { data: deletedRequest, error: deleteRequestError } = await supabase
        .from("blood_request")
        .delete()
        .eq("request_id", request_id); // Ensure correct field name
  
      if (deleteRequestError) {
        console.error("Error deleting request:", deleteRequestError.message);
        alert("Failed to delete the request. Please try again.");
        return;
      }
  
      // Check if no data was deleted
      if (!deletedRequest || deletedRequest.length === 0) {
        return;
      }
  
      console.log("Request deleted successfully:", deletedRequest);
      alert("Request deleted successfully!");
  
    } catch (error) {
      console.error("Error during delete operation:", error);
      alert("An error occurred while deleting your request.");
    }
  
    // Close the modal after deletion
    setDeleteOpen(false);
  };
  
  
  const handleCancelDelete = () => {
    // Close the modal without deleting
    setDeleteOpen(false);
  };
  
  const handleImagePick = async (imageUri) => {
  
    // Set the imagePreviewUrl state to the current image URL (if available)
    const currentImage = JSON.parse(requestData.request_file || '{}');
    setImagePreviewUrl(currentImage?.fileUrl || null);
  };
  
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const handlePostRequest = async () => {
    // Check if all required fields are filled
    if (
      !recipientName ||
      !selectedBloodType ||
      !selectedHospital ||
      !selectedUrgency ||
      !selectedStatus ||
      bagQuantity <= 0
    ) {
      alert("Please fill in all the required fields.");
      return;
    }
  
    try {
      // Fetch user data
      const { data: user, error } = await supabase.auth.getUser();
      if (error || !user) {
        alert("You must be logged in to update your request.");
        return;
      }
  
      // Prepare updated data without the image URL initially
      const updatedRequestData = {
        request_recipient: recipientName,
        request_blood_type: selectedBloodType,
        request_bag_qnty: bagQuantity,
        request_hospital: selectedHospital,
        request_urgency_lvl: selectedUrgency,
        request_donation_status: selectedStatus,
        request_caption: caption,
      };
  
      // Check if a new image was selected
      let imageUrl = null;
      if (image) { // 'image' should be the selected image file from file picker or image selection
        // Get the file extension
        const fileExtension = getFileExtension(image);
        
        // Use request_id as the unique file name (to replace the old image)
        const filePath = `request_images/${request_id}.${fileExtension}`;
  
        // Upload the new image to Supabase storage (upsert to replace the old image)
        const { error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(filePath, image, {
            contentType: `image/${fileExtension}`,
            upsert: true, // Use upsert to replace the file if it already exists
          });
  
        if (uploadError) {
          console.error("Error uploading image:", uploadError.message);
          alert("Image upload failed.");
          return;
        }
  
        // After uploading, fetch the public URL of the uploaded image
        const { data: imageData, error: imageError } = await supabase.storage
          .from("uploads")
          .getPublicUrl(filePath);
  
        if (imageError) {
          console.error("Error fetching image URL:", imageError.message);
          alert("Failed to get the image URL.");
          return;
        }
  
        // Use cache-busting query for the public URL
        imageUrl = `${imageData.publicUrl}?t=${Date.now()}`;
      } else {
        // If no new image is selected, keep the existing one or set a fallback
        imageUrl = imagePreviewUrl || noimage;
      }
  
      // Include the image URL in the update data
      const updatedRequestWithImage = {
        ...updatedRequestData,
        request_file: JSON.stringify({ fileUrl: imageUrl }),
      };
  
      // Update the request data in the database
      const { data, error: updateError } = await supabase
        .from("blood_request")
        .update(updatedRequestWithImage)
        .eq("request_id", request_id);
  
      if (updateError) {
        alert("Failed to update your request.");
        return;
      }
  
      alert("Request updated successfully!");
      
      // Update the image preview URL to reflect the new uploaded image
      setImagePreviewUrl(imageUrl);
  
      setModalVisible(false); // Close the modal after successful update
    } catch (error) {
      console.error("Error during update operation:", error);
      alert("An error occurred while updating your request.");
    }
  };
  
  
  return (
    <View style={styles.card}>
  <View style={styles.header}>
    <Image source={{ uri: profileImage }} style={styles.profilePic} />
    <View style={styles.headerText}>
      <Text style={styles.userName}>{userFullName}</Text>
      <Text style={styles.postTime}>{relativeTime}</Text>
    </View>
    {showOptionsButton && (
      <Popover
        isVisible={isPopoverVisible}
        onRequestClose={() => setIsPopoverVisible(false)}
        placement="bottom"
        from={
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={togglePopover}
          >
            <Text style={styles.optionsText}>•••</Text>
          </TouchableOpacity>
        }
      >
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleEditPress}
          >
            <FontAwesome6 name="edit" size={18} color="black" />
            <Text style={styles.menuText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleDeletePress}
          >
            <AntDesign name="delete" size={18} color="black" marginTop={3} />
            <Text style={styles.menuText}>Delete</Text>
          </TouchableOpacity>
          <Modal transparent={true} visible={deleteOpen} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.iconContainer}>
              <AntDesign name="delete" size={24} color="red" />
            </View>
            <Text style={styles.modalHeading}>Confirm Deletion</Text>
            <Text style={styles.modalSubtext}>
              Are you sure you want to delete this post? This action cannot be undone.
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.cancelbutton, styles.cancelButton]}
                onPress={handleCancelDelete}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelbutton, styles.logoutButton]}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.logoutButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
        </View>
      </Popover>
    )}
  </View>

  <View style={styles.content}>
    <Text style={styles.title}>📢 Calling for Blood Donation!</Text>
    <Text style={styles.subTitle}>{request_caption}</Text>
    <View style={styles.detailsContainer}>
      <Text
        style={[
          styles.details,
          { color: "gray", fontFamily: "PoppinsBold" },
        ]}
      >
        Blood Request Details:
      </Text>
      <Text style={styles.details}>
        Blood Recipient: <Text style={{ color: "black" }}>{request_recipient}</Text>
      </Text>
      <Text style={styles.details}>
        Blood Type: <Text style={{ color: "black" }}>{request_blood_type}</Text>
      </Text>
      <Text style={styles.details}>
        Bag/s Needed: <Text style={{ color: "black" }}>{request_bag_qnty}</Text>
      </Text>
      <Text style={styles.details}>
        Urgency Level: <Text style={{ color: "black" }}>{request_urgency_lvl}</Text>
      </Text>
      <Text style={styles.details}>
        Donation Status: <Text style={{ color: "black" }}>{request_donation_status}</Text>
      </Text>
      <Text style={styles.details}>
        Hospital: <Text style={{ color: "black" }}>{request_hospital}</Text>
      </Text>
    </View>
  </View>

  <View style={styles.imageContainer}>
    {loading ? (
      <ActivityIndicator size="large" color="red" />
    ) : (
      // The fallback image (noimage) is always on top, while the fetched image overlays it
      <ImageBackground
        source={noimage}
        style={styles.image}
        resizeMode="cover"
      >
        {postImage && (
          <ImageBackground
            source={{ uri: postImage }}
            style={[styles.image, styles.overlayImage]}
            resizeMode="cover"
          />
        )}
      </ImageBackground>
    )}
  </View>

  <RequestFormModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        recipientName={recipientName}
        setRecipientName={setRecipientName}
        selectedBloodType={selectedBloodType}
        setSelectedBloodType={setSelectedBloodType}
        bagQuantity={bagQuantity}
        setBagQuantity={setBagQuantity}
        selectedHospital={selectedHospital}
        setSelectedHospital={setSelectedHospital}
        selectedUrgency={selectedUrgency}
        setSelectedUrgency={setSelectedUrgency}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        caption={caption}
        setCaption={setCaption}
        image={image}
        handleImagePickerPress={handleImagePickerPress}
        handlePostRequest={handlePostRequest}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        isLoading={isLoading}
      />
      
      <Interaction requestId={post.request_id} />

    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative", 
    backgroundColor: "transparent",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayImage: {
    position: "absolute", 
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  card: {
    borderColor: "#ccc",
    borderWidth: 1,
    marginVertical: 2,
    padding: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  detailsContainer: {
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
    fontFamily: "PoppinsBold",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    fontFamily: "PoppinsBold",
  },
  userName: {
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  postTime: {
    fontSize: 12,
    color: "#666",
    marginTop: -2,
  },
  optionsButton: {
    padding: 5,
  },
  optionsText: {
    fontSize: 20,
    color: "#666",
    marginTop: -20,
  },
  content: {
    marginBottom: 10,
  },
  title: {
    fontFamily: "PoppinsBold",
    fontSize: 16,
    marginVertical: 10,
  },
  subTitle: {
    fontSize: 14,
    marginBottom: 3,
    fontFamily: "Poppins",
  },
  details: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
    fontFamily: "Poppins",
  },
  menu: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 1,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: 120,
  },
  menuItem: {
    paddingVertical: 10,
    flexDirection: 'row'
  },
  menuText: {
    fontSize: 16,
    color: "black",
    fontFamily: 'Poppins',
    textAlign: 'left',
    marginLeft: 5,
  },
  numberPicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 5,
    overflow: "hidden",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "red",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonText: {
    color: "white",
    fontFamily: "Poppins",
    fontSize: 18,
  },
  input: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
  },
  iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor:  'rgba(255, 105, 180, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
  },
  modalHeading: {
      fontSize: 18,
      color: 'black',
      marginBottom: 10,
      fontFamily: 'PoppinsBold'
  },
  modalSubtext: {
      fontSize: 14,
      color: 'gray',
      textAlign: 'center',
      marginBottom: 20,
      fontFamily: 'Poppins', 
      marginHorizontal: 20,
  },
  buttonContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
  },
  cancelbutton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5,
  },
  cancelButton: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: 'red',
  },
  cancelButtonText: {
      color: 'red',
      fontFamily: 'PoppinsBold'
  },
  logoutButton: {
      backgroundColor: 'red',
  },
  logoutButtonText: {
      color: 'white',
      fontFamily: 'PoppinsBold'
  },
  interactionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeText: {
    marginLeft: 5,
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentText: {
    marginLeft: 5,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 5,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
  },
});

export default PostCard;

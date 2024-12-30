import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView,TextInput, Modal,TouchableOpacity,StyleSheet, Alert, FlatList} from "react-native";
import { Button } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import PostCard from "../../../components/PostCard";
import {supabase} from "../../../utils/supabase";
import { useNavigation } from "@react-navigation/native";
import RequestFormModal from '../../../components/Form';
import Interaction from "../../../components/Interaction";


const Home = () => {
  const smile = require("../../../assets/smile.png");
  const noimage = require("../../../assets/noimage.jpg");
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [fileName, setFileName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState("");
  const [bagQuantity, setBagQuantity] = useState(0);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  
  const [image, setImage] = useState("");
  const getFileExtension = (uri) => {
    const fileName = uri.split('/').pop();
    return fileName.split('.').pop(); 
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

  const banner = require("../../../assets/dashboardheader.png");
  const testlogo = require("../../../assets/testlogo.png");
  const nopost = require("../../../assets/nopost.png");

  const handlePostRequest = async () => {
    setIsLoading(true);
    try {
      if (
        !recipientName ||
        !selectedBloodType ||
        !selectedHospital ||
        !selectedUrgency ||
        !selectedStatus ||
        bagQuantity <= 0
      ) {
        alert("Please fill in all the required fields.");
        setIsLoading(false);
        return;
      }
  
      const { data: user, error } = await supabase.auth.getUser();
      if (error || !user) {
        alert("You must be logged in to upload files.");
        setIsLoading(false);
        return;
      }
  
      const { data: requestData, error: dbError } = await supabase
        .from("blood_request")
        .insert([
          {
            request_recipient: recipientName,
            request_blood_type: selectedBloodType,
            request_bag_qnty: bagQuantity,
            request_hospital: selectedHospital,
            request_urgency_lvl: selectedUrgency,
            request_donation_status: selectedStatus,
            request_caption: caption,
          },
        ])
        .select();
  
      if (dbError || !requestData || requestData.length === 0) {
        console.error("Error inserting request data:", dbError);
        alert("Request submission failed.");
        setIsLoading(false);
        return;
      }
  
      const requestId = requestData[0].request_id;
      let imageUrl = null;
  
      if (image) {
        const fileExtension = getFileExtension(image);
        const filePath = `request_images/${requestId}.${fileExtension}`;
        const { error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(filePath, {
            uri: image,
            type: `image/${fileExtension}`,
          });
  
        if (uploadError) {
          console.error("Image upload error:", uploadError);
          alert("Image upload failed.");
          setIsLoading(false);
          return;
        }
  
        const { publicURL } = supabase.storage
          .from("uploads")
          .getPublicUrl(filePath);
        imageUrl = publicURL;
      } else {
        // Use `noimage` as the fallback
        imageUrl = noimage;
      }
  
      const { error: updateError } = await supabase
        .from("blood_request")
        .update({
          request_file: JSON.stringify({ fileUrl: imageUrl }),
        })
        .eq("request_id", requestId);
  
      if (updateError) {
        console.error("Error updating request with image URL:", updateError);
        alert("Failed to update request with image URL.");
        setIsLoading(false);
        return;
      }
  
      Alert.alert("Confirmation", "Blood Donation Request posted successfully!");
      setModalVisible(false);
  
      // Reset form fields after submission
      setRecipientName("");
      setSelectedBloodType("");
      setBagQuantity(0);
      setSelectedHospital("");
      setSelectedUrgency("");
      setSelectedStatus("");
      setCaption("");
      setImage(null);
      setFileName("");
    } catch (error) {
      console.error("Error uploading request:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch posts function
  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blood_request")
        .select("*")
        .order("request_created_at", { ascending: false });
  
      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }
  
      // Process posts to include public image URLs
      const postsWithImages = data.map((post) => {
        const { fileUrl } = post.request_file ? JSON.parse(post.request_file) : {};
        return {
          ...post,
          imageUrl: fileUrl || noimage, // Use `noimage` if `fileUrl` is not present
        };
      });
  
      setPosts(postsWithImages);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };
  

useEffect(() => {
  // Initial fetch of posts
  fetchPosts();

  // Set up real-time subscription to listen for changes in the 'blood_request' table
  const subscription = supabase
    .channel("public:blood_request") // Define the channel
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "blood_request" },
      (payload) => {

        // Fetch posts again to update UI
        fetchPosts();
      }
    )
    .subscribe();

  // Cleanup subscription on component unmount
  return () => {
    supabase.removeChannel(subscription);
  };
}, []);

  return (
    <SafeAreaView>
      <FlatList
      backgroundColor="#ccc"
        data={posts}
        ListHeaderComponent={() => (
          <View>
            <Image
              source={banner}
              style={{
                height: 150,
                width: "100%",
                zIndex: -1,
                alignSelf: "center",
                resizeMode: "cover",
              }}
            />
            <Button
              mode="elevated"
              buttonColor={"#fe0009"}
              labelStyle={{
                fontSize: 14,
                textAlign: "center",
                color: "white",
                fontFamily: "PoppinsBold",
              }}
              style={{
                borderRadius: 5,
                width: 250,
                height: 40,
                alignSelf: "center",
                marginTop: -60,
              }}
              onPress={() => setModalVisible(true)}
            >
              REQUEST BLOOD DONATION
            </Button>
            <View
              style={{
                borderColor: "#918F8F",
                width: "100%",
                height: 200,
                borderWidth: 0.5,
                marginTop: 26,
                justifyContent: "center",
                alignSelf: "center",
                backgroundColor: "white",
                marginVertical: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Image
                source={testlogo}
                style={{
                  height: 30,
                  width: 230,
                  alignSelf: "center",
                  marginVertical: 10,
                }}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins",
                  marginHorizontal: 40,
                  fontSize: 12,
                }}
              >
                Check if you're eligible to donate blood with RapidPass®.
              </Text>
              <Button
                mode="elevated"
                buttonColor={"#fe0009"}
                labelStyle={{
                  fontSize: 14,
                  textAlign: "center",
                  color: "white",
                  fontFamily: "PoppinsBold",
                }}
                style={{
                  borderRadius: 5,
                  width: 250,
                  height: 40,
                  alignSelf: "center",
                  marginVertical: 10,
                }}
                onPress={() => navigation.navigate("eligibility")}
              >
                START
              </Button>
            </View>
          </View>
        )}
        renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={(item) => item.request_created_at ? item.request_created_at.toString() : 'default_key'}
          ListFooterComponent={() => (
            posts.length === 0 && (
              <View
                style={{
                  borderColor: "#ccc",
                  borderWidth: 1,
                  marginVertical: 2,
                  padding: 50,
                  backgroundColor: "white",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                  elevation: 5,
                  
                }}
              >
                <Image
                  source={smile}
                  style={{
                    height: 100,
                    width: 100,
                    alignSelf: "center",
                    marginVertical: 10,
                  }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "Poppins",
                    marginTop: -5,
                    color: "gray",
                  }}
                >
                  No blood requests at the moment...
                </Text>
              </View>
            )
          )}
      />
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
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
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
});

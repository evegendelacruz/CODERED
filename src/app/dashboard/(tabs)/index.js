import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView,TextInput, Modal,TouchableOpacity,StyleSheet, Alert, FlatList} from "react-native";
import { Button } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import PostCard from "../../../components/PostCard";
import NewPost from "../../../components/NewPost";
import {supabase} from "../../../utils/supabase";

const Home = () => {
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
      console.log('File Name:', fileName);  
  
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
  
      let imageUrl = null;
  
      const { data: user, error } = await supabase.auth.getUser();
      if (error || !user) {
        alert("You must be logged in to upload files.");
        setIsLoading(false);
        return;
      }
  
      if (image) {
        const fileExtension = getFileExtension(image);
        const filePath = `request_images/${fileName}`;
        const { data, error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(filePath, image, {
            contentType: `image/${fileExtension}`,
          });
  
        if (uploadError) {
          console.error("Image upload error: ", uploadError);
          alert("Image upload failed.");
          setIsLoading(false);
          return;
        }
  
        const { publicURL } = supabase.storage
          .from("uploads")
          .getPublicUrl(filePath);
  
        imageUrl = publicURL;
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
            request_file: JSON.stringify({ fileUrl: imageUrl, fileName }),
          },
        ]);
  
      if (dbError) {
        console.error("Error inserting request data:", dbError);
        alert("Request submission failed.");
        setIsLoading(false);
        return;
      }
  
      Alert.alert("Confirmation", "Blood Donation Request posted successfully!");
      setModalVisible(false);
  
      setRecipientName("");
      setSelectedBloodType("");
      setBagQuantity(0);
      setSelectedHospital("");
      setSelectedUrgency("");
      setSelectedStatus("");
      setCaption("");
      setImage("");
      setFileName("");
    } catch (error) {
      console.error("Error uploading request:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  
  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blood_request")
        .select("*")
        .order("request_id", { ascending: true });
  
      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }
      console.log(data);  // Log data to check the structure
      setPosts(data || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
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
                width: 360,
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
                height: 180,
                borderWidth: 0.5,
                marginTop: 26,
                justifyContent: "center",
                alignSelf: "center",
                backgroundColor: "white",
                marginVertical: 5,
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
              >
                START
              </Button>
            </View>
          </View>
        )}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.request_id ? item.request_id.toString() : 'default_key'}
        ListFooterComponent={() => (
          posts.length === 0 && (
            <View
              style={{
                borderColor: "#918F8F",
                borderWidth: 0.5,
                width: 330,
                height: 180,
                marginTop: 5,
                justifyContent: "center",
                alignSelf: "center",
                backgroundColor: "white",
              }}
            >
              <Image
                source={nopost}
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

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView contentContainerStyle={{ padding: 30 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
            <TouchableOpacity
              
              onPress={() => setModalVisible(false)}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                color: "red",
                fontFamily: "PoppinsBold",
                textAlign: "center",
                flex: 1, 
              }}
            >
              REQUEST FORM
            </Text>
          </View>


              <Text style={{ marginBottom: 5, fontFamily: "Poppins" }}>
                Blood Recipient
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  height: 50,
                  borderColor: "red",
                  borderRadius: 5,
                  padding: 10,
                  marginBottom: 10,
                  fontFamily: "Poppins",
                }}
                placeholder="Full Name"
                value={recipientName}
                onChangeText={setRecipientName}
              />

              <Text style={{ marginBottom: 5, fontFamily: "Poppins" }}>
                Blood Type
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "red",
                  borderRadius: 5,
                  marginBottom: 10,
                }}
              >
                <Picker
                  selectedValue={selectedBloodType}
                  onValueChange={(itemValue) => setSelectedBloodType(itemValue)}
                  style={{fontFamily: 'Poppins'}}
                >
                  <Picker.Item
                    label="Select Blood Type"
                    value=""
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item label="A+" value="A+" style={{ fontSize: 14 }} />
                  <Picker.Item label="A-" value="A-" style={{ fontSize: 14 }} />
                  <Picker.Item label="B+" value="B+" style={{ fontSize: 14 }} />
                  <Picker.Item label="B-" value="B-" style={{ fontSize: 14 }} />
                  <Picker.Item label="O+" value="O+" style={{ fontSize: 14 }} />
                  <Picker.Item label="O-" value="O-" style={{ fontSize: 14 }} />
                  <Picker.Item
                    label="AB+"
                    value="AB+"
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item
                    label="AB-"
                    value="AB-"
                    style={{ fontSize: 14 }}
                  />
                </Picker>
              </View>

              <Text style={{ marginBottom: 5, fontFamily: "Poppins" }}>
                Bag Quantity
              </Text>
              <View style={styles.numberPicker}>
                <TouchableOpacity
                  onPress={decreaseQuantity}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  value={bagQuantity.toString()}
                  editable={false}
                />
                <TouchableOpacity
                  onPress={increaseQuantity}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ marginBottom: 5, fontFamily: "Poppins" }}>
                Hospital
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "red",
                  borderRadius: 5,
                  marginBottom: 10,
                }}
              >
              <Picker
                selectedValue={selectedHospital}
                onValueChange={(itemValue) => setSelectedHospital(itemValue)}
                style={{
                  borderWidth: 1,
                  borderColor: "red",
                  borderRadius: 5,
                }}
              >
                <Picker.Item label="Select Hospital" value="" style={{ fontSize: 14 }} />
                <Picker.Item
                  label="Allied Care Experts (ACE) Medical Center"
                  value="Allied Care Experts (ACE) Medical Center"
                  style={{ fontSize: 14 }}
                />
                <Picker.Item
                  label="Cagayan de Oro Medical Center"
                  value="Cagayan de Oro Medical Center"
                  style={{ fontSize: 14 }}
                />
                <Picker.Item
                  label="Cagayan de Oro Polymedic General Hospital, Inc."
                  value="Cagayan de Oro Polymedic General Hospital, Inc."
                  style={{ fontSize: 14 }}
                />
                <Picker.Item
                  label="Cagayan de Oro Polymedic Medical Plaza"
                  value="Cagayan de Oro Polymedic Medical Plaza"
                  style={{ fontSize: 14 }}
                />
                <Picker.Item
                  label="Capitol University Medical Center"
                  value="Capitol University Medical Center"
                  style={{ fontSize: 14 }}
                />
                <Picker.Item
                  label="J.R. Borja General Hospital"
                  value="J.R. Borja General Hospital"
                  style={{ fontSize: 14 }}
                />
                <Picker.Item
                  label="Madonna & Child Hospital"
                  value="Madonna & Child Hospital"
                  style={{ fontSize: 14 }}
                />
                <Picker.Item
                  label="Maria Reyna-Xavier University Hospital"
                  value="Maria Reyna-Xavier University Hospital"
                  style={{ fontSize: 14 }}
                />
                <Picker.Item
                  label="Northern Mindanao Medical Center (NMMC)"
                  value="Northern Mindanao Medical Center (NMMC)"
                  style={{ fontSize: 14 }}
                />
                <Picker.Item
                  label="Saint Francis Doctors' Hospital and Medical Center Uptown"
                  value="Saint Francis Doctors' Hospital and Medical Center Uptown"
                  style={{ fontSize: 14 }}
                />
              </Picker>
              </View>

              <Text style={{ marginBottom: 5, fontFamily: "Poppins" }}>
                Urgency Level
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "red",
                  borderRadius: 5,
                  marginBottom: 10,
                }}
              >
                <Picker
                  selectedValue={selectedUrgency}
                  onValueChange={(itemValue) => setSelectedUrgency(itemValue)}
                  style={{
                    borderWidth: 1,
                    borderColor: "red",
                    borderRadius: 5,
                  }}
                >
                  <Picker.Item label="Select Urgency Level" value="" style={{ fontSize: 14 }} />
                  <Picker.Item label="Emergency (Immediate Attention Required)" value="Emergency" style={{ fontSize: 14 }} />
                  <Picker.Item label="Urgent (Prompt Attention Needed)" value="Urgent" style={{ fontSize: 14}} />
                  <Picker.Item label="Non-Urgent (Routine Care)" value="Non-Urgent" style={{ fontSize: 14}} />
                  <Picker.Item label="Elective (Planned Care)" value="Elective" style={{ fontSize: 14}} />
                </Picker>
              </View>

              <Text style={{ marginBottom: 5, fontFamily: "Poppins" }}>
                Donation Status
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "red",
                  borderRadius: 5,
                  marginBottom: 10,
                }}
              >
                <Picker
                  selectedValue={selectedStatus}
                  onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                  style={{
                    borderWidth: 1,
                    borderColor: "red",
                    borderRadius: 5,
                  }}
                >
                  <Picker.Item label="Select Donation Status" value="" style={{ fontSize: 14 }} />
                  <Picker.Item label="Ongoing" value="Ongoing" style={{ fontSize: 14}} />
                  <Picker.Item label="Fulfilled" value="Fulfilled" style={{ fontSize: 14}} />
                  <Picker.Item label="Cancelled" value="Cancelled" style={{ fontSize: 14}} />
                </Picker>
              </View>

              

              <Text style={{ marginBottom: 5, fontFamily: "Poppins" }}>
                Caption
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "red",
                  borderRadius: 5,
                  padding: 10,
                  height: 150,
                  marginBottom: 10,
                  textAlignVertical: "top",
                  fontFamily: "Poppins",
                }}
                placeholder="Add caption to your request here..."
                multiline
                value={caption}
                onChangeText={setCaption}

              />

              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "red",
                  borderRadius: 5,
                  padding: 10,
                  alignItems: "center",
                  marginBottom: 10,
                  borderStyle: "dashed",
                }}
                onPress={() => handleImagePickerPress("library")}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <AntDesign
                    name="upload"
                    size={13}
                    color="#000"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={{ fontFamily: "Poppins", color: "gray" }}>Upload from Gallery</Text>
                </View>
              </TouchableOpacity>
              <Text style={{fontFamily: 'Poppins', marginVertical: 5, textAlign:'center'}}>OR</Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "red",
                  borderRadius: 5,
                  padding: 10,
                  alignItems: "center",
                  marginBottom: 20,
                  borderStyle: "dashed",
                }}
                onPress={() => handleImagePickerPress("camera")}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <AntDesign
                    name="camera"
                    size={16}
                    color="#000"
                    style={{ marginRight: 10, marginBottom: 3 }}
                  />
                  <Text style={{ fontFamily: "Poppins", color: "gray" }}>Take a Photo</Text>
                </View>
              </TouchableOpacity>

              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{
                    width: "100%",
                    height: 200,
                    marginVertical: 10,
                    resizeMode: "contain",
                  }}
                />
              ) : null}

              <Button
                mode="elevated"
                buttonColor={"#fe0009"}
                style={{ borderRadius: 5, height: 50, marginVertical: 20 }}
                labelStyle={{
                  fontSize: 16,
                  textAlign: "center",
                  color: "white",
                  fontFamily: "PoppinsBold",
                  padding: 5,
                }}
                onPress={handlePostRequest}
                disabled={isLoading}
              >
                POST
              </Button>
            </ScrollView>
          </SafeAreaView>
        </Modal>
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

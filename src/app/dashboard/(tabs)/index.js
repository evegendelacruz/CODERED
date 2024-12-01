import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState("");
  const [bagQuantity, setBagQuantity] = useState(1);

  const increaseQuantity = () => {
    if (bagQuantity < 10) setBagQuantity(bagQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (bagQuantity > 1) setBagQuantity(bagQuantity - 1);
  };

  const banner = require("../../../assets/dashboardheader.png");
  const testlogo = require("../../../assets/testlogo.png");
  const nopost = require("../../../assets/nopost.png");

  // Define background colors based on selection
  const getUrgencyBackgroundColor = () => {
    switch (selectedUrgency) {
      case "Emergency":
        return "#ffcccc"; // Red for Emergency
      case "Urgent":
        return "#ffe0b3"; // Orange for Urgent
      case "Non-Urgent":
        return "#fff2b3"; // Yellow for Non-Urgent
      case "Elective":
        return "#d1f7d1"; // Green for Elective
      default:
        return "white";
    }
  };

  const getStatusBackgroundColor = () => {
    switch (selectedStatus) {
      case "Ongoing":
        return "#b3e0ff"; // Blue for Ongoing
      case "Fulfilled":
        return "#d9f7d9"; // Green for Fulfilled
      case "Cancelled":
        return "#ffcccc"; // Red for Cancelled
      default:
        return "white";
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
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

          {/* Blood Donation Eligibility Section */}
          <View
            style={{
              borderColor: "#918F8F",
              width: 330,
              height: 200,
              marginTop: 30,
              borderWidth: 0.5,
              justifyContent: "center",
              alignSelf: "center",
              backgroundColor: "white",
              marginVertical: 10,
            }}
          >
            <Image
              source={testlogo}
              style={{
                height: 50,
                width: 270,
                alignSelf: "center",
                marginVertical: 10,
              }}
            />
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Poppins",
                marginHorizontal: 40,
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
                fontFamily: "Poppins",
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

        {/* No Post Section */}
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

        {/* Modal for Request Form */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <Text
                style={{
                  fontSize: 18,
                  color: "red",
                  marginBottom: 10,
                  fontFamily: "PoppinsBold",
                  textAlign: "center",
                }}
              >
                REQUEST FORM
              </Text>

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
                    backgroundColor: getUrgencyBackgroundColor(),
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
                    backgroundColor: getStatusBackgroundColor(),
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
              />

              <Text style={{ marginBottom: 5, fontFamily: "Poppins" }}>
                Add Photo
              </Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "red",
                  borderRadius: 5,
                  padding: 10,
                  alignItems: "center",
                  marginBottom: 10,
                  borderStyle: 'dashed'
                }}
              >
                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 
                  <AntDesign name="upload" size={13} color="#000" style={{ marginRight: 10 }} />
                  
                  <Text style={{ fontFamily: "Poppins", color: '#ccc' }}>Upload here</Text>
                </View>
              </TouchableOpacity>

              <Button
                mode="elevated"
                buttonColor={"#fe0009"}
                labelStyle={{
                  fontSize: 14,
                  textAlign: "center",
                  color: "white",
                  fontFamily: "Poppins",
                }}
                onPress={() => setModalVisible(false)}
              >
                POST
              </Button>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </ScrollView>
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
    width: 322,
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

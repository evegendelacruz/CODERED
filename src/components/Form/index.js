import React from 'react';
import { Modal, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Text, View, Image, StyleSheet } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from '@expo/vector-icons';
import { Button } from 'react-native-paper';

const RequestFormModal = ({
  modalVisible,
  setModalVisible,
  recipientName,
  setRecipientName,
  selectedBloodType,
  setSelectedBloodType,
  bagQuantity,
  setBagQuantity,
  selectedHospital,
  setSelectedHospital,
  selectedUrgency,
  setSelectedUrgency,
  selectedStatus,
  setSelectedStatus,
  caption,
  setCaption,
  image,
  handleImagePickerPress,
  handlePostRequest,
  increaseQuantity,
  decreaseQuantity,
  isLoading
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView contentContainerStyle={{ padding: 30 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                color: 'red',
                fontFamily: 'PoppinsBold',
                textAlign: 'center',
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
                  <Picker.Item label="Emergency (Immediate Attention Required)" value="Emergency (Immediate Attention Required)" style={{ fontSize: 14 }} />
                  <Picker.Item label="Urgent (Prompt Attention Needed)" value="Urgent (Prompt Attention Needed)" style={{ fontSize: 14}} />
                  <Picker.Item label="Non-Urgent (Routine Care)" value="Non-Urgent (Routine Care)" style={{ fontSize: 14}} />
                  <Picker.Item label="Elective (Planned Care)" value="Elective (Planned Care)" style={{ fontSize: 14}} />
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
                mode="contained"
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
  );
};

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
  

export default RequestFormModal;

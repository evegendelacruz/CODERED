import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, RadioButton } from 'react-native-paper';

const Test = () => {
  const test = require("../../assets/testlogo.png");

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Image source={test} style={styles.logo} />
        <Text style={styles.headerText}>
          Please enter the following information to begin the RapidPass®
        </Text>
      </View>

      {/* Form Section */}
      <View style={styles.container}>
        {/* First Name */}
        <TextInput
          label="FIRST NAME"
          value={firstName}
          onChangeText={setFirstName}
          mode="outlined"
          style={styles.input}
          outlineColor="#d32f2f"
          activeOutlineColor="#d32f2f"
        />

        {/* Last Name */}
        <TextInput
          label="LAST NAME"
          value={lastName}
          onChangeText={setLastName}
          mode="outlined"
          style={styles.input}
          outlineColor="#d32f2f"
          activeOutlineColor="#d32f2f"
        />

        {/* Birth Date */}
        <TextInput
          label="BIRTH DATE"
          value={birthDate}
          onChangeText={setBirthDate}
          mode="outlined"
          placeholder="MM/DD/YYYY"
          keyboardType="numeric"
          style={styles.input}
          outlineColor="#d32f2f"
          activeOutlineColor="#d32f2f"
        />

        {/* Gender */}
        <Text style={styles.label}>Gender:</Text>
        <RadioButton.Group onValueChange={(value) => setGender(value)} value={gender}>
          <View style={[styles.radioRow, { flexDirection: 'row' }]}>
            <View style={styles.radioItem}>
              <RadioButton value="Male" color="#d32f2f" />
              <Text style={styles.radioText}>Male</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="Female" color="#d32f2f" />
              <Text style={styles.radioText}>Female</Text>
            </View>
          </View>
        </RadioButton.Group>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
        <Button
            mode="contained"
            buttonColor='red' 
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Start
          </Button>
          <Button
            mode="outlined"
            style={[styles.button, styles.cancelButton]} 
            labelStyle={[styles.buttonText, {color: 'red'}]}
          >
            Cancel
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Test;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  logo: {
    height: 50,
    width: 270,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins', // Ensure this font is installed or replace with default font
    marginHorizontal: 10,
    color: '#333',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  input: {
    marginBottom: 15,
    marginHorizontal: 20,
    fontFamily: 'Poppins', // Font for input text
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    marginLeft: 21,
    fontFamily: 'Poppins', // Font for labels
  },
  radioRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 25,
  },
  radioText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
    fontFamily: 'Poppins',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 20,
    width: 280,
  },
  button: {
    flex: 1,
  },
  startButton: {
    backgroundColor: 'red',
    marginRight:5,
  },
  cancelButton: {
    borderColor: '#d32f2f',
    borderWidth: 1,
    marginLeft: 5,
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontSize: 14,
  },
});

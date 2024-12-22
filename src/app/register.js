import React, { useState } from "react";
import { StyleSheet, Text, ScrollView, Image, View, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { TextInput, Button, Checkbox,  } from "react-native-paper";
import { useRouter } from 'expo-router'; 
import styles from "../../src/styles/styles";
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {supabase} from "../utils/supabase";

const Register = () => {
  const router = useRouter();

  const codered = require("../../assets/codered.png");
  const footer = require("../../assets/gradient.png");

  // State definitions
  const [firstName, setFirstName] = useState("");
  const [middleName, setmiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [isRegisterPressed, setIsRegisterPressed] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Helper states for validation
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const [selectedGender, setSelectedGender] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(""); // Date of Birth state for the calendar
  const [showDatePicker, setShowDatePicker] = useState(false); // State to show/hide date picker

  const handleEmailChange = (input) => {
    setEmail(input);
    setEmailError(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input));
  };

  const handlePhoneNumberChange = (input) => {
    const numericInput = input.replace(/[^0-9]/g, "");
    setPhoneNumber(numericInput);
    setPhoneError(numericInput.length !== 10);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(prevState => !prevState);
  };

  const handleDateSelect = (event, selectedDate) => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = selectedDate.getDate().toString().padStart(2, '0');
      setDateOfBirth(`${month}/${day}/${year}`);
    }
    setShowDatePicker(false);
  };

  const handleRegister = async () => {
    setIsRegisterPressed(true);
    setIsLoading(true);

    // Basic Validation - Check if all fields are filled
    if (
        !firstName ||
        !middleName ||
        !lastName ||
        !email ||
        !password ||
        !confirmPassword ||
        !phoneNumber ||
        !selectedGender ||
        !selectedCountry ||
        !selectedRegion ||
        !selectedCity ||
        !selectedBarangay ||
        !currentAddress ||
        !zipcode
    ) {
        alert("Please complete all fields.");
        setIsRegisterPressed(false);
        setIsLoading(false);
        return;
    }

    // Password match validation
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        setIsRegisterPressed(false);
        setIsLoading(false);
        return;
    }

    try {
      const { data: existingUser, error: checkEmailError } = await supabase
      .from("user")
      .select("user_email")
      .eq("user_email", email)
      .maybeSingle();
  
    if (checkEmailError) {
        console.log("Email check error:", checkEmailError);
        alert("An error occurred while checking the email. Please try again later");
        setIsRegisterPressed(false);
        setIsLoading(false);
        return;
    }
    
    if (existingUser) {
        alert("Account already exists. Please log in now.");
        setIsRegisterPressed(false);
        setIsLoading(false);
        return;
    }

        // Step 2: Sign up the user with Supabase Auth
        const { data: { session }, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            console.log("session:", session);
            alert(`Registration failed: ${authError.message}`);
            setIsRegisterPressed(false);
            setIsLoading(false);
            return;
        }

        // Step 3: Format Birthdate if provided
        const formattedBirthdate = dateOfBirth
            ? new Date(dateOfBirth.split("/").reverse().join("-"))
                .toISOString()
                .split("T")[0]
            : null;

        // Step 4: Prepare user data payload (no need to include user_id since it's auto-generated)
        const payload = {
            user_firstname: firstName,
            user_middlename: middleName,
            user_lastname: lastName,
            user_gender: selectedGender,
            user_birthdate: formattedBirthdate,
            user_phoneNumber: phoneNumber,
            user_country: selectedCountry,
            user_region: selectedRegion,
            user_city: selectedCity,
            user_barangay: selectedBarangay,
            user_zipcode: zipcode,
            user_currentAddress: currentAddress,
            user_email: email, 
            user_password: password, 
        };

        // Log the payload to verify
        console.log("Inserting Payload:", payload);

        // Step 5: Insert user data into public.user table
        const { data: insertData, error: insertError } = await supabase
            .from("user") // Ensure you're targeting the correct schema
            .insert([payload]);

        if (insertError) {
            console.error("Database Insert Error:", insertError);
            alert(`Error inserting user data: ${insertError.message}`);
            setIsRegisterPressed(false);
            setIsLoading(false);
            return;
        }

        // Step 6: Successful Registration
        console.log("Database Insert Successful:", insertData);
        alert("Registration successful!");

        // Navigate to the next page (e.g., blood type page)
        router.push("/bloodtype"); // Adjust the navigation path as needed
    } catch (error) {
        console.error("Unexpected Error:", error);
        alert("An unexpected error occurred during registration. Please try again.");
    } finally {
        setIsRegisterPressed(false);
        setIsLoading(false);
    }
};

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={registerStyle.scrollContent} 
          keyboardShouldPersistTaps="handled" 
        > 
          <Image source={codered} style={[styles.logoImage, { width: 150, height: 150, marginTop: 0 }]} />
          <Text style={[styles.headingTitle, { textAlign: 'center' }]}>
            Create an Account
          </Text>

            <View style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <TextInput
              label="FIRST NAME"
              value={firstName}
              mode="outlined"
              activeOutlineColor="red"
              outlineColor="red"
              textColor="black"
              onChangeText={setFirstName}
              style={[
                registerStyle.textInput, 
                { fontFamily: "PoppinsBold", width: '95%', marginBottom: 8, alignSelf: 'center' }
              ]}
            />
            <TextInput
              label="MIDDLE INITIAL"
              value={middleName}
              mode="outlined"
              activeOutlineColor="red"
              outlineColor="red"
              textColor="black"
              onChangeText={(text) => setmiddleName(text.charAt(0))}
              style={[
                registerStyle.textInput, 
                { fontFamily: "PoppinsBold", width: '95%', alignSelf: 'center' } // Adjust width as needed
              ]}
            />
          </View>

          <View>
          <TextInput
            label="LAST NAME"
            value={lastName}
            mode="outlined"
            activeOutlineColor="red"
            outlineColor="red"
            textColor="black"
            onChangeText={setLastName}
            style={[registerStyle.textInput, { fontFamily: "PoppinsBold", width: '95%', flex: 1, alignSelf: 'center' }]}/>
          </View>

          <View style={{
            borderWidth: 1, 
            borderColor: 'red', 
            borderRadius: 5, 
            marginVertical: 10,
            width: '95%',
            alignSelf: 'center'
          }}>
            <Picker
              selectedValue={selectedGender}
              onValueChange={(itemValue) => {
                  if (itemValue !== "") setSelectedGender(itemValue);
                }}
              >
              <Picker.Item label="SELECT GENDER" value="" />
              <Picker.Item label="MALE" value="Male" />
              <Picker.Item label="FEMALE" value="Female" />
              <Picker.Item label="RATHER NOT SAY" value="Others" />
            </Picker>
          </View>

          
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              label="DATE OF BIRTH"
              value={dateOfBirth}
              mode="outlined"
              activeOutlineColor="red"
              outlineColor="red"
              textColor="black"
              editable={false}
              right={<TextInput.Icon icon={"calendar"} color="red" />}
              style={[registerStyle.textInput, { fontFamily: "PoppinsBold", width: '95%', alignSelf: 'center' }]}/>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={handleDateSelect}
            />
          )}

          <TextInput
            label="PHONE NUMBER"
            value={phoneNumber}
            mode="outlined"
            activeOutlineColor="red"
            outlineColor="red"
            textColor="black"
            keyboardType="numeric"
            onChangeText={handlePhoneNumberChange}
            style={[registerStyle.textInput, { fontFamily: "PoppinsBold", width: '95%', alignSelf: 'center'}]}
            left={<TextInput.Affix text="+63" />}
            maxLength={10}
            editable
          />
          {phoneError && (
            <Text style={{ color: 'red', fontFamily: "Poppins", marginLeft: 16, fontSize: 12 }}>
              Invalid Phone Number
            </Text>
          )}

        <View style={{
            borderWidth: 1, 
            borderColor: 'red', 
            borderRadius: 5, 
            marginVertical: 10,
            width: '95%',
            alignSelf: 'center'
          }}>
          <Picker
              selectedValue={selectedCountry}
              onValueChange={(itemValue) => {
                  if (itemValue !== "") setSelectedCountry(itemValue);
                }}
              >
              <Picker.Item label="SELECT COUNTRY" value="" />
              <Picker.Item label="Philippines" value="Philippines" />
          </Picker>
          </View>

          <View style={{
            borderWidth: 1, 
            borderColor: 'red', 
            borderRadius: 5, 
            marginVertical: 10,
            width: '95%',
            alignSelf: 'center'
          }}>
          <Picker
              selectedValue={selectedRegion}
              onValueChange={(itemValue) => {
                  if (itemValue !== "") setSelectedRegion(itemValue);
                }}
              >
              <Picker.Item label="SELECT REGION" value="" />
              <Picker.Item label="Region X" value="Region X" />
          </Picker>
          </View>

          <View style={{
            borderWidth: 1, 
            borderColor: 'red', 
            borderRadius: 5, 
            marginVertical: 10,
            width: '95%',
            alignSelf: 'center'
          }}>
          
          <Picker
              selectedValue={selectedCity}
              onValueChange={(itemValue) => {
                  if (itemValue !== "") setSelectedCity(itemValue);
                }}
              >
              <Picker.Item label="SELECT CITY/MUNICIPALITY" value="" />
              <Picker.Item label="Cagayan de Oro City" value="Cagayan de Oro City" />
          </Picker>
          </View>

          <View style={{
            borderWidth: 1, 
            borderColor: 'red', 
            borderRadius: 5, 
            marginVertical: 10,
            width: '95%',
            alignSelf: 'center'
          }}>
          <Picker
              selectedValue={selectedBarangay}
              onValueChange={(itemValue) => {
                  if (itemValue !== "") setSelectedBarangay(itemValue);
                }}
              >
              <Picker.Item label="SELECT BARANGAY" value="" />
              <Picker.Item label="Agusan" value="Agusan" />
              <Picker.Item label="Baikingon" value="Baikingon" />
              <Picker.Item label="Balubal" value="Balubal" />
              <Picker.Item label="Balulang" value="Balulang" />
              <Picker.Item label="Barangay 1" value="Barangay 1" />
              <Picker.Item label="Barangay 2" value="Barangay 2" />
              <Picker.Item label="Barangay 3" value="Barangay 3" />
              <Picker.Item label="Barangay 4" value="Barangay 4" />
              <Picker.Item label="Barangay 5" value="Barangay 5" />
              <Picker.Item label="Barangay 6" value="Barangay 6" />
              <Picker.Item label="Barangay 7" value="Barangay 7" />
              <Picker.Item label="Barangay 8" value="Barangay 8" />
              <Picker.Item label="Barangay 9" value="Barangay 9" />
              <Picker.Item label="Barangay 10" value="Barangay 10" />
              <Picker.Item label="Barangay 11" value="Barangay 11" />
              <Picker.Item label="Barangay 12" value="Barangay 12" />
              <Picker.Item label="Barangay 13" value="Barangay 13" />
              <Picker.Item label="Barangay 14" value="Barangay 14" />
              <Picker.Item label="Barangay 15" value="Barangay 15" />
              <Picker.Item label="Barangay 16" value="Barangay 16" />
              <Picker.Item label="Barangay 17" value="Barangay 17" />
              <Picker.Item label="Barangay 18" value="Barangay 18" />
              <Picker.Item label="Barangay 19" value="Barangay 19" />
              <Picker.Item label="Barangay 20" value="Barangay 20" />
              <Picker.Item label="Barangay 21" value="Barangay 21" />
              <Picker.Item label="Barangay 22" value="Barangay 22" />
              <Picker.Item label="Barangay 23" value="Barangay 23" />
              <Picker.Item label="Barangay 24" value="Barangay 24" />
              <Picker.Item label="Barangay 25" value="Barangay 25" />
              <Picker.Item label="Barangay 26" value="Barangay 26" />
              <Picker.Item label="Barangay 27" value="Barangay 27" />
              <Picker.Item label="Barangay 28" value="Barangay 28" />
              <Picker.Item label="Barangay 29" value="Barangay 29" />
              <Picker.Item label="Barangay 30" value="Barangay 30" />
              <Picker.Item label="Barangay 31" value="Barangay 31" />
              <Picker.Item label="Barangay 32" value="Barangay 32" />
              <Picker.Item label="Barangay 33" value="Barangay 33" />
              <Picker.Item label="Barangay 34" value="Barangay 34" />
              <Picker.Item label="Barangay 35" value="Barangay 35" />
              <Picker.Item label="Barangay 36" value="Barangay 36" />
              <Picker.Item label="Barangay 37" value="Barangay 37" />
              <Picker.Item label="Barangay 38" value="Barangay 38" />
              <Picker.Item label="Barangay 39" value="Barangay 39" />
              <Picker.Item label="Barangay 40" value="Barangay 40" />
              <Picker.Item label="Bayabas" value="Bayabas" />
              <Picker.Item label="Bayanga" value="Bayanga" />
              <Picker.Item label="Besigan" value="Besigan" />
              <Picker.Item label="Bonbon" value="Bonbon" />
              <Picker.Item label="Bugo" value="Bugo" />
              <Picker.Item label="Bulua" value="Bulua" />
              <Picker.Item label="Camaman-an" value="Camaman-an" />
              <Picker.Item label="Canito-an" value="Canito-an" />
              <Picker.Item label="Carmen" value="Carmen" />
              <Picker.Item label="Consolacion" value="Consolacion" />
              <Picker.Item label="Cugman" value="Cugman" />
              <Picker.Item label="Dansolihon" value="Dansolihon" />
              <Picker.Item label="F.S. Catanico" value="F.S. Catanico" />
              <Picker.Item label="Gusa" value="Gusa" />
              <Picker.Item label="Indahag" value="Indahag" />
              <Picker.Item label="Iponan" value="Iponan" />
              <Picker.Item label="Kauswagan" value="Kauswagan" />
              <Picker.Item label="Lapasan" value="Lapasan" />
              <Picker.Item label="Lumbia" value="Lumbia" />
              <Picker.Item label="Macabalan" value="Macabalan" />
              <Picker.Item label="Macasandig" value="Macasandig" />
              <Picker.Item label="Mambuaya" value="Mambuaya" />
              <Picker.Item label="Nazareth" value="Nazareth" />
              <Picker.Item label="Pagalungan" value="Pagalungan" />
              <Picker.Item label="Pagatpat" value="Pagatpat" />
              <Picker.Item label="Patag" value="Patag" />
              <Picker.Item label="Pigsag-an" value="Pigsag-an" />
              <Picker.Item label="Puerto" value="Puerto" />
              <Picker.Item label="Puntod" value="Puntod" />
              <Picker.Item label="San Simon" value="San Simon" />
              <Picker.Item label="Tablon" value="Tablon" />
              <Picker.Item label="Taglimao" value="Taglimao" />
              <Picker.Item label="Tagpangi" value="Tagpangi" />
              <Picker.Item label="Tignapoloan" value="Tignapoloan" />
              <Picker.Item label="Tuburan" value="Tuburan" />
              <Picker.Item label="Tumpagon" value="Tumpagon" />
          </Picker>
          </View>

          <TextInput
            label="ZIPCODE"
            value={zipcode}
            mode="outlined"
            activeOutlineColor="red"
            outlineColor="red"
            textColor="black"
            keyboardType="numeric"
            onChangeText={setZipcode}
            style={[registerStyle.textInput, { fontFamily: "PoppinsBold", width: '95%', alignSelf: 'center'}]}
          />

          <TextInput
            label="CURRENT ADDRESS"
            value={currentAddress}
            mode="outlined"
            activeOutlineColor="red"
            outlineColor="red"
            textColor="black"
            onChangeText={setCurrentAddress}
            style={[registerStyle.textInput, { fontFamily: "PoppinsBold", width: '95%', alignSelf: 'center'}]}
          />

          <TextInput
            label="EMAIL"
            value={email}
            mode="outlined"
            activeOutlineColor="red"
            outlineColor="red"
            textColor="black"
            onChangeText={handleEmailChange}
            style={[registerStyle.textInput, { fontFamily: "PoppinsBold", width: '95%', alignSelf: 'center'}]}/>
            
            {emailError && (
            <Text style={{ color: 'red', fontFamily: "Poppins", marginLeft: 16, fontSize: 12 }}>
              Invalid Email
            </Text>
          )}

          <TextInput
            label="PASSWORD"
            value={password}
            mode="outlined"
            activeOutlineColor="red"
            outlineColor="red"
            textColor="black"
            secureTextEntry={!isPasswordVisible}
            onChangeText={setPassword}
            right={<TextInput.Icon icon={isPasswordVisible ? "eye-off" : "eye"} color="red" onPress={togglePasswordVisibility} />}
            style={[registerStyle.textInput, { fontFamily: "PoppinsBold", width: '95%', alignSelf: 'center'}]}
          />
          <TextInput
            label="CONFIRM PASSWORD"
            value={confirmPassword}
            mode="outlined"
            activeOutlineColor="red"
            outlineColor="red"
            textColor="black"
            secureTextEntry={!isConfirmPasswordVisible}
            onChangeText={setConfirmPassword}
            right={<TextInput.Icon icon={isConfirmPasswordVisible ? "eye-off" : "eye"} color="red" onPress={toggleConfirmPasswordVisibility} />}
            style={[registerStyle.textInput, { fontFamily: "PoppinsBold", width: '95%', alignSelf: 'center'}]}
          />
          {password !== confirmPassword && confirmPassword.length > 0 && (
            <Text style={{ color: 'red', fontFamily: "Poppins", marginLeft: 16, fontSize: 12 }}>
              Passwords don't match
            </Text>
          )}

          <View style={[registerStyle.checkboxContainer, { marginBottom: 2, marginLeft: 3 , alignSelf: 'center'}]}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              uncheckedColor="red"
              color="red"
              onPress={() => setChecked(!checked)}
            />
            <Text style={registerStyle.checkboxLabel}>
              By proceeding,  I consent to the Terms and Conditions and Privacy Policy.
            </Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Button
              mode="contained"
              onPress={handleRegister}
              disabled={isRegisterPressed}
              loading={isLoading}
              buttonColor={isRegisterPressed ? "#ff8e92" : "red"}
              labelStyle={{ fontSize: 18, textAlign: 'center', color: 'white', fontFamily: "PoppinsBold" }} 
              style={{ paddingVertical: 7, paddingHorizontal: 5, margin: 10, borderRadius:5, width: '95%', height: 50, marginBottom:120, alignSelf: 'center' }}
            >
              PROCEED
            </Button>
          </View>

          <View style={[styles.footerContainer, { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex:-1 }]}>
            <Image source={footer} style={styles.footerImage} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Register;

const registerStyle = StyleSheet.create(styles);

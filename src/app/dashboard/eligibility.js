import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Button, RadioButton } from "react-native-paper";
import { Octicons, Ionicons } from "react-native-vector-icons"

const Test = () => {
  const test = require("../../assets/testlogo.png");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const progress = useRef(new Animated.Value(0)).current;
  

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (currentQuestion + 1) / totalQuestions,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentQuestion]);

  const totalQuestions = 42;

  const questions = [
    {
      id: 1,
      question: "Are you feeling healthy and well today?",
      options: ["YES", "NO"],
    },
    {
      id: 2,
      question: "Are you currently taking an antibiotic?",
      options: ["YES", "NO"],
    },
    {
      id: 3,
      question:
        "Are you currently taking any other medication for an infection?",
      options: ["YES", "NO"],
    },
    {
      id: 4,
      question: "Are you pregnant now?",
      options: ["YES", "NO"],
    },
    {
      id: 5,
      question:
        "Have you taken any medications on the Medication Deferral List in the time frames indicated?",
      options: ["YES", "NO"],
    },
    {
      id: 6,
      question: "Have you read the blood donor educational materials today?",
      options: ["YES", "NO"],
    },
    {
      id: 7,
      question:
        "In the past 48 hours have you taken aspirin or anything that has aspirin in it?",
      options: ["YES", "NO"],
    },
    {
      id: 8,
      question:
        "In the past 8 weeks, have you had any vaccinations or other shots?",
      options: ["YES", "NO"],
    },
    {
      id: 9,
      question:
        "In the past 8 weeks, have you had contact with someone who was vaccinated for smallpox in the past 8 weeks?",
      options: ["YES", "NO"],
    },
    {
      id: 10,
      question:
        "In the past 3 months, have you taken any medication by mouth (oral) to prevent HIV infection? (i.e., PrEP or PEP)",
      options: ["YES", "NO"],
    },
    {
      id: 11,
      question:
        "In the past 3 months, have you had sexual contact with a new partner? (Refer to the examples of NEW PARTNER in the Blood Donor Educational Material)",
      options: ["YES", "NO"],
    },
    {
      id: 12,
      question:
        "In the past 3 months, have you had sexual contact with more than one partner?",
      options: ["YES", "NO"],
    },
    {
      id: 13,
      question:
        "Are you currently taking any other medication for an infection?",
      options: ["YES", "NO"],
    },
    {
      id: 14,
      question:
        "In the past 3 months, have you had sexual contact with anyone who has ever had a positive test for HIV infection?",
      options: ["YES", "NO"],
    },
    {
      id: 15,
      question:
        "In the past 3 months, have you received money, drugs, or other payment for sex?",
      options: ["YES", "NO"],
    },
    {
      id: 16,
      question:
        "In the past 3 months, have you had sexual contact with anyone who has, in the past 3 months, received money, drugs or other payment for sex?",
      options: ["YES", "NO"],
    },
    {
      id: 17,
      question:
        "In the past 3 months, have you used needles to inject drugs, steroids, or anything not prescribed by your doctor?",
      options: ["YES", "NO"],
    },
    {
      id: 18,
      question:
        "In the past 3 months, have you had sexual contact with anyone who has used needles in the past 3 months to inject drugs, steroids, or anything not prescribed by their doctor?",
      options: ["YES", "NO"],
    },
    {
      id: 19,
      question:
        "In the past 3 months, have you had syphilis or gonorrhea or been treated for syphilis or gonorrhea?",
      options: ["YES", "NO"],
    },
    {
      id: 21,
      question:
        "In the past 3 months, have you had sexual contact with a person who has hepatitis?",
      options: ["YES", "NO"],
    },
    {
      id: 22,
      question:
        "In the past 3 months, have you lived with a person who has hepatitis?",
      options: ["YES", "NO"],
    },
    {
      id: 23,
      question:
        "In the past 3 months, have you had an accidental needle-stick?",
      options: ["YES", "NO"],
    },
    {
      id: 24,
      question:
        "In the past 3 months, have you come into contact with someone else’s blood?",
      options: ["YES", "NO"],
    },
    {
      id: 25,
      question: "In the past 3 months, have you had a tattoo?",
      options: ["YES", "NO"],
    },
    {
      id: 26,
      question: "In the past 3 months, have you had ear or body piercing?",
      options: ["YES", "NO"],
    },
    {
      id: 27,
      question: "In the past 3 months, have you had a blood transfusion?",
      options: ["YES", "NO"],
    },
    {
      id: 28,
      question:
        "In the past 3 months, have you had a transplant such as organ, tissue, or bone marrow?",
      options: ["YES", "NO"],
    },
    {
      id: 29,
      question:
        "In the past 3 months, have you had a graft such as bone or skin?",
      options: ["YES", "NO"],
    },
    {
      id: 30,
      question:
        "In the past 16 weeks have you donated a double unit of red blood cells using an apheresis machine?",
      options: ["YES", "NO"],
    },
    {
      id: 31,
      question:
        "In the past 12 months, have you been in juvenile detention, lockup, jail, or prison for 72 hours or more consecutively?",
      options: ["YES", "NO"],
    },
    {
      id: 32,
      question:
        "In the past 2 years, have you received any medication by injection to prevent HIV infection? (i.e. long-acting antiviral PrEP or PEP)",
      options: ["YES", "NO"],
    },
    {
      id: 33,
      question: 'In the past three years have you been outside the Philippines?',
      options: ['YES', 'NO'],
    },
    {
      id: 34,
      question: 'Have you EVER had a positive test for HIV infection?',
      options: ['YES', 'NO'],
    },
    {
      id: 35,
      question: 'Have you EVER taken any medication to treat HIV infection?',
      options: ['YES', 'NO'],
    },
    {
      id: 36,
      question: 'Have you ever been pregnant?',
      options: ['YES', 'NO'],
    },
    {
      id: 37,
      question: 'Have you ever had malaria?',
      options: ['YES', 'NO'],
    },
    {
      id: 38,
      question: 'Have you ever received a dura mater (or brain covering) graft or xenotransplantation product?',
      options: ['YES', 'NO'],
    },
    {
      id: 39,
      question: 'Have you ever had any type of cancer, including leukemia?',
      options: ['YES', 'NO'],
    },
    {
      id: 40,
      question: 'Have you ever had any problems with your heart or lungs?',
      options: ['YES', 'NO'],
    },
    {
      id: 41,
      question: 'Have you EVER had a bleeding condition or blood disease?',
      options: ['YES', 'NO'],
    },
    {
      id: 42,
      question: 'Have you EVER had a positive test result for Babesia?',
      options: ['YES', 'NO'],
    },
    {
      id: 43,
      question: 'In the past 4 months, have you been exposed to a local Hepatitis A Outbreak?',
      options: ['YES', 'NO'],
    },
  ];

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleStartQuiz = () => {
    if (firstName && lastName && birthDate && gender) {
      setQuizStarted(true);
    } else {
      alert("Please fill in all the fields before starting the quiz.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {!quizStarted ? (
        // Form Section
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Image source={test} style={styles.logo} />
            <Text style={styles.headerText}>
              Please enter the following information to begin the RapidPass®
            </Text>
          </View>

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

          <Text style={styles.label}>Gender:</Text>
          <RadioButton.Group
            onValueChange={(value) => setGender(value)}
            value={gender}
          >
            <View style={[styles.radioRow, { flexDirection: "row" }]}>
              <View style={styles.radioItem}>
                <RadioButton value="Male" color="red" />
                <Text style={styles.radioText}>Male</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="Female" color="red" />
                <Text style={styles.radioText}>Female</Text>
              </View>
            </View>
          </RadioButton.Group>

          {/* Start Button */}
          <View style={{ alignItems: "center" }}>
            <Button
              mode="elevated"
              onPress={handleStartQuiz}
              buttonColor={"red"}
              labelStyle={{
                fontSize: 18,
                textAlign: "center",
                color: "white",
                fontFamily: "PoppinsBold",
              }}
              style={{
                paddingVertical: 7,
                paddingHorizontal: 5,
                margin: 10,
                borderRadius: 5,
                width: 290,
                height: 50,
                marginBottom: 120,
              }}
            >
              START
            </Button>
          </View>
        </View>
      ) : (
        // Quiz Section
        <View style={styles.quizContainer}>
        <View style={styles.navigationContainer}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentQuestion === 0 && styles.disabledButton,
                ]}
                onPress={handleBack}
                disabled={currentQuestion === 0}
              >
                <Ionicons
                  name="arrow-back" 
                  size={24} 
                  color={currentQuestion === 0 ? "gray" : "red"} 
                />
              </TouchableOpacity>
              
              <Text style={styles.counterText}>
              {currentQuestion + 1} / {totalQuestions}
            </Text>
          </View>
        <View style={styles.progressBarContainer}>
            <Animated.View
              style={[ 
                styles.progressBar, 
                { 
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }) 
                }
              ]}
            />
          </View>
    
          <View style={{marginHorizontal: 10, marginVertical: 30}}>
            <Text style={styles.questionText}>
              {questions[currentQuestion].question}
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity key={index} style={styles.optionButton} onPress={handleNext}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Test;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  logo: {
    height: 80,
    width: 270,
    resizeMode: "contain",
    marginBottom: 5,
  },
  headerText: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Poppins",
    marginHorizontal: 10,
    color: "#333",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
    marginLeft: 21,
    fontFamily: "Poppins",
  },
  radioRow: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 25,
  },
  radioText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
    fontFamily: "Poppins",
  },
  button: {
    marginTop: 20,
  },
  buttonText: {
    fontSize: 14,
  },
  quizContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
 
  questionText: {
    fontSize: 16,
    textAlign: "justify",
    marginBottom: 20,
    color: "#333",
    fontFamily: 'Poppins',
    marginTop: -20
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    position: 'absolute',
    marginTop: 230
  },
  optionButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: 'Poppins'
  },
  navigationContainer: {
    flexDirection: "row",
    alignSelf: 'stretch'
    
  },
  navButton: {
    paddingVertical: 5,
    marginLeft: 8,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: '#ffff',
    
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: 'Poppins'
  },
  disabledButton: {
    borderColor: 'gray'  
  },

  progressBarContainer: {
    height: 14,
    width: "94%",
    backgroundColor: "#f3f3f3",
    borderRadius:5,
    overflow: "hidden",
    alignSelf: "center",
    marginVertical: 10,
    marginTop: 20
  },
  progressBar: {
    height: "100%",
    backgroundColor: "red",
  },
  counterText: {
    fontSize: 14,
    color: 'red',
    fontFamily: 'Poppins',
    textAlign: 'center',
    alignSelf: 'center',
    marginLeft: 118
   
  },
  
});

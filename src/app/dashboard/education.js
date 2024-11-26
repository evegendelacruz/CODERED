import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Education = () => {
  return (
    <SafeAreaView>
      {/* Header Section */}
      <View>
        <Text style={styles.title}>
          What You Must Know Before Giving Blood
        </Text>
        <Text style={styles.subtitle}>
          YOU MUST READ THIS BEFORE YOU DONATE!
        </Text>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={[styles.text, {textAlign:'justify'}]}>
          Your accurate and honest responses are critical to the safety of
          patients who receive blood transfusions. Each question is necessary
          to fully evaluate the safety of your donation.
        </Text>
        <Text style={styles.text}>
          As required by regulations, we are instructing you not to donate
          blood if you have a risk factor.
        </Text>
        <Text style={styles.text}>
          If you don’t understand a question, ask the blood center staff for
          assistance.
        </Text>
        <Text style={styles.text}>
          YOUR RESPONSES ARE CONFIDENTIAL.
        </Text>

        <Text style={styles.subtitle}>Knowing what to expect</Text>
        <Text style={styles.text}>
          Most people have uneventful donations and feel good about donating
          afterward, but some donors may have a lightheaded or dizzy feeling;
          an upset stomach; a black and blue mark, redness, or pain from the
          needle; fainting or loss of consciousness and injury from related
          falls; or very rarely, nerve or artery damage. Blood donation removes
          iron from the body and may cause or aggravate iron-deficiency anemia.
        </Text>

        <Text style={styles.subtitle}>
          To determine if you are eligible to donate, we will
        </Text>
        <Text style={styles.text}>
          - Ask about your health and medications you are taking or have taken.
        </Text>
        <Text style={styles.text}>
          - Ask if you have traveled to or lived in other countries.
        </Text>
        <Text style={styles.text}>
          - Ask about your risk for infections that can be transmitted by blood
          – especially HIV (which is the virus that causes AIDS), and viral
          hepatitis.
        </Text>
        <Text style={styles.text}>
          - Take your blood pressure, temperature, and pulse.
        </Text>
        <Text style={styles.text}>
          - Take a blood sample to be sure your blood count is acceptable.
        </Text>

        <Text style={styles.subtitle}>If you are eligible to donate, we will</Text>
        <Text style={styles.text}>
          - Clean your arm with an antiseptic. Tell us if you have any skin
          allergies.
        </Text>
        <Text style={styles.text}>
          - Use a sterile needle and tubing set to collect your blood.
        </Text>
        <Text style={styles.text}>
          - We NEVER reuse a needle and tubing set.
        </Text>

        <Text style={styles.subtitle}>What Happens after Your Donation</Text>
        <Text style={styles.text}>
          To protect patients, your blood is tested for hepatitis B and C, HIV,
          syphilis, and other infections. If your blood tests positive, it will
          not be given to a patient. You will be notified about any positive
          test result which may affect when you are eligible to donate in the
          future. There are times when your blood is not tested. If this occurs,
          you may not receive any notification. The blood center will not
          release your test results without your written permission unless
          required by law (e.g., to the health department).
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Education;

const styles = StyleSheet.create({
  title: {
    fontFamily: 'PoppinsBold',
    textAlign: 'center',
    color: 'black',
    marginVertical: 10,
    marginTop: 20,
    fontSize: 20,
    marginHorizontal: 10,
  },
  subtitle: {
    fontFamily: 'Poppins',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
  contentContainer: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  text: {
    fontFamily: 'Poppins',
    fontSize: 12,
    marginBottom: 10,
    textAlign:'justify',
    marginHorizontal: 10,
    
  },
});

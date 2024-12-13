import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Education = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
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
        <Text style={[styles.text, { textAlign: 'justify', fontSize: 12 }]}>
          Your{' '}
        <Text style={{ textDecorationLine: 'underline' }}>
          accurate and honest
        </Text>{' '}
          responses are critical to the safety of patients who receive blood
          transfusions.
        </Text>

        <Text style={[styles.text2, { fontSize: 9.2 }]}>
          Each question is necessary to fully evaluate the safety of your donation.
        </Text>

        <Text style={[styles.text2, { fontSize: 9.2 }]}>
          As required by regulations, we are instructing you not to donate blood if you have a risk factor.
        </Text>

        <Text style={[styles.text2, { fontSize: 9.2 }]}>
          If you don’t understand a question, ask the blood center staff for assistance.
        </Text>

        <Text style={[styles.text2, { fontSize: 9.2 }]}>
          YOUR RESPONSES ARE CONFIDENTIAL.
        </Text>

        <Text style={styles.subtitle}>Knowing what to expect</Text>
          <Text style={styles.text}>
          Most people have uneventful donations and feel good about donating afterward,
          but some donors may have a lightheaded or dizzy feeling; an upset stomach;
          a black and blue mark, redness, or pain from the needle;
          fainting or loss of consciousness and injury from related falls;
          or very rarely, nerve or artery damage.
          Blood donation removes iron from the body and may cause or aggravate iron-deficiency anemia.
          </Text>

        <Text style={styles.subtitle}>
            To determine if you are eligible to donate, we will
          </Text>
          <Text style={styles.text2}>
            - Ask about your health and medications you are taking or have taken.
          </Text>
          <Text style={styles.text2}>
            - Ask if you have traveled to or lived in other countries.
          </Text>
          <Text style={styles.text2}>
            - Ask about your risk for infections that can be transmitted by blood
            – especially HIV (which is the virus that causes AIDS), and viral
            hepatitis.
          </Text>
          <Text style={styles.text2}>
            - Take your blood pressure, temperature, and pulse.
          </Text>
          <Text style={styles.text2}>
            - Take a blood sample to be sure your blood count is acceptable.
          </Text>

        <Text style={styles.subtitle}>If you are eligible to donate, we will</Text>
          <Text style={styles.text2}>
            - Clean your arm with an antiseptic. Tell us if you have any skin
            allergies.
          </Text>
          <Text style={styles.text2}>
            - Use a sterile needle and tubing set to collect your blood.
          </Text>

          <Text style={[styles.text3, { fontSize: 10}]}>
            We NEVER reuse a needle and tubing set.
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

        <Text style={styles.subtitle}>Donor Eligibility – Specific Information</Text>
          <Text style={styles.text}>
            Certain infectious diseases such as HIV and hepatitis, can be spread through:
          </Text>

          <Text style={styles.text2}>
            - Sexual contact
          </Text>

          <Text style={styles.text2}>
            - Other activities that increase risk
          </Text>

          <Text style={styles.text2}>
            - Blood transfusion
          </Text>

          <Text style={[styles.text3, { fontSize: 10}]}>
            We will ask specific questions about sexual contact and other activities that may increase risk for these infections.
          </Text>

        <Text style={styles.subtitle}>What do we mean by “sexual contact?”</Text>
          <Text style={styles.text}>
            The words “have sexual contact with” and “sex” are used in some of the questions we will ask you, These questions, apply to all of the activities below,
            whether or not medications, condoms or other protection were used to prevent infection or pregnancy:
          </Text>

          <Text style={styles.text2}>
            - Vaginal sex (contact between penis and vagina)
          </Text>

          <Text style={styles.text2}>
            - Oral sex (mouth or tongue on someone’s vagina, penis, or anus)
          </Text>

          <Text style={styles.text2}>
            - Anal sex (contact between penis and anus)
          </Text>
    
        <Text style={styles.subtitle}>A "new sexual partner" includes the following examples:</Text>
          
          <Text style={styles.text}>
            - Having sex with someone for the first time
          </Text>

          <Text style={[styles.text3, { fontSize: 12}]} >
            OR
          </Text>

          <Text style={styles.text}>
            - Having had sex with someone in a relationship that ended in the past, and having sex again with that person in the last 3 months.
          </Text>

        <Text style={styles.subtitle}>HIV/Hepatitis Risk Factors</Text>
          <Text style={styles.text}>
          HIV and hepatitis are spread mainly by sexual contact with an infected person OR by sharing needles or syringes used by an infected person to inject drugs.
          </Text>

        <Text style={styles.subtitle}>DO NOT DONATE IF YOU</Text>
          <Text style={styles.text2}>
          - Have EVER taken any medication to treat HIV infection.
          </Text>

          <Text style={styles.text2}>
          - Are taking any medication to prevent HIV infection. These medications may be called: PrEP, PEP, TRUVADA, DESCOVY, APRETUDE or many other names.
          </Text>

          <Text style={[styles.text3, { fontSize: 9.6}]}>
          FDA-approved antiretroviral drugs are safe and effective in preventing sexual transmission of HIV.
          However, these antiretroviral drugs do not fully eliminate the virus from the body, and donated blood can potentially still
          transmit HIV infection to a transfusion recipient.
          </Text>

          <Text style={[styles.text3, { fontSize: 11.5}]}>
            DO NOT STOP TAKING ANY PRESCRIBED MEDICATIONS IN ORDER TO DONATE BLOOD, INCLUDING PrEP and PEP MEDICATIONS
          </Text>

        <Text style={styles.subtitle}>DO NOT DONATE IF YOU</Text>
          <Text style={styles.text2}>
          - Have ever had a positive test for HIV infection
          </Text>

          <Text style={[styles.text3, { fontSize: 14}]}>
          In the past 3 Months:
          </Text>

          <Text style={styles.text2}>
          - Have had sexual contact with a new partner
          and have had anal sex.
          </Text>

          <Text style={styles.text2}>
          - Have had sexual contact with more than one partner
          and have had anal sex.
          </Text>

          <Text style={styles.text2}>
          - Have had sexual contact with anyone who has
          ever had a positive test for HIV infection
          </Text>

          <Text style={styles.text2}>
          - Have received money, drugs or other payment for sex
          </Text>

          <Text style={styles.text2}>
          - Have used needles to inject drugs, steroids or
          anything not prescribed by your doctor.
          </Text>

          <Text style={styles.text2}>
          - Have used needles to inject drugs, steroids or
          anything not prescribed by your doctor.
          </Text>

          <Text style={styles.text2}>
          - Have had sexual contact with anyone who has received money,
          drugs, or other payment for sex, or used needles to inject drugs,
          steroids or anything not prescribed by their doctor.
          </Text>

          <Text style={styles.text2}>
          - Have had syphilis or gonorrhea or been
          treated for syphilis or gonorrhea
          </Text>

          <Text style={[styles.text3, { fontSize: 14}]}>
          In the past 12 Months:
          </Text>

          <Text style={styles.text2}>
          - Have been in juvenile detention, lockup, jail,
          or prison for 72 hours or more consecutively
          </Text>

          <Text style={styles.text2}>
          - Have ever had Ebola virus infection or disease.
          </Text>

          <Text style={[styles.text3, { fontSize: 14}]}>
          DO NOT DONATE if you have these symptoms,
          which can be present before you test positive for HIV:
          </Text>

          <Text style={styles.text2}>
          - Fever
          </Text>

          <Text style={styles.text2}>
          - Enlarged lymph glands
          </Text>

          <Text style={styles.text2}>
          - Sore throat
          </Text>

          <Text style={styles.text2}>
          - Rash
          </Text>

          <Text style={[styles.text3, { fontSize: 11}]}>
          Your blood can transmit infections, including HIV, even if you feel well
          and all your tests are normal. EVEN the best tests cannot detect the virus
          for a period of time after you are infected.
          </Text>

        <Text style={styles.subtitle}>DO NOT DONATE IF YOU</Text>
          <Text style={styles.text2}>
          - If you think you may be at risk for HIV or other infections.
          </Text>

          <Text style={styles.text2}>
          - If your purpose for donating is to obtain test results for HIV or other infections.
          Ask us where you can be tested for HIV and other infections.
          </Text>

          <Text style={styles.text2}>
          - If your donation might harm the patient who receives your blood.
          </Text>

          <Text style={[styles.text3, { fontSize: 10}]}>
          We maintain a confidential list of people who may be at risk for spreading
          transfusion-transmitted diseases. By continuing this process, you consent to be
          entered in this confidential list of deferred donors if you are at risk for
          spreading such diseases. When required, we report donor information, including test results,
          to health departments, military medical commands, and regulatory agencies. Donation information may
          also be used confidentially for research related to blood safety.
          </Text>

        <Text style={styles.subtitle}>CONTACT</Text>
          <Text style={styles.text}>
          We may contact you at any phone number or e-mail address you provide, including by automated telephone call or text,
          regarding your blood donation, future blood donations, and other opportunities to support the American Red Cross mission.
          You may choose not to provide a particular phone number or e-mail address if you do not want us to use it for these purposes.
          </Text>

        <Text style={styles.subtitle}>INFORMATION WE VERIFY WITH YOU</Text>
          <Text style={styles.text}>
            We will ask you to confirm information that we have in your computer record to ensure we have the most updated information.
            You will be asked to confirm all of your demographic information, including your gender.
            This will ensure that the information we have is current and correct.
          </Text>

          <Text style={styles.text3}>
            Questions? Please call us at 1-800-RED-CROSS (1-800-733-2767)
          </Text>

          <Text style={[styles.text3, { fontSize: 15}]}>
            THANK YOU FOR DONATING BLOOD TODAY!
          </Text>

          <Text style={styles.text2}>
            Legacy Doc No: 15.4.fs402 Rev# 6
          </Text>

        </View>
      </ScrollView>
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
    fontSize: 9,
    marginBottom: 10,
    textAlign: 'justify',
    marginHorizontal: 10,
  },
  text2: {
    fontFamily: 'Poppins',
    fontSize: 9,
    marginBottom: 0,
    textAlign: 'justify',
    marginHorizontal: 10,
  },
  text3: {
    fontFamily: 'Poppins',
    fontSize: 9,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'justify',
    marginHorizontal: 10,
  },
});

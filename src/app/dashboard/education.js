import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Education = () => {

  const data = [
    { name: "Feldene", alias: "piroxicam", time: "2 days" },
    { name: "Effient", alias: "prasugrel", time: "3 days" },
    { name: "Brilinta", alias: "ticagrelor", time: "7 days" },
    { name: "Plavix", alias: "clopidogrel", time: "14 days" },
    { name: "Ticlid", alias: "ticlopidine", time: "14 days" },
    { name: "Zontivity", alias: "vorapaxar", time: "1 month" },
    { name: "Arixtra", alias: "fondaparinux", time: "2 days" },
    { name: "Eliquis", alias: "apixaban", time: "2 days" },
    { name: "Fragmin", alias: "dalteparin", time: "2 days" },
    { name: "Lovenox", alias: "enoxaparin", time: "2 days" },
    { name: "Pradaxa", alias: "dabigatran", time: "2 days" },
    { name: "Savaysa", alias: "edoxaban", time: "2 days" },
    { name: "Xarelto", alias: "rivaroxaban", time: "2 days" },
    { name: "Coumadin, Warfilone, or Jantoven", alias: "warfarin", time: "7 days" },
    { name: "Heparin, low molecular weight heparin", time: "7 days" },
    { name: "Accutane", alias: "isotretinoin", time: "1 Month" },
    { name: "Amnesteem", alias: "isotretinoin", time: "1 Month" },
    { name: "Absorica", alias: "isotretinoin", time: "1 Month" },
    { name: "Claravis", alias: "isotretinoin", time: "1 Month" },
    { name: "Myorisan", alias: "isotretinoin", time: "1 Month" },
    { name: "Sotret", alias: "isotretinoin", time: "1 Month" },
    { name: "Zenatane", alias: "isotretinoin", time: "1 Month" },
    { name: "Thalomid", alias: "thalidomide", time: "1 Month" },
    { name: "Revlimid", alias: "lenalidomine", time: "1 Month" },
    { name: "Rinvoq", alias: "upadacitinib", time: "1 Month" },
    { name: "Propecia", alias: "finasteride", time: "1 Month" },
    { name: "Proscar", alias: "finasteride", time: "1 Month" },
    { name: "Avodart", alias: "dutasteride", time: "6 Months" },
    { name: "Jalyn", alias: "dutasteride", time: "6 Months" },
    { name: "Cellcept", alias: "mycophenolate mofetil", time: "6 weeks" },
    { name: "Hepatitis B Immune Globulin", alias: "HBIG", time: "3 months" },
  ];

  const HIVdata = [
    { name: "Truvada", alias: "emtricitabine and tenofovir disoproxil fumarate", time: "3 months" },
    { name: "Descovy", alias: "emtricitabine and tenofovir alafenamide", time: "3 months" },
    { name: "Apretude", alias: "cabotegravir", time: "2 years" },
    { name: "Erivedge", alias: "vismodegib", time: "2 years" },
    { name: "Odomzo", alias: "sonidegib", time: "2 years" },
    { name: "Aubagio", alias: "teriflunomide", time: "2 years" },
    { name: "Arava", alias: "leflunomide", time: "2 years" },
    { name: "Soriatane", alias: "acitretin", time: "3 years" },
    { name: "Tegison", alias: "etretinate", time: "Ever" },
    { name: "Any medication to treat HIV. May also be called antiretroviral therapy (ART)", time: "Ever" },
    { name: "Experimental Medication", time: "12 Months" },
  ];

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

        </View>

        <View>
          <Text style={styles.title}>
            Information Sheet Transfusion-Related Acute Lung Injury (TRALI)
          </Text>
        </View>

        <View style={styles.contentContainer}>

          <Text style={[styles.text, { fontSize: 10}]}>
            TRALI is an acute complication following blood transfusion that is characterized by severe shortness of breath, often associated with fever and low blood pressure. Although rare, it is one of the most common causes of transfusion-related death. TRALI can occur rapidly after a blood transfusion and is often associated with the receipt of plasma or platelet products.
          </Text>

          <Text style={styles.text3}>
            In order to maintain the safest possible blood supply for our patients, we need to reduce the risk of TRALI in the plasma and platelets we collect.
          </Text>

          <Text style={[styles.text, { fontSize: 10}]}>
            There is no specific test to identify blood products that will cause TRALI in a transfusion recipient. However, we do know that units of plasma or platelets that have caused a TRALI reaction in a transfusion recipient often contain antibodies to human leukocyte antigens (HLA). These antibodies are known as HLA antibodies and are on the white blood cell (leukocyte) surfaces. When women are exposed to their baby’s blood during pregnancy and delivery, they may develop HLA antibodies. There is a direct relationship between pregnancy history and having a positive test for HLA antibodies.
          </Text>

          <Text style={styles.text3}>
            The presence of these HLA antibodies in a healthy individual’s blood does not cause health problems, and generally does not cause harm when transfused to patients. However, in rare cases, HLA antibodies may contribute to a TRALI reaction in a transfusion recipient.
          </Text>

          <Text style={styles.text3}>
            We can reduce the chance that blood products—particularly plasma or platelet products—contain these HLA antibodies, and reduce the risk of a TRALI reaction in transfusion recipients by expanding the screening process for all female donors.
          </Text>

          <Text style={styles.text3}>
            If you are a female donor, we will ask you how many pregnancies you have had. If you are donating apheresis, we will test a sample of your blood for HLA antibodies. This screening will be performed each time the number of pregnancies you have had changes.
          </Text>

          <Text style={[styles.text, { textAlign: 'justify', fontSize: 10, marginTop: 10 }]}>
            If your test for HLA antibodies is{' '}
          <Text style={{ textDecorationLine: 'underline' }}>
            negative
          </Text>{' '}
          </Text>

          <Text style={[styles.text2, {fontSize: 10.5}]}>
            • You can continue to donate platelets and or plasma.
          </Text>

          <Text style={[styles.text, { textAlign: 'justify', fontSize: 10, marginTop: 30 }]}>
            If your test for HLA antibodies is{' '}
          <Text style={{ textDecorationLine: 'underline' }}>
            positive
          </Text>{' '}
          </Text>

          <Text style={[styles.text2, {fontSize: 10.5}]}>
            • You will be notified by mail; the notification letter will not say anything about your pregnancy history.
            You will be asked to stop donating plasma or platelets by apheresis.
          </Text>

          <Text style={[styles.text3, {fontSize: 10.5, marginTop: 7}]}>
            • You will be encouraged to help us in the future by donating red blood cells or by helping the Red Cross as a volunteer.
          </Text>

          <Text style={styles.text3}>
            A positive test result does not affect your health. TRALI is a condition that only affects some blood recipients. It does not affect blood donors.
          </Text>

          <Text style={styles.text3}>
            If you have any questions about this information, please ask the supervisor at your collection site.
          </Text>

          <Text style={styles.text}>
            If you are a regular donor and you have been pregnant in the past, please continue to donate on a regular schedule at this time.
            Not all individuals who have been pregnant develop HLA antibodies, and your help is needed to supply life-giving blood products to the patients who depend on us.
          </Text>
        </View>

        <View>
          <Text style={styles.title}>
            Possible Use of Donor Information and Blood Samples in Medical Research
          </Text>
        </View>

        <View style={styles.contentContainer}>

          <Text style={[styles.text, { fontSize: 10}]}>
            The American Red Cross mission is to provide a safe and effective blood supply. As part of this mission,
            the American Red Cross may conduct research. We conduct some research with other institutions, such as academic centers, government agencies,
            and biomedical companies. Research is an important aspect of our commitment to donor and recipient safety.
          </Text>

        <Text style={styles.subtitle}>How might your blood or information be used in medical research?</Text>
          <Text style={[styles.text, { fontSize: 10}]}>
            We may store and use a portion of your blood or information collected at the time of donation for research studies.
            Some examples of the types of research are studies related to
          </Text>

          <Text style={[styles.text2, {fontSize: 10.5}]}>
            • Testing, storing, collecting, and processing blood.
          </Text>

          <Text style={[styles.text2, {fontSize: 10.5, marginBottom: 30}]}>
            • Ways to recruit blood donors or evaluate donor eligibility or contributions to public health.
          </Text>

          <Text style={styles.text}>
            You will not receive any direct benefit from any research. It is possible that the research may benefit commercial interests.
            Blood components not needed by patients may be provided to institutions for medical or scientific research.
            You will not be notified as to the use of your blood or donor information when it is used for research.
          </Text>

        <Text style={styles.subtitle}>How is your confidentiality protected when your blood or information is used in research?</Text>
          <Text style={[styles.text2, {fontSize: 10.5}]}>
            • Research participation will not involve any cost, time, or additional procedures beyond the normal donation process.
            The risk of the research use of your sample or information is loss of confidentiality. Protections are in place to minimize this risk.
          </Text>

          <Text style={[styles.text2, {fontSize: 10.5, marginBottom: 30}]}>
            • Samples used by researchers are coded. Only authorized Red Cross personnel can link coded samples to a donor’s identifying information.
          </Text>

          <Text style={styles.text}>
            The Red Cross does not share your identifying information with other entities, except as required by law and in limited circumstances
            with research partners who are bound by strict privacy and data protection requirements. An independent committee
            [the Institutional Review Board (IRB)] approves all American Red Cross research using donor samples or information.
            The IRB is government regulated and is established to protect your rights and welfare.
          </Text>

        <Text style={styles.subtitle}>How might your sample be tested and will you be informed of results?</Text>
          <Text style={[styles.text2, {fontSize: 10.5}]}>
            • We may use samples linked to your identifying information for infectious disease testing to provide a safe blood supply.
          </Text>

          <Text style={[styles.text2, {fontSize: 10.5, marginBottom: 30}]}>
            • We will notify you in person, by phone, by letter, or electronically about any test results that are identified to you and that may impact your health,
            and we may invite you to participate in a follow-up study.
          </Text>

        <Text style={styles.subtitle}>What will happen if your sample or information is stored?</Text>
          <Text style={[styles.text2, {fontSize: 10.5}]}>
            • Your donor information, blood, and blood sample may be stored and made available for future research use indefinitely.
          </Text>

          <Text style={[styles.text2, {fontSize: 10.5}]}>
            • Your identified sample and information will not be used for research unrelated to donor safety, blood safety and/or blood product efficacy, 
              and contributions to public health without your consent.
          </Text>

          <Text style={[styles.text2, {fontSize: 10.5, marginBottom: 30}]}>
            • If your sample is stored, only authorized Red Cross personnel can link it to your identifying information.
          </Text>

        <Text style={styles.subtitle}>What are your rights?</Text>
          <Text style={[styles.text2, {fontSize: 10.5}]}>
            • If you decide that you do not want your donation to be used for research, you will not be able to donate today. 
            It is very important to include blood donors and their donations in possible research studies to continue to provide a safe and effective blood supply.
          </Text>

          <Text style={[styles.text2, {fontSize: 10.5}]}>
            • Participation in research is voluntary.
          </Text>

          <Text style={[styles.text2, {fontSize: 10.5}]}>
            • You can discontinue participation at any time up until the start of blood collection. Your decision to not participate will not change your future relationship with the blood center.
          </Text>

          <Text style={[styles.text2, {fontSize: 10.5, marginBottom: 30}]}>
            • If you have any questions about the storage and use of your sample or information or you decide that you do not want your sample or information to be stored for research,
            contact the Scientific Support Office at (866) 771-5534. However, test information collected before your withdrawal may still be used after your withdrawal.
          </Text>

        <Text style={styles.subtitle}>How to obtain more information</Text>
          <Text style={styles.text}>
            If you have questions about your rights as a research participant, or if you need to report potential harm related to research, call the American Red Cross Institutional Review Board administrator at (877) 738-0856.
          </Text>
        </View>

        <View>
        <Text style={styles.title}> Medication Deferral List </Text>
        </View>

        <View style={styles.contentContainer}>

          <Text style={styles.text}>
            DO NOT STOP taking medications prescribed by your doctor in order to donate blood.
          </Text>

          <Text style={styles.text3}>
            Donating while taking these drugs could have a negative effect on your health or on the health of the recipient of your blood.
          </Text>

          <Text style={[styles.text, { textAlign: 'justify', fontSize: 12 }]}>
          Please tell us if you are being treated with{' '}
          <Text style={{ textDecorationLine: 'underline' }}>
            any
          </Text>{' '}
           of the following types of medications:
          </Text>

        </View>

    <View style={[styles.table, {marginBottom: 30}]}>

        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell]}>or have taken...</Text>
          <Text style={[styles.cell, styles.headerCell]}>any time in the last...</Text>
        </View>

        {/* Data Rows */}
      {data.map((item, index) => (

      <View key={index} style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow,]}>
        <View style={styles.cell}>

        <Text style={styles.itemName}>{item.name}</Text>

        {item.alias ? (<Text style={styles.itemAlias}> which is also called {item.alias}</Text>)
        : item.name === "Heparin, low molecular weight heparin" ? null : (<Text style={styles.itemAlias}></Text>)}
        </View>

        <Text style={styles.cell}>{item.time}</Text>
      </View>
        ))}

    </View>

    <View>
      <Text style={[styles.title, {fontSize: 16,}]}> HIV Prevention ( also known as PrEP and PEP) </Text>
    </View>

    <View style={[styles.table, {marginBottom: 30}]}>

        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell]}>or have taken...</Text>
          <Text style={[styles.cell, styles.headerCell]}>any time in the last...</Text>
        </View>

        {/* HIV Data Rows */}
      {HIVdata.map((item, index) => (
      <View key={index} style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>

        <View style={styles.cell}>

          <Text style={styles.itemName}>{item.name} </Text>

        {item.alias ? (
          <Text style={styles.itemAlias}>which is also called {item.alias}</Text>
          ) : (
          item.name === "Any medication to treat HIV. May also be called antiretroviral therapy (ART)" ||
          item.name === "Experimental Medication" ? null : ( <Text style={styles.itemAlias}> </Text> )
          )}

        </View>

      <Text style={styles.cell}>{item.time}</Text>

      </View>
        ))}
        
    </View>

        <Text style={[styles.text3, { fontSize: 11.5}]}>
          DO NOT STOP TAKING ANY PRESCRIBED MEDICATIONS IN ORDER TO DONATE BLOOD, INCLUDING PrEP and PEP MEDICATIONS
        </Text>

        <Text style={[styles.text, {fontSize: 13}]}>
          <Text style={{ fontWeight: "bold" }}>Anti-platelet agents affect platelet function</Text>, so people taking these drugs should not donate platelets
          for the indicated time. You may still be able to donate whole blood or red blood cells by apheresis.
        </Text>

        <Text style={[styles.text, {fontSize: 13}]}>
          <Text style={{ fontWeight: "bold" }}>Anticoagulants or "blood thinners"</Text> are used to treat or prevent blood clots in the legs, lungs,
          or other parts of the body, and to prevent strokes. These medications affect the blood’s ability to clot, which might cause excessive bruising
          or bleeding when you donate; You may still be able to donate whole blood or red blood cells by apheresis.
        </Text>

        <Text style={[styles.text, {fontSize: 13}]}>
          <Text style={{ fontWeight: "bold" }}>Isotretinoin, finasteride, dutasteride acitretin and etretinate</Text> can cause birth defects. Your donated blood
          could contain high enough levels to damage the unborn baby if transfused to a pregnant woman.
        </Text>

        <Text style={[styles.text, {fontSize: 13}]}>
          <Text style={{ fontWeight: "bold" }}>Thalomid (thalidomide), Revlimid (lenalidomide) Erivedge (Vismodegib), Odomzo (sonidegib), Aubagio (teriflunomide), and Rinvoq (upadacitinib)</Text> may cause
          birth defects or the death of an unborn baby if transfused to a pregnant woman.
        </Text>

        <Text style={[styles.text, {fontSize: 13}]}>
          <Text style={{ fontWeight: "bold" }}>Cellcept (mycophenolate mofetil) and Arava (leflunomide)</Text> are immunosuppressants that may cause birth defects or the death of an unborn
          baby if transfused to a pregnant woman.
        </Text>

        <Text style={[styles.text, {fontSize: 13}]}>
          <Text style={{ fontWeight: "bold" }}>PrEP or pre-exposure prophylaxis</Text> involves taking a specific combination of oral medicines (short-acting antiviral PrEP) or injections
          (long-acting antiviral PrEP) as a prevention method for people who are HIV negative and at high risk of HIV infection. FDA has determined that the available data
          demonstrate that the use of PrEP or PEP may delay the detection of HIV by currently licensed screening tests for blood donations, potentially resulting in false negative results
          in infected individuals. Although “Undetectable = Untransmittable” for sexual transmission, this does not apply to transfusion transmission.
        </Text>

        <Text style={[styles.text, {fontSize: 13}]}>
          <Text style={{ fontWeight: "bold" }}>PEP or post-exposure prophylaxis</Text> is a short-acting treatment started as soon as possible after a high-risk exposure
          to HIV to reduce the risk of infection. FDA has determined that the available data demonstrate that the use of PrEP or PEP may delay the detection of HIV by currently licensed
          screening tests for blood donations, potentially resulting in false negative results in infected individuals. Although “Undetectable = Untransmittable” for sexual transmission,
          this does not apply to transfusion transmission.
        </Text>

        <Text style={[styles.text, {fontSize: 13}]}>
          <Text style={{ fontWeight: "bold" }}>ART or antiretroviral therapy</Text> is the use of a combination of HIV medicines (called an HIV regimen) to treat HIV infection.
          HIV infection requires a permanent deferral despite treatment with ART. Antiretroviral drugs do not fully eliminate the virus from the body, and donated blood from individuals
          infected with HIV taking ART can potentially still transmit HIV to a transfusion recipient. Although “Undetectable = Untransmittable” for sexual transmission,
          this does not apply to transfusion transmission.
        </Text>

        <Text style={[styles.text, {fontSize: 13}]}>
          <Text style={{ fontWeight: "bold" }}>Hepatitis B Immune Globulin (HBIG)</Text> is an injected material used to prevent hepatitis B infection
          following a possible or known exposure to hepatitis B. HBIG does not prevent hepatitis B infection in every case, therefore, persons who have
          received HBIG must wait to donate blood.
        </Text>

        <Text style={[styles.text, {fontSize: 13}]}>
          <Text style={{ fontWeight: "bold" }}>Experimental Medications</Text> are usually associated with a research study,
          and the effect on their safety of transfused blood is unknown.
        </Text>

      
      <View>
        <Text style={styles.title}>
        Important Information Regarding a Hepatitis A Outbreak
        </Text>
      </View>

        <Text style={styles.subtitle}>
        Thank you for coming in to donate today.
        </Text>

        <Text style={styles.text3}>
        If you have been exposed to hepatitis A or advised
        to be vaccinated for hepatitis A because of an
        exposure at a restaurant or other food establishment,
        please do not donate today and refrain from donating for 4 months.
        </Text>

        <Text style={[styles.text3, { fontSize: 10}]}>
          DO NOT DONATE TODAY.
        </Text>

          <Text style={[styles.text2, {fontSize: 10.5}]}>
            • We regard you as having been exposed to a hepatitis A outbreak.
          </Text>

          <Text style={[styles.text2, {fontSize: 10.5, marginBottom: 30}]}>
            • Please wait for four months after you ate or drank at this location before coming again to donate.
          </Text>

        <Text style={styles.text}>
         For more information about a Hepatitis A outbreak and any precautions you need to take, please contact your local health department.
        </Text>

      <View>
        <Text style={[styles.title, {fontSize: 42}]}>
        Fact Sheet: Check Your Race
        </Text>
      </View>

        <Text style={[styles.text, {fontSize: 10}]}>
          <Text style={{ fontWeight: "bold" }}>Check your race during your health history today</Text> – and know you
          could be helping individuals with sickle cell disease and rare blood types.
        </Text>

      <Text style={styles.title}>
      Blood types can be specific to race.
      </Text>

        <Text style={styles.text}>
        Red blood cells carry markers called antigens on their surface that determine one’s blood type. Most are one of the
        following categories: A, B, AB, and O. There are more than 600 known antigens, and some are unique to specific racial and ethnic groups.
        For example, many African Americans and people of African descent have rare blood types, such as types U negative and Duffy negative.
        Patients who have rare blood types or receive frequent blood transfusions need close blood type matches.
        </Text>

        <Text style={styles.text}>
        The Red Cross asks all donors to provide their race during the health history process.
        Selecting your race will notify our laboratories to conduct extra screening. The laboratories screen
        to determine if your blood donations can help people with sickle cell disease or rare blood types.
        The most compatible blood for patients with sickle cell disease or those with rare blood types
        often comes from donors of the same race or similar ethnicity.
        </Text>

      <Text style={styles.title}>
      Increasing the number of blood donors from all racial and ethnic groups is vital.
      </Text>

        <Text style={styles.text}>
        Blood that is closely matched between donor and patient can lower the risk of patients developing complications. This is especially important for those
        receiving ongoing blood transfusions. If a patient receives a transfusion that isn’t an exact match to their blood type, they develop antibodies to the foreign antigens.
        If the patient receives another transfusion in the future with the same mismatch, it can be fatal. It is vital that our blood supply reflects the diversity of our population to best meet the needs of all.
        Blood donations are constantly needed to help people with complicated childbirths, those battling cancer, people with chronic health conditions such as sickle cell disease,
        those with traumatic injuries from accidents, and many more.
        </Text>

      <View>
        <Text style={[styles.title, {fontSize: 20}]}>
        You can help the Red Cross provide the most compatible blood to help meet the needs of patients from all backgrounds.
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


  table: {
    margin: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerRow: {
    backgroundColor: "#f0f0f0",
  },
  evenRow: {
    backgroundColor: "#fff",
  },
  oddRow: {
    backgroundColor: "#f9f9f9",
  },
  cell: {
    flex: 1,
    padding: 8,
    textAlign: "center",
    justifyContent: "center",
  },
  headerCell: {
    fontWeight: "bold",
  },
  itemName: {
    fontWeight: "bold",
    textAlign: "center",
  },
  itemAlias: {
    fontStyle: "italic",
    textAlign: "center",
    color: "#555",
  },

});
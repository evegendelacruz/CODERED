import { View, Text, Image } from 'react-native'
import { Button } from 'react-native-paper'
import {} from 'react-native-safe-area-context'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  const banner = require('../../../assets/dashboardheader.png');
  const testlogo = require('../../../assets/testlogo.png');
  const nopost = require('../../../assets/nopost.png');
  return (
    <SafeAreaView>
        <View>
          <Image source={banner} style={{height: 200, width: 360, zIndex: -1}}/>
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
                    alignSelf: 'center',
                    marginTop: -60
                  }}
                >
                  REQUEST BLOOD DONATION
                </Button>

                <View style={{borderColor: '#918F8F', width: 330, height: 200, marginTop: 30, borderWidth: 0.5, justifyContent:'center', alignSelf:'center', backgroundColor:'white', marginVertical: 10}}>
                <Image source={testlogo} style={{height: 50, width: 270, alignSelf:'center', marginVertical:10}}/>
                  <Text style={{textAlign: 'center', fontFamily: 'Poppins', marginHorizontal: 40}}>Check if you're eligible to donate blood with RapidPass®.</Text>
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
                      alignSelf: 'center',
                      marginVertical: 10
                    }}
                  >
                    START
                  </Button>
                </View>
        </View>
        <View style={{borderColor: '#918F8F', borderColor:'#918F8F', borderWidth: 0.5, width: 330, height: 180, marginTop: 5, justifyContent:'center', alignSelf:'center', backgroundColor:'white'}}>
                    <Image source={nopost} style={{height: 100, width: 100, alignSelf:'center', marginVertical:10}}/>
                    <Text style={{textAlign: 'center', fontFamily: 'Poppins', marginTop: -5, color:'gray'}}>No blood requests at the moment...</Text>
        </View>
    </SafeAreaView>
  )
}

export default Home
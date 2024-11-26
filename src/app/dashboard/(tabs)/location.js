import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React from 'react';
import { Searchbar } from 'react-native-paper';
import { Octicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Location = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState('map');
  const mapview = require("../../../assets/mapview.png");
  const redcross = require("../../../assets/redcross.png");
  const nmmc = require("../../../assets/nmmc.png");
  const cityhospital = require("../../../assets/cityhospital.png");
  const mariareyna = require("../../../assets/mariareyna.png");
  const maddona = require("../../../assets/maddona.png");

  const onSearchChange = (query) => {
    setSearchQuery(query);
    // Additional logic for search
  };

  const handleViewChange = (mode) => {
    setViewMode(mode); // Change view mode to either 'map' or 'list'
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
     
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'height' : 'padding'}>
        
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ backgroundColor: '#fe0009', height: '11%' }}>
            <Searchbar
              placeholder="SEARCH BLOOD HUBS NEARBY"
              onChangeText={onSearchChange}
              value={searchQuery}
              style={{
                borderRadius: 10,
                backgroundColor: '#fff',
                color: 'black',
                width: '90%',
                height: 50,
                alignSelf: 'center',
              }}
              placeholderTextColor="red"
              inputStyle={{
                fontFamily: 'Poppins',
                fontSize: 14,
                justifyContent: 'center',
              }}
              iconColor="red"
            />
          </View>

          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: 'red', alignItems: 'center', paddingBottom: 0, marginTop: -10 }}>
              <TouchableOpacity
                onPress={() => handleViewChange('map')}
                style={{
                  padding: 10,
                  borderRadius: 5,
                  marginHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontFamily: viewMode === 'map' ? 'PoppinsBold' : 'Poppins',
                  }}
                >
                  MAP VIEW
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  width: 1,
                  height: '50%',
                  backgroundColor: 'white',
                  textAlign: 'center',
                  alignItems: 'center',
                }}
              />

              <TouchableOpacity
                onPress={() => handleViewChange('list')}
                style={{
                  padding: 10,
                  borderRadius: 5,
                  marginHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontFamily: viewMode === 'list' ? 'PoppinsBold' : 'Poppins',
                  }}
                >
                  LIST VIEW
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Conditional Rendering Based on View Mode */}
          <View style={{ flex: 1, marginTop: 20 }}>
            {viewMode === 'map' ? (
              <Image source={mapview} style={{ height: 480, width: 360, marginTop: -20, alignSelf: 'center' }} />
            ) : (
              <View>
                <View>
                  <Image source={redcross} style={{ borderColor: '#918F8F', width: '100%', height: 200, marginTop: -20, borderWidth: 0.5, justifyContent: 'center', alignSelf: 'center', backgroundColor: 'white', marginVertical: 15 }} />
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      borderRadius: 5,
                      width: 350,
                      alignSelf: "center",
                      marginTop: -80,
                      backgroundColor: "white",
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Octicons
                      name="location"
                      size={20}
                      color="#fe0009"
                      style={{ marginRight: 10 }}
                    />
                    <View style={{ flexShrink: 1 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins",
                          color: "red",
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        Philippine Red Cross, Misamis Oriental-Cagayan de Oro Chapter
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "Poppins",
                          color: "gray",
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        Philippine Red Cross Building, Capitol Compound, Cagayan de Oro, Misamis Oriental
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View>
                  <Image source={nmmc} style={{ borderColor: '#918F8F', width: '100%', marginTop: 25, height: 200, marginBottom: 30, borderWidth: 0.5, justifyContent: 'center', alignSelf: 'center', backgroundColor: 'white' }} />
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      borderRadius: 5,
                      width: 350,
                      alignSelf: "center",
                      marginTop: -100,
                      backgroundColor: "white",
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Octicons
                      name="location"
                      size={20}
                      color="#fe0009"
                      style={{ marginRight: 10 }}
                    />
                    <View style={{ flexShrink: 1 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins",
                          color: "red",
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        Northern Mindanao Medical Center
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "Poppins",
                          color: "gray",
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        FJPX+9Q4, Capitol Rd, Cagayan de Oro, 9000 Misamis Oriental
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View>
                  <Image source={cityhospital} style={{ borderColor: '#918F8F', width: '100%', height: 200, marginVertical: 25, borderWidth: 0.5, justifyContent: 'center', alignSelf: 'center', backgroundColor: 'white' }} />
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      borderRadius: 5,
                      width: 350,
                      alignSelf: "center",
                      marginTop: -100,
                      backgroundColor: "white",
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Octicons
                      name="location"
                      size={20}
                      color="#fe0009"
                      style={{ marginRight: 10 }}
                    />
                    <View style={{ flexShrink: 1 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins",
                          color: "red",
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        J.R. Borja General Hospital
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "Poppins",
                          color: "gray",
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        FJJH+Q2, J. Seriña St, Cagayan de Oro, 9000 Misamis Oriental
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{marginTop:40}}></View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Location;

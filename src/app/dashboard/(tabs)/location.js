import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Image, Linking, SafeAreaView } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Octicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const Location = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('map');
  const [selectedHospital, setSelectedHospital] = useState(null);

  const hospitals = [
    {
      name: "Philippine Red Cross",
      address: "Philippine Red Cross Building, Capitol Compound, Cagayan de Oro, Misamis Oriental",
      image: require("../../../assets/redcross.png"),
    },
    {
      name: "Northern Mindanao Medical Center",
      address: "FJPX+9Q4, Capitol Rd, Cagayan de Oro, 9000 Misamis Oriental",
      image: require("../../../assets/nmmc.png"),
    },
    {
      name: "J.R. Borja General Hospital",
      address: "FJJH+Q2, J. Seriña St, Cagayan de Oro, 9000 Misamis Oriental",
      image: require("../../../assets/cityhospital.png"),
    },
    {
      name: "Maria Reyna - Xavier University Hospital",
      address: "FMG3+6XV, Hayes St, Cagayan de Oro, 9000 Misamis Oriental",
      image: require("./../../../../src/assets/mariareyna.png"),
    },
    {
      name: "Madonna & Child Hospital",
      address: "FJHP+34W, J. Seriña St, Cagayan de Oro, 9000 Misamis Oriental",
      image: require("../../../../src/assets/maddona.png"),
    },
  ];

  const handleViewChange = (mode) => {
    setViewMode(mode); // Change view mode to either 'map' or 'list'
  };

  // Function to open Google Maps with a search query
  const openMapWithQuery = (query) => {
    const url = `https://www.google.com/maps?q=${query}`;
    Linking.openURL(url).catch((err) => console.error("Error opening map: ", err));
  };

  // Function to open the map with a predefined location when the search bar is clicked
  const openMap = () => {
    const query = "Cagayan de Oro";  // Set a default location (e.g., Cagayan de Oro city)
    const url = `https://www.google.com/maps?q=${query}`;
    Linking.openURL(url).catch((err) => console.error("Error opening map: ", err));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'height' : 'padding'}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
          {/* Search Bar Section */}
          <View style={{ backgroundColor: '#fe0009', height: 60 }}>
            {/* Make the Searchbar clickable */}
            <TouchableOpacity onPress={openMap} style={{ width: '90%', alignSelf: 'center' }}>
              <Searchbar
                placeholder="SEARCH BLOOD HUBS NEARBY"
                value="SEARCH BLOOD HUBS NEARBY"  // Placeholder text when clicked
                editable={false}  // Disable typing
                style={{
                  borderRadius: 10,
                  backgroundColor: '#fff',
                  color: 'black',
                  height: 50,
                }}
                placeholderTextColor="red"
                inputStyle={{
                  fontFamily: 'Poppins',
                  fontSize: 14,
                  justifyContent: 'center',
                }}
                iconColor="red"
              />
            </TouchableOpacity>
          </View>

          {/* View Mode Toggle Section */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: 'red', alignItems: 'center', paddingBottom: 0 }}>
            <TouchableOpacity onPress={() => handleViewChange('map')} style={{ padding: 10, borderRadius: 5, marginHorizontal: 20 }}>
              <Text style={{ color: 'white' }}>MAP VIEW</Text>
            </TouchableOpacity>

            <View style={{ width: 1, height: '50%', backgroundColor: 'white', textAlign: 'center', alignItems: 'center' }} />

            <TouchableOpacity onPress={() => handleViewChange('list')} style={{ padding: 10, borderRadius: 5, marginHorizontal: 20 }}>
              <Text style={{ color: 'white' }}>LIST VIEW</Text>
            </TouchableOpacity>
          </View>

          {/* Conditional Rendering Based on View Mode */}
          <View style={{ flex: 1, marginTop: 10 }}>
            {viewMode === 'map' ? (
              <MapView
                style={{ height: 480, width: '100%' }}
                initialRegion={{
                  latitude: 8.4333, // Default starting point
                  longitude: 124.6511,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                {selectedHospital && (
                  <Marker
                    coordinate={{
                      latitude: selectedHospital.latitude,
                      longitude: selectedHospital.longitude,
                    }}
                    title={selectedHospital.name}
                    description={selectedHospital.address}
                  />
                )}
              </MapView>
            ) : (
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {hospitals.map((hospital, index) => (
                  <View key={index} style={{ marginBottom: 15 }}>
                    <Image
                      source={hospital.image}
                      style={{
                        borderColor: '#918F8F',
                        width: '100%',
                        height: 200,
                        marginTop: 15,
                        borderWidth: 0.5,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        backgroundColor: 'white',
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        borderRadius: 5,
                        width: '100%',
                        backgroundColor: "white",
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        marginTop: 10, // Adjusted for better spacing
                      }}
                      onPress={() => openMapWithQuery(hospital.address)} // Open map with hospital address
                    >
                      <Octicons name="location" size={20} color="#fe0009" style={{ marginRight: 10 }} />
                      <View style={{ flexShrink: 1 }}>
                        <Text style={{ fontSize: 12, fontFamily: "Poppins", color: "red" }} numberOfLines={1} ellipsizeMode="tail">
                          {hospital.name}
                        </Text>
                        <Text style={{ fontSize: 10, fontFamily: "Poppins", color: "gray" }} numberOfLines={1} ellipsizeMode="tail">
                          {hospital.address}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Location;
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  Linking,
  Platform,
  Image,
} from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "./../../../../src/utils/supabase"; // Import the Supabase client
import Toast from "react-native-toast-message"; // Import Toast

const { width } = Dimensions.get("window");

// Wrap your TextInput component with forwardRef
const TextInput = React.forwardRef((props, ref) => {
  return (
    <PaperTextInput
      ref={ref}
      {...props} // Spread the rest of the props (like value, onChangeText, etc.)
    />
  );
});

const Event = () => {
  const noevent = require("../../../assets/nopost.png");
  const [schedule, setSchedule] = useState("");
  const [tagline, setTagline] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [partners, setPartners] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [isOrganization, setIsOrganization] = useState(false); // State to track if user is part of an organization
  const navigation = useNavigation();

  // Helper function to format dates
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
  
      if (error) {
        console.error("Error fetching events:", error);
        return;
      }
  
      const validEvents = data.filter((event) => {
        const isValidDate = !isNaN(Date.parse(event.date));
        if (!isValidDate) {
          console.warn(`Invalid event date: ${event.date}`);
        }
        return isValidDate;
      });
  
      // Fetch organization details for each event based on org_id
      const eventsWithProfiles = await Promise.all(
        validEvents.map(async (event) => {
          if (event.org_id) {
            const { data: orgData, error: orgError } = await supabase
              .from("organization")
              .select("org_name, auth_id")
              .eq("org_id", event.org_id) // Match org_id with organization table
              .single();

            if (orgError) {
              console.error(`Error fetching organization for org_id ${event.org_id}:`, orgError);
              return { ...event, org_name: "Unknown Organization", profileImage: null };
            }

            // Construct profile image path
            const filePath = `user_profile/${orgData.auth_id}.jpg`;
            const { data: profilePicData, error: picError } = await supabase.storage
              .from("uploads")
              .getPublicUrl(filePath);

            return {
              ...event,
              org_name: orgData.org_name,
              profileImage: profilePicData
                ? `${profilePicData.publicUrl}?t=${Date.now()}` // Append timestamp to avoid caching issues
                : null,
            };
          } else {
            return event; // Return event with no organization profile
          }
        })
      );

      setEvents(eventsWithProfiles);

      const eventDates = {};
      eventsWithProfiles.forEach((event) => {
        const formattedDate = event.date.split("T")[0]; // Ensure date is in 'YYYY-MM-DD' format
        eventDates[formattedDate] = {
          selected: true,
          selectedColor: "red",
          selectedTextColor: "white",
        };
      });

      setMarkedDates(eventDates);
    };
  
    fetchEvents();
  }, []);
  
  // Check if user is part of the organization when login state changes
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(); // Get the current user

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      // If user is logged in, check if they belong to an organization
      if (user) {
        const fetchUserRole = async () => {
          const { data, error } = await supabase
            .from("organization") // Query from 'organization' table
            .select("*")
            .eq("org_email", user.email) // Match user's email with the org_email
            .single();

          if (error || !data) {
            setIsOrganization(false); // Not part of an organization
          } else {
            setIsOrganization(true); // User is part of an organization
          }
        };

        fetchUserRole();
      }
    };

    fetchUser();
  }, []); // Empty dependency array ensures this runs only on mount

  // State for storing organization data (name and profile image)
  const [userProfile, setUserProfile] = useState({
    name: "",
    profileImage: null,
  });

  const fetchOrganizationProfile = async (eventOrgId) => {
    try {
      // Step 1: Fetch the organization data based on org_id
      const { data: orgData, error: orgError } = await supabase
        .from("organization")
        .select("org_name, auth_id") 
        .eq("org_id", eventOrgId)   
        .single();

      if (orgError || !orgData) {
        console.error("Error fetching organization:", orgError?.message || "Organization not found");
        return null;
      }

      // Step 2: Fetch the profile image using the organization's auth_id
      const filePath = `user_profile/${orgData.auth_id}.jpg`; // Use auth_id to construct path
      const { data: profilePicData, error: picError } = await supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      if (picError) {
        console.warn(`Error fetching profile image for org_id ${eventOrgId}:`, picError);
      }

      // Step 3: Return the organization name and profile image
      return {
        name: orgData.org_name,
        profileImage: profilePicData
          ? `${profilePicData.publicUrl}?t=${Date.now()}` // Prevent cache issues
          : null,
      };
    } catch (error) {
      console.error("Error fetching organization profile:", error.message);
      return null;
    }
  };

  const fetchUserProfile = async () => {
    try {
      // Step 1: Fetch all events
      const { data: events, error: eventError } = await supabase
        .from("events")
        .select("*"); // Select all fields to ensure we get org_id and other details

      if (eventError || !events) {
        console.error("Error fetching events:", eventError);
        return;
      }

      // Step 2: Fetch profiles for each event's org_id
      const eventsWithProfiles = await Promise.all(
        events.map(async (event) => {
          if (event.org_id) {
            const profile = await fetchOrganizationProfile(event.org_id); // Fetch for each org_id
            if (profile) {
              return { ...event, ...profile }; // Combine event data with organization profile
            } else {
              return event; // Return event with no organization profile
            }
          } else {
            return event; // Return event with no organization profile
          }
        })
      );

      setUserProfile(eventsWithProfiles[0] || {}); // Assuming we only need the first event's profile for display

    } catch (error) {
      console.error("Error fetching user profiles:", error.message);
    }
  };

  // Fetch user profile and organization profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);


  const handleAddEvent = async () => {
    if (!selectedDate || !schedule) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "Please select a date and enter an event!",
      });
      return;
    }

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error fetching user:", userError);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "Error fetching user data.",
      });
      return;
    }

    // Fetch the org_id based on the authenticated user's id
    const { data: orgData, error: orgError } = await supabase
      .from("organization")
      .select("org_id")
      .eq("auth_id", user.id)
      .single();

    if (orgError || !orgData) {
      console.error("Error fetching organization:", orgError);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "You are not associated with any organization.",
      });
      return;
    }

    // Ensure that org_id is not null or undefined
    if (!orgData.org_id) {
      console.error("Organization ID is missing.");
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "Organization ID is missing.",
      });
      return;
    }

    // Create the new event with org_id
    const newEvent = {
      title: schedule,
      tagline,
      time,
      venue,
      partners,
      date: selectedDate,
      location,
      org_id: orgData.org_id,  // Add the org_id to the event data
    };

    // Insert the event into the "events" table
    const { data, error } = await supabase.from("events").insert([newEvent]);

    if (error) {
      console.error("Error saving event:", error);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "Error saving event.",
      });
      return;
    }

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setMarkedDates((prevMarkedDates) => ({
      ...prevMarkedDates,
      [selectedDate]: {
        selected: true,
        selectedColor: "red",
        selectedTextColor: "white",
      },
    }));

    // Reset form fields
    setSchedule("");
    setTagline("");
    setTime("");
    setVenue("");
    setPartners("");
    setLocation("");
    setModalVisible(false);

    // Navigate to notif screen with flag to show toast
    navigation.navigate("notif", { newEvent, showToast: true });
  };

  const handleToggleExpand = (index) => {
    setExpandedEvent(expandedEvent === index ? null : index);
  };

  const handleLocationPress = (address) => {
    const encodedAddress = encodeURIComponent(address);

    const url =
      Platform.OS === "ios"
        ? `maps:0,0?q=${encodedAddress}` // iOS Google Maps scheme
        : `geo:0,0?q=${encodedAddress}`; // Android Google Maps scheme

    Linking.openURL(url).catch((err) => {
      console.error("Failed to open Google Maps:", err);

      const fallbackUrl = `https://www.google.com/maps/search/?q=${encodedAddress}`;
      Linking.openURL(fallbackUrl).catch((err) =>
        console.error("Fallback failed:", err)
      );
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}>BLOOD DRIVE CALENDAR</Text>

        <Calendar
          current={selectedDate}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              selected: true,
              selectedColor: "red",
              selectedTextColor: "white",
            },
          }}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
          theme={{
            textDayFontFamily: "Poppins",
            textMonthFontFamily: "Poppins",
            textDayHeaderFontFamily: "Poppins",
          }}
        />

        <View style={styles.eventsContainer}>
          <Text style={styles.subtitle}>EVENTS</Text>

          <ScrollView style={styles.eventsList}>
            {events.length > 0 ? (
              events.map((event, index) => (
                <View key={index} style={styles.eventItem}>
                  {event.org_id && (
                    <View style={styles.userInfoContainer}>
                      {event.profileImage && (
                        <Image
                          source={{ uri: event.profileImage }}
                          style={styles.profilePic}
                        />
                      )}
                      <Text style={styles.userName} numberOfLines={2}>
                        {event.org_name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleToggleExpand(index)}
                        style={styles.chevronContainer}
                      >
                        <Ionicons
                          name={expandedEvent === index ? "chevron-up" : "chevron-down"}
                          size={24}
                          color="red"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  <View style={styles.eventContents}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                    </View>
                    <Text style={styles.eventDate}>
                      {formatDate(event.date)}
                    </Text>
                    {expandedEvent === index && (
                      <View style={styles.eventDetails}>
                        <Text style={styles.eventDescription}>
                          Tagline: {event.tagline}
                        </Text>
                        <Text style={styles.eventDescription}>
                          Time: {event.time}
                        </Text>
                        <Text style={styles.eventDescription}>
                          Venue: {event.venue}
                        </Text>
                        <Text style={styles.eventDescription}>
                          Partners: {event.partners}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleLocationPress(event.location)}
                        >
                          <Text style={styles.eventLocation}>
                            Location: {event.location}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noEventsContainer}>
                <Image
                  source={noevent}
                  style={[
                    styles.icon,
                    { width: 100, height: 100, marginTop: 0 },
                  ]}
                />
                <Text style={{ fontFamily: "Poppins" }}>No events yet...</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {isOrganization && (
            <View style={styles.addButton}>
              <Text style={styles.addButtonText}>ADD EVENT</Text>
            </View>
          )}
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <ScrollView contentContainerStyle={styles.modalScrollViewContainer}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>ADD UPCOMING EVENTS</Text>
              <TextInput
                label={
                  <Text
                    style={{
                      color: "gray",
                      fontFamily: "Poppins",
                      fontSize: 14,
                    }}
                  >
                    Event Title
                  </Text>
                }
                value={schedule}
                mode="outlined"
                activeOutlineColor="red"
                outlineColor="red"
                textColor="black"
                onChangeText={setSchedule}
                style={styles.input}
              />
              <TextInput
                label={
                  <Text
                    style={{
                      color: "gray",
                      fontFamily: "Poppins",
                      fontSize: 14,
                    }}
                  >
                    Tagline
                  </Text>
                }
                value={tagline}
                mode="outlined"
                activeOutlineColor="red"
                outlineColor="red"
                textColor="black"
                onChangeText={setTagline}
                style={styles.input}
              />
              <TextInput
                label={
                  <Text
                    style={{
                      color: "gray",
                      fontFamily: "Poppins",
                      fontSize: 14,
                    }}
                  >
                    Time
                  </Text>
                }
                value={time}
                mode="outlined"
                activeOutlineColor="red"
                outlineColor="red"
                textColor="black"
                onChangeText={setTime}
                style={styles.input}
              />
              <TextInput
                label={
                  <Text
                    style={{
                      color: "gray",
                      fontFamily: "Poppins",
                      fontSize: 14,
                    }}
                  >
                    Venue
                  </Text>
                }
                value={venue}
                mode="outlined"
                activeOutlineColor="red"
                outlineColor="red"
                textColor="black"
                onChangeText={setVenue}
                style={styles.input}
              />
              <TextInput
                label={
                  <Text
                    style={{
                      color: "gray",
                      fontFamily: "Poppins",
                      fontSize: 14,
                    }}
                  >
                    Partners
                  </Text>
                }
                value={partners}
                mode="outlined"
                activeOutlineColor="red"
                outlineColor="red"
                textColor="black"
                onChangeText={setPartners}
                style={styles.input}
              />
              <TextInput
                label={
                  <Text
                    style={{
                      color: "gray",
                      fontFamily: "Poppins",
                      fontSize: 14,
                    }}
                  >
                    Location
                  </Text>
                }
                value={location}
                mode="outlined"
                activeOutlineColor="red"
                outlineColor="red"
                textColor="black"
                onChangeText={setLocation}
                style={styles.input}
              />
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={[styles.buttonStyle, { backgroundColor: "red" }]}
                  onPress={handleAddEvent}
                >
                  <Text style={styles.buttonTextStyle}>ADD EVENT</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.buttonStyle, { backgroundColor: "grey" }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonTextStyle}>CANCEL</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </ScrollView>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 20, backgroundColor: "#f4f4f4" },
  headerText: {
    fontFamily: "PoppinsBold",
    fontSize: 18,
    textAlign: "center",
    color: "red",
    marginVertical: 10,
  },
  eventsContainer: {
    marginVertical: 10,
    backgroundColor: "white",
    width: "95%",
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 19,
    color: "red",
    fontFamily: "PoppinsBold",
    paddingVertical: 10,
    textAlign: "left",
  },
  eventItem: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  eventTitle: {
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  eventDate: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#333",
  },
  chevronContainer: {
    marginLeft: 0,
  },
  eventDetails: {
    marginTop: 8,
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: "Poppins",
  },
  eventLocation: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "red",
  },
  noEventsContainer: {
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "red",
    borderRadius: 5,
    paddingVertical: 12,
    marginVertical: 5,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 30,
    marginVertical: 40,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 18,
    color: "red",
    fontFamily: "PoppinsBold",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    marginVertical: 8,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonStyle: {
    paddingVertical: 12,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  buttonTextStyle: {
    color: "white",
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderColor: "gray",
    borderWidth: 0.3,
  },
  userInfoContainer: {
    flexDirection: "row",
  },
  userName: {
    fontFamily: "PoppinsBold",
    textAlign: "left",
    width: "75%",
    fontSize: 13,
  },
  eventContents: {
    flexDirection: "column",
  },
});

export default Event;

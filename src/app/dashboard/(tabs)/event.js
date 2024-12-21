import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { TextInput } from "react-native-paper";
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications'; // Import Notifications
import { supabase } from './../../../../src/utils/supabase'; // Import the Supabase client

const { width } = Dimensions.get('window');

const Event = () => {
  const [schedule, setSchedule] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const navigation = useNavigation();

  // Set up notification handler
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }, []);

  // Request notification permissions
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Notification permission not granted');
        alert('Please enable notifications for this app in your device settings.');
      } else {
        console.log('Notification permission granted');
      }
    };
    requestPermissions();
  }, []);

  // Fetch events from Supabase when the component loads
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        return;
      }

      const validEvents = data.filter((event) => {
        const isValidDate = !isNaN(Date.parse(event.date));
        if (!isValidDate) {
          console.warn(`Invalid event date: ${event.date}`);
        }
        return isValidDate;
      });

      setEvents(validEvents);

      const eventDates = {};
      validEvents.forEach((event) => {
        const formattedDate = event.date.split('T')[0]; // Ensure date is in 'YYYY-MM-DD' format
        eventDates[formattedDate] = { selected: true, selectedColor: 'red', selectedTextColor: '' };
      });

      setMarkedDates(eventDates);
    };

    fetchEvents();
  }, []);

  // Test immediate notification
  useEffect(() => {
    const testImmediateNotification = async () => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Immediate Test Notification",
          body: "This is a test notification.",
        },
        trigger: null, // Trigger immediately
      });
    };

    // Uncomment to test immediate notification
    // testImmediateNotification();
  }, []);

  // Schedule a notification
  const scheduleNotification = async (event) => {
    const eventDate = new Date(event.date);
    const currentTime = new Date().getTime();
    const notificationTime = eventDate.getTime() - currentTime;

    if (notificationTime > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Event Reminder!",
          body: `Don't forget your event: ${event.title}`,
        },
        trigger: { seconds: notificationTime / 1000 },
      });
      console.log("Notification scheduled for:", eventDate);
    } else {
      console.warn('Event date is in the past or invalid:', eventDate);
    }
  };

  const handleAddEvent = async () => {
    if (!selectedDate || !schedule) {
      alert('Please select a date and enter an event!');
      return;
    }

    const newEvent = { 
      title: schedule, 
      date: selectedDate, 
      description, 
      location 
    };

    const { data, error } = await supabase
      .from('events')
      .insert([newEvent]);

    if (error) {
      console.error('Error saving event:', error);
      alert('Error saving event.');
      return;
    }

    console.log('Event saved:', data);

    setEvents((prevEvents) => [...prevEvents, newEvent]);

    // Update marked dates to include the new event date
    setMarkedDates((prevMarkedDates) => ({
      ...prevMarkedDates,
      [selectedDate]: { selected: true, selectedColor: 'red', selectedTextColor: 'white' },
    }));

    setSchedule('');
    setDescription('');
    setLocation('');
    setModalVisible(false);

    // Schedule a notification for the new event
    await scheduleNotification(newEvent);

    navigation.navigate('notif', { newEvent });
  };

  const handleToggleExpand = (index) => {
    setExpandedEvent(expandedEvent === index ? null : index);
  };

  const handleLocationPress = (address) => {
    const encodedAddress = encodeURIComponent(address);

    const url = Platform.OS === 'ios'
      ? `maps:0,0?q=${encodedAddress}` // iOS Google Maps scheme
      : `geo:0,0?q=${encodedAddress}`; // Android Google Maps scheme

    Linking.openURL(url)
      .catch((err) => {
        console.error("Failed to open Google Maps:", err);

        const fallbackUrl = `https://www.google.com/maps/search/?q=${encodedAddress}`;
        Linking.openURL(fallbackUrl).catch((err) => console.error("Fallback failed:", err));
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
              selectedColor: 'red',
              selectedTextColor: 'white'
            }
          }}
          onDayPress={(day) => {
            const dateString = day.dateString;
            setSelectedDate(dateString);
          }}
          theme={{
            textDayFontFamily: 'Poppins',
            textMonthFontFamily: 'Poppins',
            textDayHeaderFontFamily: 'Poppins',
          }}
        />

        <View style={styles.eventsContainer}>
          <Text style={styles.subtitle}>EVENTS</Text>

          <ScrollView style={styles.eventsList}>
            {events.length > 0 ? (
              events.map((event, index) => (
                <View key={index} style={styles.eventItem}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle}>{event.title}</Text>

                    <TouchableOpacity onPress={() => handleToggleExpand(index)} style={styles.chevronContainer}>
                      <Ionicons name={expandedEvent === index ? 'chevron-up' : 'chevron-down'} size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.eventDate}>{event.date}</Text>
                  {expandedEvent === index && (
                    <View style={styles.eventDetails}>
                      <Text style={styles.eventDescription}>Description: {event.description}</Text>
                      <TouchableOpacity onPress={() => handleLocationPress(event.location)}>
                        <Text style={styles.eventLocation}>Location: {event.location}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.noEventsContainer}>
                <Text style={{ fontFamily: "Poppins" }}>No events yet.</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.addButton}>
            <Text style={styles.addButtonText}>ADD EVENT</Text>
          </View>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>ADD EVENT</Text>
            <TextInput
              label={<Text style={{ color: 'red' }}>EVENT</Text>}
              value={schedule}
              mode="outlined"
              activeOutlineColor="red"
              outlineColor="red"
              textColor="red"
              onChangeText={setSchedule}
              style={styles.input}
            />
            <TextInput
              label={<Text style={{ color: 'red' }}>DESCRIPTION</Text>}
              value={description}
              mode="outlined"
              activeOutlineColor="red"
              outlineColor="red"
              textColor="red"
              onChangeText={setDescription}
              style={styles.input}
            />
            <TextInput
              label={<Text style={{ color: 'red' }}>LOCATION</Text>}
              value={location}
              mode="outlined"
              activeOutlineColor="red"
              outlineColor="red"
              textColor="red"
              onChangeText={setLocation}
              style={styles.input}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.buttonStyle, { backgroundColor: 'red' }]}
                onPress={handleAddEvent}
              >
                <Text style={styles.buttonTextStyle}>Add Event</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonStyle, { backgroundColor: '#777' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonTextStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );  
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 20 },
  headerText: {
    fontFamily: 'PoppinsBold',
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginVertical: 10,
  },
  eventsContainer: {
    marginVertical: 10,
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 8,
    padding: 10,
  },
  subtitle: {
    fontSize: 19,
    color: 'red',
    fontFamily: 'PoppinsBold',
    paddingVertical: 10,
    textAlign: 'left',
    paddingLeft: 10,
  },
  eventItem: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'PoppinsBold',
  },
  eventDate: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#333',
  },
  chevronContainer: {
    padding: 4,
  },
  eventDetails: {
    marginTop: 8,
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  eventLocation: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: 'red',
  },
  noEventsContainer: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'red',
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 5,
    alignItems: 'center',
    width: '90%',
    alignSelf:'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'PoppinsBold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 18,
    color: 'red',
    fontFamily: 'PoppinsBold',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    marginVertical: 8,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonStyle: {
    paddingVertical: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  buttonTextStyle: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
});

export default Event; 

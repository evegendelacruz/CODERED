import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const Event = () => {
  const [eventTitle, setEventTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddEvent = () => {
    if (!selectedDate || !eventTitle || !location || !description) {
      alert('Please fill all fields and select a date!');
      return;
    }

    // Update events state with the new event
    setEvents((prevEvents) => ({
      ...prevEvents,
      [selectedDate]: [
        ...(prevEvents[selectedDate] || []),
        { title: eventTitle, location, description, date: selectedDate },
      ],
    }));

    setEventTitle('');
    setLocation('');
    setDescription('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Text style={styles.headerText}>BLOOD DRIVE CALENDAR</Text>
        </View>

        <Calendar
          current={selectedDate}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: 'red',
              selectedTextColor: 'white',
            },
          }}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          theme={{
            textDayFontFamily: 'Poppins',
            textMonthFontFamily: 'Poppins',
            textDayHeaderFontFamily: 'Poppins',
          }}
        />

        <View style={styles.eventsContainer}>
          <Text style={styles.subtitle}>EVENTS</Text>
          {events[selectedDate] && events[selectedDate].length > 0 ? (
            events[selectedDate].map((event, index) => (
              <View key={index} style={styles.eventItem}>
                <View style={styles.eventHeader}>
                  <Ionicons name="calendar" size={moderateScale(20)} color="red" />
                  <Text style={styles.eventTitle}>{event.title}</Text>
                </View>
                <Text style={styles.eventDate}>Location: {event.location}</Text>
                <Text style={styles.eventDate}>Description: {event.description}</Text>
                <Text style={styles.eventDate}>Date: {event.date}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noEventsContainer}>
              <Text style={{ fontFamily: 'Poppins' }}>No events for this date.</Text>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View
            style={[
              styles.addButton,
              events[selectedDate] && events[selectedDate].length > 0
                ? styles.addButtonWithEvents
                : styles.addButtonWithoutEvents,
            ]}
          >
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
              label="EVENT"
              value={eventTitle}
              mode="outlined"
              activeOutlineColor="red"
              outlineColor="red"
              textColor="red"
              onChangeText={setEventTitle}
              style={styles.input}
            />
            <TextInput
              label="DESCRIPTION"
              value={description}
              mode="outlined"
              activeOutlineColor="red"
              outlineColor="red"
              textColor="red"
              onChangeText={setDescription}
              style={styles.input}
            />
            <TextInput
              label="LOCATION"
              value={location}
              mode="outlined"
              activeOutlineColor="red"
              outlineColor="red"
              textColor="red"
              onChangeText={setLocation}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.addEventButton} onPress={handleAddEvent}>
                <Text style={styles.buttonText}>Add Event</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: verticalScale(20),
    paddingTop: verticalScale(10),
  },
  headerText: {
    fontFamily: 'PoppinsBold',
    fontSize: moderateScale(18),
    textAlign: 'center',
    color: 'red',
    marginVertical: verticalScale(10),
  },
  eventsContainer: {
    marginVertical: verticalScale(5),
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: verticalScale(10),
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: 'red',
    fontFamily: 'PoppinsBold',
    paddingVertical: verticalScale(10),
    paddingLeft: scale(10),
  },
  eventItem: {
    marginVertical: verticalScale(8),
    padding: scale(10),
    backgroundColor: '#f9f9f9',
    borderRadius: scale(5),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    marginLeft: scale(10),
    fontFamily: 'Poppins',
  },
  eventDate: {
    fontSize: moderateScale(12),
    color: '#777',
    marginTop: verticalScale(5),
    fontFamily: 'Poppins',
  },
  addButton: {
    alignSelf: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    backgroundColor: 'red',
    borderRadius: scale(8),
    marginTop: verticalScale(20),
    width: scale(300),
  },
  addButtonWithEvents: {
    backgroundColor: 'red', // Change background color when events are present
    marginTop: verticalScale(20), // Adjust position if there are events
  },
  addButtonWithoutEvents: {
    backgroundColor: 'red', // Original background color
    marginTop: verticalScale(20), // Default position
  },
  addButtonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    textAlign: 'center',
    fontFamily: 'PoppinsBold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginBottom: verticalScale(10),
    fontFamily: 'Poppins',
  },
  noEventsContainer: {
    left: scale(30),
  },
  input: {
    width: width - scale(40),
    marginBottom: verticalScale(10),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: verticalScale(20),
  },
  addEventButton: {
    backgroundColor: 'red',
    padding: scale(10),
    borderRadius: scale(5),
  },
  closeButton: {
    backgroundColor: 'gray',
    padding: scale(10),
    borderRadius: scale(5),
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'PoppinsBold',
  },
});

export default Event;

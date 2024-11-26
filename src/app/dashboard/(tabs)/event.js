import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  Dimensions,
  ScrollView,
} from 'react-native';
import { TextInput } from "react-native-paper";
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Event = () => {
  const [eventTitle, setEventTitle] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [information, setInformation] = useState("");
  const [selectedDate, setSelectedDate] = useState('');
  const [schedule, setSchedule] = useState('');
  const [events, setEvents] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddEvent = () => {
    if (!selectedDate || !schedule) {
      alert('Please select a date and enter an event!');
      return;
    }

    // Update events state with new event for selected date
    setEvents((prevEvents) => ({
      ...prevEvents,
      [selectedDate]: [
        ...(prevEvents[selectedDate] || []),
        { schedule, date: selectedDate },
      ],
    }));

    setSchedule('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Text style={styles.headerText}>
            BLOOD DRIVE CALENDAR
          </Text>
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
          {events[selectedDate] ? (
            events[selectedDate].map((event, index) => (
              <View key={index} style={styles.eventItem}>
                <View style={styles.eventHeader}>
                  <Ionicons name="add-circle-outline" size={24} color="red" />
                  <Text style={styles.eventTitle}>{event.schedule}</Text>
                </View>
                <Text style={styles.eventDate}>{event.date}</Text>
                <TouchableOpacity>
                  <Ionicons name="chevron-down" size={20} color="gray" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.noEventsContainer}>
              <Text style={{fontFamily:"Poppins"}}>No events for this date.</Text>
            </View>
          )}
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
              label="EVENT"
              value={eventTitle}
              mode="outlined"
              activeOutlineColor="red"
              outlineColor="red"
              textColor="red"
              onChangeText={setEventTitle}
              style={styles.input}
            />
            <Button title="Add Event" onPress={handleAddEvent} />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerText: {
    fontFamily: 'PoppinsBold',
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginVertical: 10,
  },
  eventsContainer: {
    marginVertical: 5,
    backgroundColor: 'white',
    width: '100%',
    height: '9%',
  },
  subtitle: {
    fontSize: 19,
    color: 'red',
    fontFamily: 'PoppinsBold',
    justifyContent: 'center',
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
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    fontFamily: 'Poppins',
  },
  eventDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
    fontFamily: 'Poppins',
  },
  noEventsContainer: {
    backgroundColor: 'white',
    width: '100%',
    marginTop: 5,
    padding: 10,
    zIndex: -1,
    height: '300%'
  },
  addButton: {
    position: 'absolute',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'red',
    borderRadius: 8,
    marginTop: 90,
    width: 300,
    
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'PoppinsBold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Poppins',
  },
  input: {
    width: width - 40,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default Event;

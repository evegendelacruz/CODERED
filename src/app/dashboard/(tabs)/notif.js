import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { useRoute, useNavigation } from '@react-navigation/native'; // Import useNavigation

// Function to calculate time difference
const timeAgo = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp; // Difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return 'Just Now';
  } else if (minutes < 60) {
    return `${minutes} min ago`;
  } else if (hours < 24) {
    return `${hours} hr ago`;
  } else {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

const Notification = () => {
  const route = useRoute();
  const navigation = useNavigation(); // Get navigation prop
  const { newEvent } = route.params || {}; // Get new event passed from navigation
  console.log("Received newEvent:", newEvent); // Debug log

  // Manage notifications state
  const [notifications, setNotifications] = useState([]);

  // Add new events to notifications when they arrive
  useEffect(() => {
    if (newEvent) {
      console.log("Adding new event to notifications:", newEvent); // Debug log
      setNotifications((prev) => [
        { id: Date.now(), ...newEvent, timestamp: Date.now(), isRead: false },
        ...prev,
      ]);
    }
  }, [newEvent]);

  // Mark notifications as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // Handle notification press
  const handleNotificationPress = (item) => {
    markAsRead(item.id); // Mark the notification as read
    // Navigate to the EventDetails screen and pass the selected event
    navigation.navigate('event', { selectedEvent: item });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'lightgray' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      <View style={styles.container}>
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.notificationCard, item.isRead && styles.notificationRead]}
                onPress={() => handleNotificationPress(item)} // Navigate when pressed
              >
                <View style={styles.iconContainer}>
                  <View style={styles.iconPlaceholder}>
                    <FontAwesome name="calendar" size={20} color="red" />
                  </View>
                </View>
                <View style={styles.content}>
                  <Text style={[styles.title, item.isRead && styles.textRead]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.description, item.isRead && styles.textRead]}>
                    Scheduled on: {item.date}
                  </Text>
                </View>
                <Text style={styles.timestamp}>
                  {item.isRead ? 'Read' : timeAgo(item.timestamp)}
                </Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.noNotifications}>No new notifications</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    height: '8%',
    justifyContent: 'center',
    elevation: 2,
  },
  headerText: {
    fontFamily: 'PoppinsBold',
    fontSize: 20,
    color: 'red',
    paddingLeft: 13,
  },
  container: { flex: 1, padding: 16, backgroundColor: '#f1f1f1'  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    elevation: 2,

  },
  notificationRead: {
    backgroundColor: '#f0f0f0',
  },
  iconContainer: { justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconPlaceholder: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  title: { fontFamily: 'PoppinsBold', fontSize: 14, color: '#333', marginBottom: 4 },
  description: { fontFamily: 'Poppins', fontSize: 12, color: '#666' },
  textRead: { color: '#aaa' },
  timestamp: { fontSize: 11, color: '#999', alignSelf: 'center' },
  noNotifications: {
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default Notification;

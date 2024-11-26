import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome6'; // Import FontAwesome6

const Notification = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'lightgray' }}>
      <View
        style={{
          backgroundColor: 'white',
          height: '8%', // Specific height for this section
          justifyContent: 'center',
          alignItems: 'flex-start', // Use alignItems instead of alignContent
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontFamily: 'PoppinsBold',
            fontSize: 20,
            color: 'red',
            paddingLeft: 13,
          }}
        >
          Notifications
        </Text>
      </View>

      <View style={{ marginVertical: 5 }}>
        <Text
          style={{
            fontFamily: 'Poppins',
            paddingLeft: 13,
            fontSize: 15,
            color: 'gray',
            elevation: 2,
          }}
        >
          Today
        </Text>
      </View>

      <View
        style={{
          backgroundColor: 'white',
          flex: 1, // Allow this section to take the remaining space
        }}
      >
        <View style={styles.container}>
          {/* Notification 1 */}
          <TouchableOpacity style={styles.notificationCard}>
            <View style={styles.iconContainer}>
              <View style={styles.iconPlaceholder}>
                <FontAwesome name="droplet" size={20} color="red" />
              </View>
            </View>
            <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              Urgent Blood Donation Request
            </Text>
              <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
              Type O- blood is urgently needed at City General Hospital. Please donate if you're available.
              </Text>
            </View>
            <Text style={styles.timestamp}>5h ago</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.notificationCard}>
            <View style={styles.iconContainer}>
              <View style={styles.iconPlaceholder}>
                <FontAwesome name="calendar" size={20} color="red" />
              </View>
            </View>
            <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              Blood Donation Opportunity
            </Text>
              <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
              Join us at Limketkai Center on Nov 30, 9 AM to 4 PM. Save lives by donating blood!
              </Text>
            </View>
            <Text style={styles.timestamp}>10h ago</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'PoppinsBold',
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#666',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  successText: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    alignSelf: 'center',
    marginTop: -50
  },
});

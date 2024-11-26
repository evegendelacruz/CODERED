import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from 'react-native-paper';

const Message = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const onSearchChange = (query) => {
    setSearchQuery(query);
    // Additional logic for search
  };

  const contacts = [
    { id: '1', label: 'XD', isOnline: true, firstName: 'Xander' },
    { id: '2', label: 'AB', isOnline: false, firstName: 'Alfred' },
    { id: '3', label: 'CD', isOnline: true, firstName: 'Charlie' },
    { id: '4', label: 'EF', isOnline: false, firstName: 'Evelyn' },
    { id: '5', label: 'GH', isOnline: true, firstName: 'George' },
    { id: '6', label: 'IJ', isOnline: true, firstName: 'Ivy' },
    { id: '7', label: 'KL', isOnline: false, firstName: 'Kathy' },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.row}>
          {contacts.map(contact => (
            <View key={contact.id} style={styles.contactContainer}>
              <View style={styles.avatarContainer}>
                <Avatar.Text size={50} label={contact.label} style={styles.avatar} />
                {contact.isOnline && <View style={styles.badge} />}
              </View>
              <Text style={styles.name}>{contact.firstName}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Contacts Title and Message Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.contactsText}>No conversations here yet. Send a message!</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
  },
  contactContainer: {
    marginHorizontal: 10,
    alignItems: 'center', // Centers the avatar and name vertically
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 5, // Space between the avatar and name
  },
  avatar: {
    backgroundColor: 'red',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1ce61c',
    borderWidth: 2,
    borderColor: 'white',
  },
  name: {
    fontSize: 12,
    fontFamily: 'Poppins',
    color: '#333',
    marginTop: 5,  // Space between avatar and name
  },
  contentContainer: {
    paddingHorizontal: 10, 
  },
  contactsText: {
    fontFamily: 'Poppins',
    fontSize: 13,
    marginBottom: 360, 
    textAlign:'center',
    color:'gray',
    marginHorizontal: 50
  },
  messageContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});

export default Message;

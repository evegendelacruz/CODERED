import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from './../../../../src/utils/supabase';
import { formatDistanceToNow } from 'date-fns';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';

const Notification = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { newEvent } = route.params || {};

  const [accountType, setAccountType] = useState('user');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = supabase.auth.user();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('account_type')
          .eq('id', user.id)
          .single();

        if (data?.account_type) {
          setAccountType(data.account_type);
        } else if (error) {
        }
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setNotifications(data);
      } else if (error) {
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const addEventToNotifications = async () => {
      if (newEvent?.title && newEvent?.date) {
        try {
          const { error } = await supabase
            .from('notifications')
            .insert([
              {
                title: newEvent.title,
                date: newEvent.date,
                created_at: new Date().toISOString(),
              },
            ]);
  
          if (!error) {
            Toast.show({
              type: 'customSuccess',
              text1: 'Success!',
              text2: `The event "${newEvent.title}" was successfully added!`,
            });
  
            // Add the new event to the notifications state
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              {
                title: newEvent.title,
                date: newEvent.date,
                created_at: new Date().toISOString(),
                id: Date.now(), // Assuming the id is generated or needs to be unique
              },
            ]);
          }
        } catch (error) {
          Toast.show({
            type: 'customError',
            text1: 'Error',
            text2: 'Failed to add event to the Calendar.',
          });
        }
      }
    };
  
    addEventToNotifications();
    
  }, [newEvent]);
    const handlePress = async (item) => {
    try {
      if (!item?.id) {
        return;
      }
  
      if (accountType === 'user') {
        await markAsRead(item.id);
      }
  
      navigation.navigate('event', { eventId: item.id });
    } catch (error) {
      // Error handling can be added here if needed
    }
  };
  
  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
  
      if (error) {
        // Handle error if necessary
      }
    } catch (error) {
      // Handle unexpected errors
    }
  };
  
  const timeAgo = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };
  

  const toastConfig = {
    customSuccess: ({ text1, text2 }) => (
      <BaseToast
        style={[styles.toastContainer, { borderLeftColor: '#28a745' }]} 
        contentContainerStyle={styles.contentContainer}
        text1Style={styles.successText1}
        text2Style={styles.text2}
        text1={text1}
        text2={text2}
        renderLeadingIcon={() => (
          <AntDesign name="checkcircle" size={30} color="green" style={styles.icon} />
        )}
      />
    ),
    customError: ({ text1, text2 }) => (
      <ErrorToast
        style={[styles.toastContainer, { borderLeftColor: '#dc3545' }]} // Red for error
        contentContainerStyle={styles.contentContainer}
        text1Style={styles.errorText1}
        text2Style={styles.text2}
        text1={text1}
        text2={text2}
        renderLeadingIcon={() => (
          <Entypo name="circle-with-cross" size={30} color="red" style={styles.icon} />
        )}
      />
    ),
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f4f4' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      <View style={styles.container}>
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item?.id?.toString() || ''}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.notificationCard}
                onPress={() => handlePress(item)}
              >
              
              <View style={styles.notificationContent}>
              <View style={styles.iconContainer}>
                <Entypo name="calendar" size={21} color="red"/>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>Event Reminder!</Text>
                <Text style={styles.description}>
                  Don't miss the upcoming <Text style={styles.event}>{item.title}</Text> event. Join us on <Text style={styles.event}>{item.date}</Text> for a heroic experience. Your participation can save lives. See you there!
                </Text>
              </View>
            </View>
          </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.noNotifications}>No new notifications</Text>
        )}
      </View>

      <Toast config={toastConfig} />
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
    paddingLeft: 18,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    borderColor: 'gray',
    borderWidth: 0.3,
   
  },
  content: {
    flexDirection: 'column',
  },
  title: {
    fontFamily: 'PoppinsBold',
    fontSize: 14,
    color: '#333',
  },
  description: {
    fontFamily: 'Poppins',
    fontSize: 11,
    color: '#666',
    textAlign: 'justify'
  },
  timeAgo: {
    fontFamily: 'PoppinsItalic',
    fontSize: 10,
    color: '#999',
  },
  noNotifications: {
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },

  icon:{
    alignSelf:'center',
    marginHorizontal: 20,
  },

  successText1: {
    fontFamily: 'PoppinsBold',
    fontSize: 14,
    marginLeft: -25,
  },

  text2: {
    fontSize: 13,
    fontFamily: 'Poppins',
    color: '#6c757d',
    flexWrap: 'wrap',  
    marginLeft: -25,
    maxWidth: '100%', 
  },

  text1: {
    fontFamily: 'PoppinsBold'
  },

  errorText1: {
    fontFamily: 'PoppinsBold',
    fontSize: 14,
    marginLeft: -25
  },

  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  textContainer: {
    marginLeft: 15, 
    marginHorizontal: 40
  },
  event: {
    fontFamily: 'PoppinsBold',
    color: 'black'
  },

  schedule: {
    fontFamily: 'PoppinsBold',
    color: 'black'
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor:  'rgba(255, 105, 180, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -2,
},
});

export default Notification;

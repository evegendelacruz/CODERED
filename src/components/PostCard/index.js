import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const PostCard = ({ post }) => {
  const { 
    user_name, 
    user_profile_pic, 
    post_time, 
    request_recipient, 
    request_blood_type, 
    request_hospital, 
    request_urgency_lvl, 
    request_bag_qnty, 
    request_caption, 
    request_file 
  } = post;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: user_profile_pic }} style={styles.profilePic} />
        <View style={styles.headerText}>
          <Text style={styles.userName}>{user_name}</Text>
          <Text style={styles.postTime}>{post_time}</Text>
        </View>
        <TouchableOpacity style={styles.optionsButton}>
          <Text style={styles.optionsText}>•••</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Calling for Blood Donation</Text>
        <Text style={styles.subTitle}>Recipient: {request_recipient}</Text>
        <Text style={styles.subTitle}>Blood Type: {request_blood_type}</Text>
        <Text style={styles.subTitle}>Hospital: {request_hospital}</Text>
        <Text style={styles.subTitle}>Urgency Level: {request_urgency_lvl}</Text>
        <Text style={styles.subTitle}>Bags Needed: {request_bag_qnty}</Text>
        <Text style={styles.caption}>Details: {request_caption}</Text>
      </View>

      {request_file?.fileUrl && (
        <Image
          source={{ uri: request_file.fileUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderColor: "#ccc",
    borderWidth: 1,
    marginVertical: 2,
    padding: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 14,
  },
  postTime: {
    fontSize: 12,
    color: "#666",
  },
  optionsButton: {
    padding: 5,
  },
  optionsText: {
    fontSize: 20,
    color: "#666",
  },
  content: {
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 14,
    marginBottom: 3,
  },
  caption: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
});

export default PostCard;

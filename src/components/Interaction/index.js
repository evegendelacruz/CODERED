import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, FlatList } from "react-native";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Divider } from "react-native-paper";
import { supabase } from "../../utils/supabase";

const Interaction = ({ requestId }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [isCommentVisible, setIsCommentVisible] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [userFullName, setUserFullName] = useState("Name not available");
    const [authId, setAuthId] = useState(null);
    const [currentRequestId, setCurrentRequestId] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            // Check if user is authenticated by getting the session
            const { data: authSession, error: authError } = await supabase.auth.getSession();
        
            if (authError || !authSession?.session?.user?.id) {
              console.error("User not authenticated or session expired");
              return; // Exit if no session or user ID is found
            }
    
            const authId = authSession.session.user.id;  // Use the session's user ID
            setAuthId(authId);
    
            // Fetch user full name from the database using auth_id
            const { data: userData, error: userError } = await supabase
              .from("user")
              .select("user_firstname, user_middlename, user_lastname")
              .eq("auth_id", authId) // Use authId from session
              .single();
        
            if (userError) {
              console.error("Error fetching user data:", userError.message);
              setUserFullName("Name not available");
              return;
            }
        
            // Combine firstname, middlename, and lastname
            const fullName = `${userData.user_firstname || ""} ${userData.user_middlename || ""} ${userData.user_lastname || ""}`.trim();
            setUserFullName(fullName || "Name not available");
        
            // Fetch user profile image
            const filePath = `user_profile/${authId}.jpg`; // File path for the user's profile image
            const { data: profilePicData, error: picError } = await supabase.storage
              .from("uploads")
              .getPublicUrl(filePath);
        
            if (picError) {
              console.error("Error fetching profile picture:", picError.message);
              setProfileImage("https://via.placeholder.com/40"); // Fallback to a placeholder image
            } else {
              setProfileImage(profilePicData?.publicUrl || "https://via.placeholder.com/40");
            }
        
          } catch (error) {
            console.error("Error fetching user data:", error.message);
          }
        };
        
        fetchUserData();
      }, []);
 
  
    const fetchProfileImage = async () => {
      try {
        // Fetch authenticated user from Supabase
        const { data: authUser, error: authError } = await supabase.auth.getUser();
    
        // Check if there is an error or if the user is not authenticated
        if (authError || !authUser) {
          console.error("Error fetching authenticated user:", authError?.message);
          return;
        }
    
        // Use authUser.id instead of auth_id (assuming 'id' is the unique identifier for the user)
        const filePath = `user_profile/${authUser.id}.jpg`; // File path for the user's profile image
    
        // Fetch the profile picture from Supabase storage
        const { data: profilePicData, error: picError } = await supabase.storage
          .from("uploads")
          .getPublicUrl(filePath);
    
        // Check if there was an error fetching the profile picture
        if (picError) {
          console.error("Error fetching profile picture:", picError.message);
          return;
        }
    
        // Return the public URL of the profile picture
        return profilePicData?.publicUrl;
      } catch (error) {
        console.error("Error fetching profile image:", error.message);
      }
    };
    
    useEffect(() => {
      fetchProfileImage().then((url) => setProfileImage(url));
    }, []);

    const handleLike = async () => {
        try {
            if (!requestId) {
                console.error("No requestId provided to handle like.");
                return;
            }
    
            if (isLiked) {
                // Unlike: Delete like from 'response_like' table
                const { error: deleteError } = await supabase
                    .from("response_like")
                    .delete()
                    .eq("auth_id", authId)
                    .eq("request_id", requestId);
    
                if (deleteError) {
                    console.error("Error unliking:", deleteError.message);
                    return;
                }
    
                // Update like count
                setLikeCount((prev) => prev - 1);
            } else {
                // Like: Insert like into 'response_like' table
                const { error: insertError } = await supabase
                    .from("response_like")
                    .insert([{ request_id: requestId, auth_id: authId }]);
    
                if (insertError) {
                    console.error("Error liking:", insertError.message);
                    return;
                }
    
                // Update like count
                setLikeCount((prev) => prev + 1);
            }
    
            // Toggle the like state
            setIsLiked((prevState) => !prevState);
        } catch (error) {
            console.error("Error handling like/unlike:", error.message);
        }
    };
    
      
  const handleCommentPress = () => {
    setIsCommentVisible(!isCommentVisible);
  };

  const handleSendComment = async () => {
    if (commentText.trim()) {
        try {
            if (!requestId) {
                console.error("No requestId provided to handle comment.");
                return;
            }

            // Insert the comment into the 'response_comment' table
            const { error: insertError } = await supabase
                .from('response_comment')
                .insert([{ request_id: requestId, auth_id: authId, comment: commentText }]);

            if (insertError) {
                console.error("Error saving comment:", insertError.message);
                return;
            }

            // Add the new comment to the list if insertion is successful
            setComments((prevComments) => [...prevComments, { comment: commentText }]);

            // Clear the input field and hide the input area
            setCommentText('');
            setIsCommentVisible(false);
        } catch (error) {
            console.error("Error handling comment:", error.message);
        }
    }
};

const fetchLikesAndComments = async () => {
    try {
      if (!requestId) {
        console.error("No requestId provided to Interaction component.");
        return;
      }
  
      // Fetch the like count for the specific request_id
      const { data: likesData, error: likeError } = await supabase
        .from('response_like')
        .select('*', { count: 'exact' })
        .eq('request_id', requestId);
  
      if (likeError) {
        console.error("Error fetching likes:", likeError.message);
        return;
      }
  
      setLikeCount(likesData?.length || 0);
  
      // Check if the user has liked this post
      const { data: userLikeData, error: userLikeError } = await supabase
        .from('response_like')
        .select('*')
        .eq('auth_id', authId)
        .eq('request_id', requestId)
        .limit(1)
        .single();
  
      if (userLikeError && userLikeError.code !== 'PGRST116') {
        console.error("Error checking user like:", userLikeError.message);
        return;
      }
  
      setIsLiked(!!userLikeData);
  
      // Fetch all comments for the specific request_id
      const { data: commentsData, error: commentError } = await supabase
        .from('response_comment')
        .select('comment, auth_id')
        .eq('request_id', requestId);
  
      if (commentError) {
        console.error("Error fetching comments:", commentError.message);
        return;
      }
  
      // Fetch user details for each comment (name and profile picture)
      const commentsWithUserData = await Promise.all(
        commentsData.map(async (comment) => {
          const { data: userData, error: userError } = await supabase
            .from('user')
            .select('user_firstname, user_middlename, user_lastname')
            .eq('auth_id', comment.auth_id)
            .single();
  
          if (userError) {
            console.error("Error fetching user data for comment:", userError.message);
          }
  
          const fullName = `${userData?.user_firstname || ""} ${userData?.user_middlename || ""} ${userData?.user_lastname || ""}`.trim();
  
          // Fetch profile image for the user
          const filePath = `user_profile/${comment.auth_id}.jpg`; // File path for the user's profile image
          const { data: profilePicData, error: picError } = await supabase.storage
            .from("uploads")
            .getPublicUrl(filePath);
  
          const profileImage = picError ? "https://via.placeholder.com/40" : profilePicData?.publicUrl;
  
          return {
            ...comment,
            fullName,
            profileImage,
          };
        })
      );
  
      setComments(commentsWithUserData);
      setCommentCount(commentsWithUserData.length);
    } catch (error) {
      console.error("Error fetching likes and comments:", error.message);
    }
  };
  
  const subscribeToLikesAndComments = (requestId) => {
    if (!requestId) return;
  
    const likeChannel = supabase
      .channel(`like-changes:${requestId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'response_like', filter: `request_id=eq.${requestId}` },
        () => fetchLikesAndComments()
      )
      .subscribe();
  
    const commentChannel = supabase
      .channel(`comment-changes:${requestId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'response_comment', filter: `request_id=eq.${requestId}` },
        () => fetchLikesAndComments()
      )
      .subscribe();
  
    // Cleanup function
    return () => {
      supabase.removeChannel(likeChannel);
      supabase.removeChannel(commentChannel);
    };
  };
  
  useEffect(() => {
    if (authId) {
      fetchLikesAndComments();
      const unsubscribe = subscribeToLikesAndComments(requestId);
  
      // Cleanup when the component unmounts or requestId changes
      return () => unsubscribe();
    }
  }, [authId, requestId]); // Trigger on authId or requestId change

  
  return (
    <View style={styles.container}>
      <View style={styles.counterContainer}>
        {/* Like Count Display */}
        <View style={styles.likeCountContainer}>
          <AntDesign name="heart" color={'red'} size={14} style={{ marginBottom: 4 }} />
          <Text style={styles.likeCountText}>{likeCount}</Text>
        </View>

        {/* Comment Count Display */}
        <View style={styles.commentCountContainer}>
          <FontAwesome name="comment" color={'gray'} size={15} style={{ marginBottom: 4 }} />
          <Text style={styles.commentCountText}>{commentCount}</Text>
        </View>
      </View>

      <Divider style={{ marginVertical: 10 }} />

      <View style={styles.buttonContainer}>
        {/* Like Button */}
        <TouchableOpacity
          style={styles.likeButton}
          onPress={handleLike} // Toggle like/unlike
        >
          <AntDesign name={isLiked ? "heart" : "hearto"} size={20} color={isLiked ? "red" : "black"} />
          <Text style={styles.likeText}>{isLiked ? "Supported" : "Support"}</Text>
        </TouchableOpacity>

        {/* Comment Button */}
        <TouchableOpacity style={styles.commentButton} onPress={handleCommentPress}>
          <AntDesign name="message1" size={20} color="black" />
          <Text style={styles.commentText}>Comment</Text>
        </TouchableOpacity>
      </View>

      <FlatList
    data={comments}
    renderItem={({ item }) => (
        <View style={styles.commentItem}>
            <View style={styles.commentHeader}>
                <Image
                    source={{ uri: item.profileImage }}  // Use the profile image from each comment's user data
                    style={styles.commentProfilePic}
                />
                <View style={styles.commentContent}>
                    <Text style={styles.commentAuthor}>{item.fullName}</Text>  
                    <Text style={styles.commentInputText}>{item.comment}</Text>
                </View>
            </View>
        </View>
    )}
    keyExtractor={(item, index) => index.toString()}
/>



      <View>
        {/* Comment Input */}
        {isCommentVisible && (
          <View style={styles.commentInputContainer}>
            <Image
              source={{ uri: profileImage }}
              style={styles.profilePic}
            />
            <View style={styles.inputWithButton}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendComment}>
                <Ionicons name="send" size={18} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },

  counterContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },

  likeCountContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },

  likeCountText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: 'gray',
    marginLeft: 7,
  },

  commentCountContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },

  commentCountText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: 'gray',
    marginLeft: 7,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  likeText: {
    marginLeft: 5,
    fontSize: 15,
    fontFamily: 'Poppins',
    marginTop: 2,
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  commentText: {
    marginLeft: 5,
    fontSize: 15,
    fontFamily: 'Poppins',
    marginTop: 2,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  inputWithButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderRadius: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  commentInput: {
    flex: 1,
    height: 40,
  },
  sendButton: {
    marginLeft: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  previewContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },

  commentItem: {
    paddingVertical: 8,
   
  },

  noCommentsText: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    justifyContent: 'center'
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  
  commentProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  
  commentContent: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: -5,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 0.1,
  },
  
  commentAuthor: {
    fontSize: 14,
    fontFamily:'PoppinsBold',
    color: "#333",
  },
  
  commentInputText: {
    fontSize: 13,
    color: "#555",
    fontFamily: 'Poppins',
    marginTop: -5,
  },
  
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  
});

export default Interaction;

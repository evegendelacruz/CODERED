import React, { useState, useEffect } from "react";
import {supabase} from "../../utils/supabase"

const NewPost = ({ setPosts }) => {
    useEffect(() => {
        fetchPosts();
      }, []);
      
      const fetchPosts = async () => {
        try {
          const { data, error } = await supabase
            .from("blood_request")
            .select("*")
            .order("request_id", { ascending: false });
      
          if (error) {
            console.error("Error fetching posts:", error);
            return;
          }
          console.log(data);  // Log data to check the structure
          setPosts(data || []);
        } catch (err) {
          console.error("Error fetching posts:", err);
        }
      };

  return null; 
};

export default NewPost;

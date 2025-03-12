import React, { useState,useRef, useEffect } from "react";
import { View, Text,ScrollView,Button,KeyboardAvoidingView,Modal,StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, FlatList, ImageBackground, Animated, Dimensions } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Image } from "react-native";
import { Video } from "expo-av";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
 import { PermissionsAndroid, Platform } from "react-native";
 import { launchImageLibrary } from "react-native-image-picker";
 import { Ionicons } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");
import * as FileSystem from "expo-file-system";
import VideoReelsScreen from "./reels";
const FallingLeaves = () => {
  const [leaves] = useState(
    Array.from({ length: 10 }).map(() => new Animated.Value(0))
  );

  useEffect(() => {
    leaves.forEach((leaf) => {
      Animated.loop(
        Animated.timing(leaf, {
          toValue: 500,
          duration: Math.random() * 5000 + 5000,
          useNativeDriver: true,
        })
      ).start();
    });
  }, []);

  return leaves.map((leaf, index) => (
    <Animated.View
      key={index}
      style={{
        position: "absolute",
        transform: [{ translateY: leaf }], // ✅ Works with native driver

        left: Math.random() * 300,
        width: 20,
        height: 20,
        backgroundColor: "rgba(255,165,0,0.6)",
        borderRadius: 10,
      }}
    />
  ));
};

const CLOUDINARY_UPLOAD_PRESET = "datafiles"; 
const CLOUDINARY_CLOUD_NAME = "de0v39ltg";
const FormScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    image: null, // Cloudinary Image URL
  });

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  
  const handleChange = (key, value) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "You need to allow access to your gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.assets || result.assets.length === 0) {
      return;
    }

    const selectedImage = result.assets[0].uri;
    setLoading(true);
    console.log("Selected Image URI:", selectedImage);

    const cloudinaryUrl = await uploadToCloudinary(selectedImage);
    if (!cloudinaryUrl) {
      Alert.alert("Upload Failed", "Could not upload image to Cloudinary.");
      setLoading(false);
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      image: cloudinaryUrl, 
    }));

    console.log("Cloudinary Image URL Set:", cloudinaryUrl);
    setLoading(false);
  };

  
  const uploadToCloudinary = async (imageUri) => {
    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "upload.jpg",
    });
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      let response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      let result = await response.json();
      return result.secure_url || null;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return null;
    }
  };


  const handleSubmit = async () => {
    console.log("Form Data before submission:", formData);

    if (
      !formData.name ||
      !formData.email ||
      !formData.number.trim() || 
      !formData.password ||
      !formData.image
    ) {
      Alert.alert("Error", "All fields are required, including an image.");
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        name: formData.name,
        email: formData.email,
        number: formData.number,
        password: formData.password,
        image: formData.image,
      };

      console.log(" Request Body:", requestBody);

      const response = await axios.post(
        "https://apkform-2.onrender.com/api/auth/register",
        requestBody,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(" API Response:", response.data);
      navigation.navigate("LoginScreen");
    } catch (error) {
      console.error(" Axios Error:", error);
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  
  const navigateToLogin = () => {
    navigation.navigate("LoginScreen");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://thumbs.dreamstime.com/b/autumn-background-landscape-maple-trees-colorful-leaves-sunset-evening-birds-fly-away-autumn-background-landscape-maple-trees-156413485.jpg",
      }}
      style={{ flex: 1, justifyContent: "center", alignItems: "center", opacity: 0.8 }}
    >
      <Animated.View
        style={{
          width: "90%",
          padding: 20,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: 15,
          borderWidth: 2,
          borderColor: "black",
          opacity: fadeAnim,
        }}
      >
       
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Name</Text>
        <TextInput style={{ color: "#fff", borderBottomWidth: 1 }} value={formData.name} onChangeText={(text) => handleChange("name", text)} />

        
        <Text style={{ color: "#fff", fontWeight: "bold", marginTop: 10 }}>Email</Text>
        <TextInput style={{ color: "#fff", borderBottomWidth: 1 }} value={formData.email} onChangeText={(text) => handleChange("email", text)} keyboardType="email-address" />

        <Text style={{ color: "#fff", fontWeight: "bold", marginTop: 10 }}>Number</Text>
        <TextInput style={{ color: "#fff", borderBottomWidth: 1 }} value={formData.number} onChangeText={(text) => handleChange("number", text)} keyboardType="phone-pad" />

        
        <Text style={{ color: "#fff", fontWeight: "bold", marginTop: 10 }}>Password</Text>
        <TextInput style={{ color: "#fff", borderBottomWidth: 1 }} value={formData.password} onChangeText={(text) => handleChange("password", text)} secureTextEntry />

        
        <TouchableOpacity onPress={pickImage} style={{ marginTop: 10 }}>
          <Text style={{ color: "lightblue" }}>Pick an Image</Text>
        </TouchableOpacity>
        {formData.image && <Image source={{ uri: formData.image }} style={{ width: 100, height: 100, marginTop: 10 }} />}

        
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: "lightblue", padding: 10, marginTop: 10, borderRadius: 10 }}>
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>Submit</Text>
          </TouchableOpacity>
        )}

        
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <Text style={{ color: "white" }}>Already have an account?</Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={{ color: "rgb(22, 188, 186)", marginLeft: 5 }}>Login</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ImageBackground>
  );
};



  

const LoginScreen = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleChange = (key, value) => {
    setLoginData({ ...loginData, [key]: value });
  };

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("https://apkform-2.onrender.com/api/auth/login", loginData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Login Success:", response.data);
      Alert.alert("Success", "Logged in successfully!");
      navigation.navigate("UserScreen", { userData: response.data.user }); // Navigate to the next screen
    } catch (error) {
      console.error(" Login Error:", error);
      Alert.alert("Error", error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://thumbs.dreamstime.com/b/autumn-background-landscape-maple-trees-colorful-leaves-sunset-evening-birds-fly-away-autumn-background-landscape-maple-trees-156413485.jpg",
      }}
      style={{ flex: 1, justifyContent: "center", alignItems: "center", opacity: 0.8 }}
    >
      <FallingLeaves />
      <Animated.View
        style={{
          width: "90%",
          padding: 20,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: 15,
          borderWidth: 2,
          borderColor: "black",
          opacity: fadeAnim,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#fff" }}>
          Email
        </Text>
        <TextInput
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#fff",
            marginBottom: 10,
            padding: 8,
            color: "#fff",
          }}
          value={loginData.email}
          onChangeText={(text) => handleChange("email", text)}
          placeholder="Enter your email"
          placeholderTextColor="#ddd"
          keyboardType="email-address"
        />

        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#fff" }}>
          Password
        </Text>
        <TextInput
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#fff",
            marginBottom: 10,
            padding: 8,
            color: "#fff",
          }}
          value={loginData.password}
          onChangeText={(text) => handleChange("password", text)}
          placeholder="Enter your password"
          placeholderTextColor="#ddd"
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              padding: 12,
              borderRadius: 10,
              alignItems: "center",
            }}
            onPress={handleLogin}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Login</Text>
          </TouchableOpacity>
        )}
<View style={{flexDirection:"row"}}>
        <Text style={{ marginTop: 4, marginLeft: 4, color: "white" }}>
          Don't have an account?
         
        </Text> <TouchableOpacity onPress={() => navigation.navigate("FormScreen")}>
            <Text style={{ color: "rgb(22, 188, 186)", fontWeight: "bold",marginTop:4

             }}> Register</Text>
          </TouchableOpacity></View>
      </Animated.View>
    </ImageBackground>
  );
};
import { useRoute } from "@react-navigation/native";

const api=async()=>{
const users= await axios.get("https://apkform-2.onrender.com");
return users.data;

}

const UserScreen =  () => {
  const [clicked,setclicked]=useState(false)
  const route = useRoute();
  const user = route.params?.userData || {};
console.log("rote,route",user)
  const [users, setUsers] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const navigation = useNavigation();
  const slideAnim = useState(new Animated.Value(-150))[0]; 
  const userListAnim = useState(new Animated.Value(-200))[0];
const [posts,setposts]=useState([])
  useEffect(() => {
    api().then((e) => setUsers(e.data));
  }, []);

  const toggleInfo = () => {
    Animated.timing(slideAnim, {
      toValue: showInfo ? -200 : 50,
      duration: 600,
      useNativeDriver: false,
    }).start();
    setShowInfo(!showInfo);
  };


   useEffect(() => {
    const sortedUsers = users
      .map(user => ({
        ...user,
        posts: Array.isArray(user.posts)
          ? user.posts
              .filter(post => post && typeof post === "object" && post.url) 
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
          : []
      }))
      .filter(user => user.posts.length > 0) 
      .sort((a, b) => {
        const latestPostA = new Date(a.posts[0]?.createdAt || 0);
        const latestPostB = new Date(b.posts[0]?.createdAt || 0);
        return latestPostB - latestPostA; 
      });
  
    setposts(sortedUsers);
    console.log("Sorted Posts:", sortedUsers);
  }, [users]);


  const toggleUsers = () => {
    Animated.timing(userListAnim, {
      toValue: showUsers ? -200 : 50, 
      duration: 600,
      useNativeDriver: false,
    }).start();
    setShowUsers(!showUsers);
  };

  const like= async (email,id)=>{ 
    

    try {
      const response = await axios.post("https://apkform-2.onrender.com/api/auth/like", {
        email: email,
        id: id,
      });
      console.log(email,id);
      console.log(response)
      
      
    } catch (error) {
      console.error("Like API Error:", error);
    }


   }
   const [videoStates, setVideoStates] = useState({});
   const videoRefs = useRef({});
 
   useEffect(() => {
     
     setVideoStates({});
     videoRefs.current = {};
   }, [posts]);
 
   
   const togglePlay = (child) => {
     const videoRef = videoRefs.current[child._id];
     if (!videoRef) return;
 
     setVideoStates((prev) => {
       const isPlaying = !prev[child._id];
       if (isPlaying) {
         videoRef.playAsync();
       } else {
         videoRef.pauseAsync();
       }
       return { ...prev, [child._id]: isPlaying };
     });
   };
 
const postscreen=()=>{navigation.navigate("PostScreen", { email: user.email });}
  return (
    <View style={{ flex: 1, backgroundColor: "black", paddingTop: 10 }}>
     
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderBottomColor: "white",
          borderWidth: 1,
          borderTopWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          borderColor: "white",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
          {user?.name}
        </Text>

       
        <TouchableOpacity onPress={() => navigation.navigate("Profile", { user })}>
  <Image source={{ uri: user.image }} style={{ width: 50, height: 50, borderRadius: 25 }} />
</TouchableOpacity>
      </View>

     
      {showInfo && (
        <Animated.View
          style={{
            position: "absolute",
            top: slideAnim,
            right: 20,
            backgroundColor: "#FFA500",
            padding: 15,
            borderRadius: 10,
            width: width * 0.8,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 5,
            zIndex: 9999,
          }}
        >
          <Image
            source={{ uri: user?.image }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              alignSelf: "center",
              borderWidth: 2,
              borderColor: "#fff",
              marginBottom: 10,
            }}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#fff",
              textAlign: "center",
            }}
          >
            User Details
          </Text>
          <Text style={{ color: "#fff", marginTop: 5 }}>
            📧 Email: {user?.email}
          </Text>
          <Text style={{ color: "#fff", marginTop: 5 }}>
            📞 Number: {user?.number}
          </Text>

          {/* Close Button */}
          <TouchableOpacity onPress={toggleInfo} style={{ marginTop: 10 }}>
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              ▲ Close
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      
      <View
  style={{
    flexDirection: "row", 
    justifyContent: "space-between", 
    paddingHorizontal: 20, 
    marginTop: 10
  }}
>
  
  <TouchableOpacity
    onPress={postscreen}
    style={{
      backgroundColor: "rgb(57, 54, 53)",
      width: 80,
      borderRadius: 20,
      justifyContent: "center",
      paddingVertical: 6,
      paddingHorizontal: 15,
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 5,
    }}
  >
    <Text style={{ color: "white", fontSize: 18 ,marginBottom:2}}>Post </Text>
  </TouchableOpacity>
  <TouchableOpacity style={{
      backgroundColor: "rgb(57, 54, 53)",
      width: 80,
      borderRadius: 20,
      justifyContent: "center",
      paddingVertical: 6,
      paddingHorizontal: 15,
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 5,
    }} onPress={()=>{navigation.navigate("Reels",{user})}}><Text style={{ color: "white", fontSize: 18 ,marginBottom:2}}>Videos</Text></TouchableOpacity>

  
  <TouchableOpacity
    onPress={toggleUsers}
    style={{
      backgroundColor: "rgb(57, 54, 53)",
      width: 80,
      borderRadius: 20,
      justifyContent: "center",
      paddingVertical: 6,
      paddingHorizontal: 15,
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 5,
    }}
  >
    <Text style={{ color: "white", fontSize: 18 }}>Users ▼</Text>
  </TouchableOpacity>
</View>


      
      {showUsers && (
        <Animated.View
          style={{
            position: "absolute",
            top: userListAnim,
            right: 20,
            backgroundColor: "rgba(0,0,0,0.9)",
            borderRadius: 10,
            width: width * 0.9,
            maxHeight: 300, 
            padding: 10,
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
            zIndex: 9999,
          }}
        >
          {users.map((data, i) => (
            <TouchableOpacity
            onPress={() => navigation.navigate("Profile", {user: data })}
              key={i}
              style={{
                flexDirection: "row",
                marginBottom: 4,
                justifyContent: "space-between",
                backgroundColor:
                  i % 2 === 0 ? "hsl(10, 2.70%, 43.10%)" : "hsl(11, 9.10%, 65.50%)",
                padding: 10,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, color: "#fff" }}>{data.name}</Text>
              <Image
                source={{ uri: data.image }}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 25,
                  borderWidth: 2,
                  borderColor: "#fff",
                  marginRight: 4,
                }}
              />
            </TouchableOpacity>
          ))}

          
          <TouchableOpacity onPress={toggleUsers} style={{ marginTop: 10 }}>
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              ▲ Close Users
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <ScrollView><View style={{ alignItems: "center", justifyContent: "center", marginTop: 4, width: "100%" }}>
      {posts.map((data) => (
        <View key={data.name} style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
          {data.posts.map((child) => {
            return (
              <View
                key={child._id}
                style={{
                  borderWidth: 2,
                  borderColor: "gray",
                  alignSelf: "center",
                  width: "90%", 
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 8,
                  alignItems: "center",
                }}
              >
               
                {child.type === "image" && (
                  <Image
                    source={{ uri: child.url }}
                    style={{
                      width: "100%",
                      height: 300,
                      borderRadius: 8,
                      borderColor: "#fff",
                    }}
                    resizeMode="cover"
                  />
                )}

                
                {child.type === "video" && (
                  <View style={{ width: "100%", height: 300, position: "relative" }}>
                    <Video
                      ref={(ref) => (videoRefs.current[child._id] = ref)}
                      source={{ uri: child.url }}
                      rate={1.0}
                      volume={1.0} 
                      isMuted={false}
                      resizeMode="cover"
                      shouldPlay={videoStates[child._id] || false}
                      isLooping
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 8,
                      }}
                    />
                    
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: [{ translateX: -20 }, { translateY: -20 }],
                        backgroundColor: "rgba(0, 0, 0, 0.5)", 
                        borderRadius: 50,
                        padding: 10,
                      }}
                      onPress={() => togglePlay(child)}
                    >
                      <Ionicons name={videoStates[child._id] ? "pause" : "play"} size={30} color="white" />
                    </TouchableOpacity>
                  </View>
                )}

                <Text style={{ color: "rgb(234, 167, 68)", marginLeft: 4, fontSize: 16 }}>{child.caption}</Text>

                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                  
                  <TouchableOpacity onPress={() => navigation.navigate("Profile", { user: data })}>
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        borderRadius: 25,
                        borderWidth: 2,
                        borderColor: "#fff",
                        marginRight: 4,
                        marginTop: 10,
                      }}
                      source={{ uri: data.image }}
                    />
                  </TouchableOpacity>

                  <Text style={{ color: "white", padding: 4, marginTop: 4, marginRight: 4 }}>{data.name}</Text>

                  <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 4 }}>
                    
                    <Like
                      onPress={() => {
                        like(user.email, child._id);
                      }}
                      email={user.email}
                      child={child}
                    />

                    
                    <View>
                      <Comments child={child} user={user} onPress={() => api().then((data) => setUsers(data.data))} />
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View></ScrollView>
    </View>
  );
};
const Comments = ({ child, user, onPress }) => {
  const [input, setInput] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState(
    child.comments.length > 0 ? child.comments : [{ username: "No", text: "comments" }]
  );

  const data = {
    name: user.name,
    comment: input,
    id: child._id,
  };

  const sendComment = async () => {
    if (!input.trim()) return;

    try {
      const response = await axios.post("https://apkform-2.onrender.com/api/auth/comment", data);
      console.log(response.data);

      setComments([...comments, { username: user.name, text: input }]); // Update UI
      setInput(""); // Clear input
      onPress(); // Refresh parent if needed
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ position: "relative", alignItems: "flex-end", marginRight: 10 }}>
      {/* Comment Icon & Count */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Icon name="chatbubble-outline" size={24} color="#fff" />
        <Text style={{ color: "white", fontSize: 18, marginLeft: 4 }}>{child.comments.length}</Text>
      </TouchableOpacity>

      {/* Modal Popup for Comments */}
      <Modal
      
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        >
          <View
            style={{
              backgroundColor: "#222",
              padding: 16,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              minHeight: 300,
            }}
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ position: "absolute", right: 16, top: 10,zIndex:9999 }}
            >
              <Icon name="close" size={28} color="white" />
            </TouchableOpacity>

            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Comments
            </Text>

            {/* Comment List */}
            <FlatList
              data={comments}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    backgroundColor: "#333",
                    padding: 10,
                    borderRadius: 6,
                    marginBottom: 5,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>{item.username}</Text>
                  <Text style={{ color: "#ccc" }}>{item.text}</Text>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 200 }}
            />

            {/* Comment Input */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
                backgroundColor: "#333",
                padding: 8,
                borderRadius: 6,
              }}
            >
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Write a comment..."
                placeholderTextColor="black"
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderRadius: 4,
                  padding: 8,
                  fontSize: 14,
                }}
              />
              <TouchableOpacity onPress={sendComment} style={{ marginLeft: 10 }}>
                <Text style={{ color: "blue", fontSize: 16 }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};
const Like = ({ email, child ,onPress}) => {
  const [tt, setTt] = useState(false);
  const [count,setcount]=useState(child.likes)
  console.log(child._id)
  useEffect(() => {
    if (Array.isArray(child.likedby) && child.likedby.includes(email)) {
      setTt(true);
    } else {
      setTt(false);
    }
  }, [child.likedby, email]); // Run only when `likedby` or `email` changes

  const countit = () => {
    setcount((prev) => (tt ? prev - 1 : prev + 1));
  };
 
  return (
    
<TouchableOpacity
  style={{ marginRight: 16, marginTop: 3 }}
  onPress={() => {
    onPress();
    setTt(!tt);
    countit();
  }}
>
  <View style={{ position: "relative", width: 40, height: 24, flexDirection: "row", alignItems: "center" }}>
    {/* Outlined Heart */}
    <Icon name="heart-outline" size={24} color="#fff" style={{ position: "absolute" }} />

    {/* Filled Heart (Shown when liked) */}
    {tt && <Icon name="heart" size={24} color="#ff0000" style={{ position: "absolute" }} />}

    {/* Likes Count */}
    <Text style={{ color: "white", marginLeft: 30, fontSize: 18, paddingBottom: 4 }}>{count}</Text>
  </View>
</TouchableOpacity>
  );
};





const BACKEND_API_URL = "https://apkform-2.onrender.com/"; 


const PostScreen = ({route}) => {
  const [media, setMedia] = useState(null);
  const [type, setType] = useState(null);
  const [caption, setCaption] = useState(""); 
  const [uploading, setUploading] = useState(false);
const userEmail=route.params.email;
 
const pickMedia = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission Denied", "You need to allow access to media.");
    return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    setMedia(result.assets[0].uri);
    setType(result.assets[0].type.startsWith("video") ? "video" : "image");
    console.log("Selected file:", result.assets[0]);
  }
};

const uploadToCloudinary = async () => {
  if (!media) {
    Alert.alert("Error", "Please select an image or video first.");
    return;
  }

  setUploading(true);

  let formData = new FormData();
  formData.append("file", {
    uri: media,
    type: type === "video" ? "video/mp4" : "image/jpeg",
    name: type === "video" ? "upload.mp4" : "upload.jpg",
  });
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    console.log("Uploading file:", { uri: media, type });

    let response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${type === "video" ? "video" : "image"}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    let data = await response.json();
    console.log("Cloudinary Response:", data);

    if (data.secure_url) {
      console.log("Uploaded to Cloudinary:", data.secure_url);
      await sendToBackend(data.secure_url);
    } else {
      Alert.alert("Upload Failed", "Could not upload to Cloudinary.");
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    Alert.alert("Error", "Upload failed. Try again.");
  } finally {
    setUploading(false);
  }
};
console.log("typwww,",type,userEmail)
const sendToBackend = async (fileUrl) => {
  try {
    console.log("Sending Data:", {
      email: userEmail, 
      url: fileUrl,
      type: type,
      caption: caption
    });
const req= {
  email: userEmail, 
  url: fileUrl,
  type: type,
  caption: caption
}
    const response = await axios.post("https://apkform-2.onrender.com/api/auth/addpost",req);

    console.log("Backend Response:", response.data);
    Alert.alert("Success", "Post uploaded successfully!");
  } catch (error) {
    console.error("Backend API error:", error.response ? error.response.data : error.message);
    Alert.alert("Error", "Failed to send post to backend.");
  }
};

  return (
    <View style={{ padding: 20 }}>
      <Button title="Pick Image/Video" onPress={pickMedia} />
      {media && type === "image" && <Image source={{ uri: media }} style={{ width: 200, height: 200 }} />}
      {media && type === "video" && <Video source={{ uri: media }} style={{ width: 200, height: 200 }} shouldPlay />}
      
      
      <TextInput
        placeholder="Enter caption..."
        value={caption}
        onChangeText={(text) => setCaption(text)} 
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginVertical: 10,
          borderRadius: 5,
        }}
      />

      <Button title={uploading ? "Uploading..." : "Upload"} onPress={uploadToCloudinary} disabled={uploading} />
      {uploading && <ActivityIndicator size="large" color="blue" style={{ marginTop: 10 }} />}
    </View>
  );
};

const ProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const user = route.params.user || {};
  const [posts, setPosts] = useState([]);
console.log("userrrr",user)
  useEffect(() => {
    if (user.email) {
      fetchUserPosts(user.email);
    }
  }, []);
console.log(user)
  const fetchUserPosts = async (email) => {
    try {
      const response = await axios.get(`https://apkform-2.onrender.com/api/auth/get/${email}`);
      console.log(await response,"uuiuii")
      setPosts(response.data.user.posts || []);
      console.log(posts,"posts")
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  

  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

    
      <View style={styles.profileHeader}>
        <Image source={{ uri: user.image }} style={styles.profileImage} />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

     
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        contentContainerStyle={styles.postGrid}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
           {item.type==="image" &&  <Image source={{ uri: item.url }} style={styles.postImage} />}
           {item.type==="video" && <Video 
                      source={{ uri: item.url }}
                      rate={1.0}
                      volume={1.0} 
                      isMuted={false}
                      resizeMode="cover"
                      style={styles.postImage}
                      
                     />}
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black", padding: 10 },
  backButton: { marginBottom: 10, padding: 5 },
  backText: { color: "white", fontSize: 18 },
  profileHeader: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: "white" },
  userName: { color: "white", fontSize: 22, fontWeight: "bold", marginTop: 8 },
  userEmail: { color: "gray", fontSize: 16, marginBottom: 10 },
  postGrid: { alignItems: "center" },
  postContainer: { margin: 10, backgroundColor: "#222", borderRadius: 10, padding: 8 },
  postImage: { width: 140, height: 160, borderRadius: 8 },
  caption: { color: "white", marginTop: 4, textAlign: "center" },
});





const Stack = createStackNavigator();
export default function AppNavigator() {
  return (
   
      <Stack.Navigator>
        <Stack.Screen name="FormScreen" component={FormScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="UserScreen" component={UserScreen} />
        <Stack.Screen name="PostScreen" component={PostScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Reels" component={VideoReelsScreen}/>
      </Stack.Navigator>
  
  );
}

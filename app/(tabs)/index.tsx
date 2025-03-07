import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, FlatList } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const FormScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    const { name, email, number, address, password } = formData;
    if (!name || !email || !number || !address || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", formData);
      navigation.navigate("ResultScreen", { responseMessage: response.data.message });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-5 justify-center bg-gray-100">
      <Text className="text-lg font-bold mb-2">Name</Text>
      <TextInput className="border border-gray-300 p-3 mb-4 rounded-lg" value={formData.name} onChangeText={(text) => handleChange("name", text)} placeholder="Enter your name" />

      <Text className="text-lg font-bold mb-2">Email</Text>
      <TextInput className="border border-gray-300 p-3 mb-4 rounded-lg" value={formData.email} onChangeText={(text) => handleChange("email", text)} placeholder="Enter your email" keyboardType="email-address" />

      <Text className="text-lg font-bold mb-2">Number</Text>
      <TextInput className="border border-gray-300 p-3 mb-4 rounded-lg" value={formData.number} onChangeText={(text) => handleChange("number", text)} placeholder="Enter your phone number" keyboardType="phone-pad" />

      <Text className="text-lg font-bold mb-2">Address</Text>
      <TextInput className="border border-gray-300 p-3 mb-4 rounded-lg" value={formData.address} onChangeText={(text) => handleChange("address", text)} placeholder="Enter your address" />

      <Text className="text-lg font-bold mb-2">Password</Text>
      <TextInput className="border border-gray-300 p-3 mb-4 rounded-lg" value={formData.password} onChangeText={(text) => handleChange("password", text)} placeholder="Enter your password" secureTextEntry />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg" onPress={handleSubmit}>
          <Text className="text-white text-center font-bold">Submit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const ResultScreen = ({ route }) => {
  const { responseMessage } = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("http://localhost:3000");
        setResults(response.data);
        console.log(await results)
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to fetch results";
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <Text className="text-lg font-bold text-center mb-4">{responseMessage}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={results.data}
          keyExtractor={(item) =>JSON.stringify( item.id)}
          renderItem={({ item }) => (
            <View className="border border-gray-300 p-3 mb-2 rounded-lg">
              <Text className="font-bold text-black">Name: {item.name}</Text>
              <Text>Email: {item.email}</Text>
              <Text>Number: {item.number}</Text>
              <Text>Address: {item.address}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const Stack = createStackNavigator();
export default function AppNavigator() {
  return (
   
      <Stack.Navigator>
        <Stack.Screen name="FormScreen" component={FormScreen} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} />
      </Stack.Navigator>
  
  );
}

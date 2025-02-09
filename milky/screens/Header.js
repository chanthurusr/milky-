import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const [location, setLocation] = useState("Fetching location...");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();

  // Function to extract city & street from token
  const fetchAddressFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.warn("No token found!");
        setLocation("Select Location");
        setLoading(false);
        return;
      }

      // Decode the token
      const decodedToken = jwtDecode(token);

      if (decodedToken.address && decodedToken.address.city && decodedToken.address.street) {
        const formattedAddress = `${decodedToken.address.city}, ${decodedToken.address.street}`;
        setLocation(formattedAddress);
      } else {
        console.warn("City or street not found in token!");
        setLocation("Select Location");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setLocation("Select Location");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (route.params?.updatedAddress) {
      // If the address is updated, set it and stop loading
      setLocation(route.params.updatedAddress);
      setLoading(false);
    } else {
      // Otherwise, try to fetch it from the token
      fetchAddressFromToken();
    }
  }, [route.params?.updatedAddress]);

  return (
    <View style={styles.header}>
  <View style={styles.bottomRow}>
    <TouchableOpacity 
      style={styles.locationContainer} 
      onPress={() => navigation.navigate("LocationScreen")}
    > 
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="location" size={20} color="#00C4CC" />

        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.location}>{location || 'Select Location'}</Text>
            <Text style={styles.changeText}>Change Address</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
      <Ionicons name="person-circle" size={30} color="#000" />
    </TouchableOpacity>
  </View>
</View>

  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  locationContainer: {
    flex: 1,
    marginLeft: 10,
  },
  location: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  changeText: {
    fontSize: 12,
    color: "#007BFF",
  },
});

export default Header;

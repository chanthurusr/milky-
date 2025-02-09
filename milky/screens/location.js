import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

const LocationScreen = ({ route, navigation }) => {
  const [savedAddresses, setSavedAddresses] = useState([
    { id: "1", name: "Home", address: "123 Main St, City, Country" },
    { id: "2", name: "College", address: "456 College Ave, City, Country" },
  ]);
  const [liveLocation, setLiveLocation] = useState(null);

  useEffect(() => {
    startLiveTracking();
  }, []);

  const getLiveLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow location access to fetch your address.");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000,
    });

    if (!location) {
      Alert.alert("Location Error", "Unable to fetch location. Try again.");
      return;
    }

    let { latitude, longitude } = location.coords;

    let addressList = await Location.reverseGeocodeAsync({ latitude, longitude });

    if (addressList.length > 0) {
      let address = addressList[0];

      let formattedAddress = [
        address.name,
        address.street,
        address.city,
        address.region,
        address.postalCode,
        address.country,
      ]
        .filter((component) => component && !component.match(/^[\dA-Z]+\+[\dA-Z]+$/))
        .join(", ");

      formattedAddress = formattedAddress || "Unknown Location";

      Alert.alert(
        "Confirm Location",
        `Your detected location:\n\n${formattedAddress}`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Save",
            onPress: () => {
              const newAddress = { id: Date.now().toString(), name: "Live Location", address: formattedAddress };
              setSavedAddresses([...savedAddresses, newAddress]);

              // Navigate to the Company page after selecting the address
              navigation.navigate("Company", { updatedAddress: formattedAddress });
            },
          },
        ]
      );
    } else {
      Alert.alert("Location Error", "Could not fetch address. Try again.");
    }
  };

  const startLiveTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow location access for live tracking.");
      return;
    }

    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 5,
      },
      (location) => {
        setLiveLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    );
  };

  const handleSelectAddress = (address) => {
    // Navigate to the Company page after selecting the address
    navigation.navigate("Company", { updatedAddress: address });
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.search} placeholder="Search" />

      <TouchableOpacity onPress={getLiveLocation}>
        <Text style={styles.option}>
          <Text>📍 </Text>Use My Current Location
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ManualAddress")}>
        <Text style={styles.option}>
          <Text>➕ </Text>Add new address
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>SAVED ADDRESSES</Text>

      <FlatList
        data={savedAddresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.addressCard}>
            <Text style={styles.addressTitle}>
              <Text>🏠 </Text>{item.name}
            </Text>
            <Text>{item.address}</Text>
            <TouchableOpacity onPress={() => handleSelectAddress(item.address)}>
              <Text style={styles.selectText}>Select Address</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  search: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  option: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#007BFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  addressCard: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  selectText: {
    color: "#007BFF",
    marginTop: 5,
  },
});

export default LocationScreen;

import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons"; // You can choose other icon sets like FontAwesome, Ionicons, etc.

const ManualAddress = () => {
  const navigation = useNavigation();
  const [manualAddress, setManualAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleSaveAddress = () => {
    if (!manualAddress.street || !manualAddress.city || !manualAddress.state || !manualAddress.pincode) {
      alert("Please fill in all fields.");
      return;
    }
    alert(`Address Saved: ${manualAddress.street}, ${manualAddress.city}, ${manualAddress.state}, ${manualAddress.pincode}`);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Enter Address Manually</Text>

        {/* Street Input with Icon */}
        <View style={styles.inputContainer}>
          <Icon name="location-on" size={24} color="#007BFF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Street"
            placeholderTextColor="#999"
            value={manualAddress.street}
            onChangeText={(text) => setManualAddress({ ...manualAddress, street: text })}
          />
        </View>

        {/* City Input with Icon */}
        <View style={styles.inputContainer}>
          <Icon name="location-city" size={24} color="#007BFF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#999"
            value={manualAddress.city}
            onChangeText={(text) => setManualAddress({ ...manualAddress, city: text })}
          />
        </View>

        {/* State Input with Icon */}
        <View style={styles.inputContainer}>
          <Icon name="map" size={24} color="#007BFF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="State"
            placeholderTextColor="#999"
            value={manualAddress.state}
            onChangeText={(text) => setManualAddress({ ...manualAddress, state: text })}
          />
        </View>

        {/* Pincode Input with Icon */}
        <View style={styles.inputContainer}>
          <Icon name="markunread-mailbox" size={24} color="#007BFF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={manualAddress.pincode}
            onChangeText={(text) => setManualAddress({ ...manualAddress, pincode: text })}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
          <Text style={styles.saveButtonText}>Save Address</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ManualAddress;
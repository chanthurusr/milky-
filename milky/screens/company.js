import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "./Header";
import Footer from "./Footer";
import Imageer from "./image";

const Company = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // Search state

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("http://192.168.85.238:5000/Company");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Milk", { company: item.name })}
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name || 'No Name Available'}</Text>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
        <Text style={styles.address}>{item.address || 'No Address Available'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Imageer />
      <Header />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Company"
          style={styles.searchInput}
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
        <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
      </View>

      {/* List of Companies */}
      <FlatList
        data={data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E9F4FB" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    backgroundColor: "#fff",
  },
  searchIcon: { marginLeft: -30 },
  listContainer: { paddingHorizontal: 10 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  image: { width: 60, height: 60, borderRadius: 10 },
  cardContent: { flex: 1, marginLeft: 10 },
  name: { fontSize: 16, fontWeight: "bold" },
  rating: { fontSize: 14, color: "#666", marginVertical: 5 },
  address: { fontSize: 12, color: "#999" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default Company;

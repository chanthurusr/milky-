import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import Header from "./Header";
import Footer from "./Footer";
import Imageer from "./image";
const Milk = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { company } = route.params || {};

  const [milkData, setMilkData] = useState([]);
  const [cart, setCart] = useState({});

  // Calculate the total number of items in the cart
  const totalCartItems = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);

  // Calculate the total price of the items in the cart
  const totalPrice = milkData.reduce((total, item) => {
    if (cart[item._id]) {
      return total + item.price * cart[item._id];
    }
    return total;
  }, 0);

  useEffect(() => {
    const fetchMilkData = async () => {
      try {
        const response = await fetch(`http://192.168.85.238:5000/Milk?companyName=${company}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        setMilkData(result);
      } catch (error) {
        console.error("Error fetching milk data:", error);
      }
    };

    if (company) fetchMilkData();
  }, [company]);

  const handleAddToCart = (item) => {
    setCart((prev) => ({ ...prev, [item._id]: 1 }));
  };

  const handleIncrease = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDecrease = (id) => {
    setCart((prev) => {
      if (prev[id] === 1) {
        const updatedCart = { ...prev };
        delete updatedCart[id];
        return updatedCart;
      }
      return { ...prev, [id]: prev[id] - 1 };
    });
  };

  const handleViewCart = () => {
    if (totalCartItems > 0) {
      navigation.navigate("Order", { cart, totalCartItems, totalPrice, milkData , company });
    } else {
      Alert.alert("Your cart is empty!");
    }
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.milkname}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
        <Text style={styles.description}>{item.description}</Text>

        {/* Hide "Add" button when item is in the cart */}
        {cart[item._id] ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => handleDecrease(item._id)} style={styles.quantityButton}>
              <Ionicons name="remove" size={16} color="black" />
            </TouchableOpacity>
            <Text style={styles.quantityCount}>{cart[item._id]}</Text>
            <TouchableOpacity onPress={() => handleIncrease(item._id)} style={styles.quantityButton}>
              <Ionicons name="add" size={16} color="black" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => handleAddToCart(item)} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <Image source={{ uri: item.image }} style={styles.image} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Imageer />
      <Header />
      <Text style={styles.companyName}>{company}</Text>

      {milkData.length === 0 ? (
        <Text style={styles.noDataText}>No milk products available for this company.</Text>
      ) : (
        <FlatList
          data={milkData}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* View Cart Button - Always Visible */}
      {totalCartItems > 0 && (
        <TouchableOpacity style={styles.viewCartButton} onPress={handleViewCart}>
          <Text style={styles.viewCartButtonText}>
            View Cart ({totalCartItems}) - ₹{totalPrice.toFixed(2)}
          </Text>
        </TouchableOpacity>
      )}

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  companyName: { fontSize: 18, fontWeight: "bold", color: "#000", textAlign: "center", marginVertical: 10 },
  listContainer: { paddingHorizontal: 10 },
  noDataText: { textAlign: "center", fontSize: 16, marginTop: 20, color: "#666" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    justifyContent: "space-between",
  },
  textContainer: { flex: 1, marginRight: 10, justifyContent: "space-between" },
  image: { width: "40%", aspectRatio: 6 / 4, borderRadius: 6, marginLeft: 10 },
  name: { fontSize: 16, fontWeight: "600", color: "#000" },
  price: { fontSize: 14, color: "#000" },
  rating: { fontSize: 12, color: "#666" },
  description: { fontSize: 11, color: "#777" },
  addButton: {
    backgroundColor: "#006A4E",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  addButtonText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  quantityContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  quantityButton: { backgroundColor: "#ddd", borderRadius: 12, padding: 4, marginHorizontal: 4 },
  quantityCount: { fontSize: 14, fontWeight: "bold", color: "#000" },
  viewCartButton: {
    backgroundColor: "#0000FF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 0,
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  viewCartButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default Milk;

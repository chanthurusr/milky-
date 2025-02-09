import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Footer from "./Footer";
import Imageer from "./image";

const Order = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { cart, totalCartItems, totalPrice, milkData, company } = route.params || {};

  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderItem = ({ item }) => {
    const quantity = cart?.[item._id] || 0;
    const price = Number(item.price) || 0; // Ensure price is a valid number
    const itemTotal = price * quantity;
    const gst = itemTotal * 0.05; // 5% GST
    const finalTotal = itemTotal + gst;

    return (
      <Animated.View style={[styles.itemContainer, { opacity: fadeAnim }]}>
        <Text style={styles.itemName}>{item.milkname || "Unnamed Milk"}</Text>
        <Text style={styles.itemPrice}>Price: ₹{price.toFixed(2)}</Text>
        <Text style={styles.itemQuantity}>Quantity: {quantity}</Text>
        <Text style={styles.itemTotal}>Total: ₹{itemTotal.toFixed(2)}</Text>
      </Animated.View>
    );
  };

  const orderItems = milkData?.filter((item) => cart[item._id]) || [];
  const totalGST = totalPrice * 0.05; // 5% GST
  const deliveryCharge = 20;
  const grandTotal = totalPrice + totalGST + deliveryCharge - discountAmount;

  const handleApplyDiscount = () => {
    if (discountCode === "SAVE10") {
      setDiscountAmount(10); // Apply a discount of ₹10
      setDiscountApplied(true);
      Alert.alert("Success", "Discount applied successfully!");
    } else {
      setDiscountAmount(0);
      setDiscountApplied(false);
      Alert.alert("Invalid Code", "The discount code is invalid.");
    }
  };

  const navigateToPayment = () => {
    navigation.navigate("PaymentPa", {
      cart,
      totalCartItems,
      totalPrice,
      milkData,
      grandTotal,
      companyName: company,
    });
  };

  return (
    <View style={styles.container}>
      <Imageer />
      <Text style={styles.companyName}>{company || "No Company Name"}</Text>
      <Text style={styles.header}>Order Summary</Text>

      <FlatList
        data={orderItems}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.discountTitle}>Discount or Coupon</Text>
        <View style={styles.discountContainer}>
          <TextInput
            style={styles.discountInput}
            placeholder="Enter Discount or Coupon Code"
            value={discountCode}
            onChangeText={setDiscountCode}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyDiscount}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Items: {totalCartItems}</Text>
        <Text style={styles.totalText}>Subtotal: ₹{totalPrice.toFixed(2)}</Text>
        <Text style={styles.totalText}>GST (5%): ₹{totalGST.toFixed(2)}</Text>
        <Text style={styles.totalText}>Delivery Charge: ₹{deliveryCharge.toFixed(2)}</Text>
        {discountApplied && (
          <Text style={styles.discountText}>Discount: -₹{discountAmount.toFixed(2)}</Text>
        )}
        <Text style={styles.finalAmount}>Grand Total: ₹{grandTotal.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={navigateToPayment}>
        <Text style={styles.payButtonText}>Proceed to Payment</Text>
      </TouchableOpacity>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  itemTotal: {
    fontSize: 14,
    color: "#006A4E",
    marginTop: 5,
  },
  totalContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  discountText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 10,
  },
  finalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d32f2f",
    marginTop: 10,
  },
  discountTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  applyButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  payButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default Order;

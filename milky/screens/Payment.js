import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
  ScrollView, Animated, Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Footer from "./Footer";
import Imageer from './image';

export default function PaymentPa({ route, navigation }) {
  const { cart, milkData, grandTotal, companyName } = route.params || {};
  const [paymentMethod, setPaymentMethod] = useState('');
  const [upiId, setUpiId] = useState('9597655559@ibl'); // Pre-filled UPI ID
  const [userDetails, setUserDetails] = useState({ name: 'chanthuru' }); // Pre-filled username
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.warn('No token found!');
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(token);
        if (decodedToken) {
          setUserDetails(decodedToken);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePayment = async () => {
    if (!paymentMethod) {
      console.warn('Please select a payment method.');
      return;
    }

    if (paymentMethod === 'UPI' && upiId.trim() === '') {
      console.warn('Please enter a valid UPI ID.');
      return;
    }

    // If Google Pay / PhonePe is selected, open the respective app
    if (paymentMethod === 'Google Pay / PhonePe') {
      const googlePayUrl = `tez://upi/pay?pa=${upiId}&pn=${userDetails?.name}&am=${grandTotal}&cu=INR`;
      const phonePeUrl = `phonepe://upi/pay?pa=${upiId}&pn=${userDetails?.name}&am=${grandTotal}&cu=INR`;

      try {
        // Try to open Google Pay first
        const canOpenGooglePay = await Linking.canOpenURL(googlePayUrl);
        if (canOpenGooglePay) {
          await Linking.openURL(googlePayUrl);
          return;
        }

        // If Google Pay is not available, try to open PhonePe
        const canOpenPhonePe = await Linking.canOpenURL(phonePeUrl);
        if (canOpenPhonePe) {
          await Linking.openURL(phonePeUrl);
          return;
        }

        // If neither app is available, show a warning
        console.warn('Google Pay or PhonePe is not installed on this device.');
        return;
      } catch (error) {
        console.error('Error opening payment app:', error);
        return;
      }
    }

    // Proceed with the normal payment flow for other methods
    const orderData = {
      userDetails,
      cart,
      milkData,
      grandTotal,
      companyName,
      paymentMethod,
      upiId: paymentMethod === 'UPI' ? upiId : '',
    };

    try {
      const response = await fetch("http://192.168.85.238:5000/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Order placed successfully:", data);
        navigation.navigate('OrderConfirmation', { userDetails, cart, milkData, grandTotal, companyName, paymentMethod });
      } else {
        console.error("Order failed:", data.error);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Imageer />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.content}>
            {/* User Details Card */}
            <View style={styles.card}>
              <Text style={styles.header}>{userDetails?.name || 'User Name'}</Text>
              <Text style={styles.text}>{userDetails?.address?.street || 'Address'}</Text>
              <Text style={styles.text}>{userDetails?.address?.city || 'City'}</Text>
              <Text style={styles.text}>Phone: {userDetails?.contactNumber || 'N/A'}</Text>
            </View>

            {/* Company Name Card */}
            {companyName && (
              <View style={styles.card}>
                <Text style={styles.header}>{companyName}</Text>
              </View>
            )}

            {/* Product Summary Card */}
            <View style={styles.card}>
              <Text style={styles.header}>Product Summary</Text>
              {milkData?.map((item) => {
                const quantity = cart[item._id] || 0;
                return (
                  quantity >= 1 && (
                    <View key={item._id} style={styles.itemRow}>
                      <Text style={styles.itemText}>{item.milkname}</Text>
                      <Text style={styles.itemText}>₹{(Number(item.price) || 0).toFixed(2)}</Text>
                      <Text style={styles.itemText}>Qty: {quantity}</Text>
                      <Text style={styles.itemText}>Subtotal: ₹{(item.price * quantity).toFixed(2)}</Text>
                    </View>
                  )
                );
              })}
              <Text style={styles.grandTotal}>Grand Total: ₹{grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Payment Section */}
      <View style={styles.paymentSection}>
        <Text style={styles.header}>Choose Payment Method</Text>
        {['Cash', 'Google Pay / PhonePe', 'UPI'].map((method) => (
          <TouchableOpacity
            key={method}
            style={[styles.option, paymentMethod === method && styles.selectedOption]}
            onPress={() => {
              setPaymentMethod(method);
              if (method === 'Google Pay / PhonePe') {
                handlePayment(); // Trigger the payment immediately
              }
            }}>
            <Text style={styles.text}>{method}</Text>
            <View style={styles.radio}>{paymentMethod === method && <View style={styles.selected} />}</View>
          </TouchableOpacity>
        ))}

        {paymentMethod === 'UPI' && (
          <TextInput
            style={styles.input}
            placeholder="Enter UPI ID"
            value={upiId}
            onChangeText={setUpiId}
            placeholderTextColor="#999"
          />
        )}

        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payText}>Confirm Payment</Text>
        </TouchableOpacity>
      </View>

      <Footer />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    padding: 20,
  },
  content: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  itemText: {
    fontSize: 14,
  },
  grandTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  paymentSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    margin: 20,
    elevation: 3,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
  },
  selectedOption: {
    borderColor: '#6200ee',
    backgroundColor: '#e0e0e0',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6200ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6200ee',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  payButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },
  payText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';  // Import axios for API calls
import Imageer from './image';
import Footer from './Footer';

const OrderScreen = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
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
          
          // Fetch orders from backend
          const response = await axios.get(`http://192.168.85.238:5000/orders/${decodedToken.email}`);

          setOrders(response.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />;
  }

  return (
    <View style={styles.mainContainer}>
      <Imageer />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Order Details</Text>

        {/* User Details Card */}
        {userDetails && (
          <View style={styles.userCard}>
            <Text style={styles.userText}>
              <Text style={styles.boldText}>Name:</Text> {userDetails.name || 'N/A'}
            </Text>
            <Text style={styles.userText}>
              <Text style={styles.boldText}>Address:</Text> 
              {userDetails?.address?.street || 'Street not available'}, {userDetails?.address?.city || 'City not available'}
            </Text>
            <Text style={styles.userText}>
              <Text style={styles.boldText}>Phone:</Text> {userDetails.contactNumber || 'N/A'}
            </Text>
          </View>
        )}

        {/* Order List */}
        {orders.length > 0 ? (
          orders.map((order) => (
            <View key={order._id} style={styles.orderCard}>
              <Text style={styles.boldText}>Shop name : {order.companyName}</Text>
              <Text>Payment: {order.paymentMethod}</Text>
              <Text>Status: {order.status}</Text>
              <Text style={styles.boldText}>Items:</Text>
              {order.cart.map((item) => (
                <Text key={item.productId}>
                  {item.name} - {item.quantity} x ₹{item.price}
                </Text>
              ))}
              <Text style={styles.boldText}>Total: ₹{order.grandTotal}</Text>
            </View>
          ))
        ) : (
          <View style={styles.noOrderBox}>
            <Image
              source={{ uri: 'https://emojipedia-us.s3.amazonaws.com/source/skype/289/face-screaming-in-fear_1f631.png' }}
              style={styles.emoji}
            />
            <Text style={styles.noOrderText}>No Orders Found</Text>
          </View>
        )}
      </ScrollView>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  userCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    elevation: 3,
  },
  orderCard: {
    backgroundColor: '#e6f7ff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
    elevation: 3,
  },
  userText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  noOrderBox: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  emoji: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  noOrderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrderScreen;

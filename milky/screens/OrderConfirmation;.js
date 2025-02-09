import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

const OrderConfirmation = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.iconBackground}>
          <Check size={50} color="black" />
        </View>
      </View>
      <Text style={styles.title}>Your order is Confirmed!</Text>
      <Text style={styles.subtitle}>Thanks for your order...</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Company')}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconBackground: {
    borderWidth: 2,
    borderColor: '#6a0dad',
    padding: 20,
    borderRadius: 50,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6a0dad',
    marginBottom: 30,
  },
  button: {
    borderWidth: 1,
    borderColor: '#6a0dad',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#6a0dad',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderConfirmation;
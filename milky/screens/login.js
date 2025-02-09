import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  Text, 
  StyleSheet, 
  Image, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Imageer from "./image";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.85.238:5000/Login', {  // Update URL to match your backend API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        Alert.alert('Error', `Login failed: ${errorMessage}`);
        return;
      }

      let result;
      try {
        result = await response.json();
      } catch (error) {
        Alert.alert('Error', 'Invalid JSON response');
        return;
      }

      if (result.token) {
        // Save the token in AsyncStorage
        await AsyncStorage.setItem('token', result.token);
        
       
        navigation.navigate('Company'); // Navigate to the next screen after login
      } else {
        Alert.alert('Error', 'No token received');
      }
      
    } catch (error) {
      console.error('Network Error:', error.message);
      Alert.alert('Error', 'Network request failed');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Imageer />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.logoContainer}>
              <Image
                source={{
                  uri: 'https://res.cloudinary.com/dw5gs63nn/image/upload/v1738069085/logo_j6utdd.png',
                }}
                style={styles.logo}
              />
            </View>
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <Button title="Login" onPress={handleLogin} />
              <Text style={styles.switchText}>
                Don't have an account?{' '}
                <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
                  Sign up
                </Text>
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 250,
  },
  formContainer: {
    width: '100%',  // Full width
    paddingBottom: 30, // Added some padding to avoid keyboard overlap
  },
  input: {
    height: 40,
    width: '100%',  // Full width for the inputs
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
  switchText: {
    textAlign: 'center',
    marginTop: 20,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',  // Center content vertically
    paddingBottom: 20,  // Added padding at the bottom to avoid hiding the last input
  },
});

export default Login;

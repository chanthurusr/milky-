import React, { useState } from 'react';
import Imageer from './image';
import { 
  View, 
  TextInput, 
  Button, 
  Text, 
  StyleSheet, 
  Image, 
  Alert, 
  Keyboard, 
  Platform, 
  ScrollView, 
  KeyboardAvoidingView, 
  TouchableWithoutFeedback 
} from 'react-native';

const Signup = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const handleSignup = async () => {
    if (password !== rePassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const userData = {
      name,
      email,
      contactNumber,
      address: {
        street,
        city,
        district,
        state,
      },
      password,
    };

    try {
      const response = await fetch('http://192.168.85.238:5000/Signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        Alert.alert('Error', `Server error: ${errorMessage}`);
        return;
      }

      const result = await response.json();
     
      navigation.navigate('Login');
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust for iOS safe area
      >
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
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Contact Number"
                keyboardType="phone-pad"
                value={contactNumber}
                onChangeText={setContactNumber}
              />
              <TextInput
                style={styles.input}
                placeholder="Street"
                value={street}
                onChangeText={setStreet}
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
              />
              <TextInput
                style={styles.input}
                placeholder="District"
                value={district}
                onChangeText={setDistrict}
              />
              <TextInput
                style={styles.input}
                placeholder="State"
                value={state}
                onChangeText={setState}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Re-enter Password"
                secureTextEntry
                value={rePassword}
                onChangeText={setRePassword}
              />
              <Button title="Sign Up" onPress={handleSignup} />
              <Text style={styles.switchText}>
                Already have an account?{' '}
                <Text
                  style={styles.link}
                  onPress={() => navigation.navigate('Login')}
                >
                  Log in
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
    width: '100%',
  },
  input: {
    height: 40,
    width: '100%',
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
    justifyContent: 'flex-start',
    paddingBottom: 20, // Added padding to prevent content being pushed up
  },
});

export default Signup;
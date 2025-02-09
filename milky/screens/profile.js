import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const Profile = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserDetails(decodedToken);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#00C4CC" style={styles.loader} />;
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userDetailsWrapper}>
        <View style={styles.profileIconWrapper}>
          <Icon name="user" size={60} color="#fff" style={styles.profileIcon} />
        </View>
        <View style={styles.detailsWrapper}>
          <Text style={styles.name}>{userDetails?.name || 'User Name'}</Text>
          <Text style={styles.info}>{userDetails?.email ? userDetails.email : 'Email not available'}</Text>
          <Text style={styles.info}>{userDetails?.contactNumber ? userDetails.contactNumber : 'Phone not available'}</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <MenuItem icon="user" label="Edit Profile" actionIcon="edit-2" />
        <MenuItem icon="shield" label="Security" actionIcon="chevron-right" />
        <MenuItem icon="bell" label="Notifications" actionIcon="chevron-right" />
        <MenuItem icon="mail" label="My Subscription" actionIcon="chevron-right" />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={20} color="#fff" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const MenuItem = ({ icon, label, actionIcon }) => (
  <TouchableOpacity style={styles.menuItem}>
    <Icon name={icon} size={20} color="#00C4CC" style={styles.menuIcon} />
    <Text style={styles.menuLabel}>{label}</Text>
    <Icon name={actionIcon} size={20} color="#aaa" style={styles.actionIcon} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
    position: 'relative',
  },
  userDetailsWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileIconWrapper: {
    width: 120,
    height: 120,
    backgroundColor: '#00C4CC',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileIcon: {},
  detailsWrapper: {
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  info: {
    fontSize: 14,
    color: '#777',
    marginTop: 3,
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  actionIcon: {
    color: '#aaa',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4C4C',
    paddingVertical: 15,
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/login"; 
import Signup from "../screens/Signup"; 
import Home from "../screens/home"; 
import Company from "../screens/company"; 
import Milk from "../screens/Milk"; 
import LocationScreen from "../screens/location"; 
import ManualAddress from "../screens/ManualAddress"; 
import Order from "../screens/Order"; 
import Header from "../screens/Header"; 
import PaymentPa from "../screens/Payment"; 
import OrderConfirmation from "../screens/OrderConfirmation;"; 
import Profile from "../screens/profile"; 
import NoOrderScreen from "../screens/NoOrderScreen;"; 
const Stack = createStackNavigator();

export default function RootLayout() {
  return (
  
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }} 
        />
         <Stack.Screen 
          name="NoOrderScreen" 
          component={NoOrderScreen} 
          options={{ title: "NoOrderScreen" }} 
        />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ title: "Login" }} 
        />
        <Stack.Screen 
          name="Signup" 
          component={Signup} 
          options={{ title: "Signup" }} 
        />
          <Stack.Screen 
          name="Company" 
          component={Company} 
          options={{ title: "Company" }} 
        />
          <Stack.Screen 
          name="Profile" 
          component={Profile} 
          options={{ title: "Profile" }} 
        />
        <Stack.Screen 
          name="LocationScreen"  
          component={LocationScreen} 
          options={{ title: "LocationScreen" }} 
        />
        {/* <Stack.Screen 
          name="Header"  
          component={Header} 
          options={{ title: "Header" }} 
        /> */}

            <Stack.Screen 
          name="Milk" 
          component={Milk} 
          options={{ title: "Milk" }} 
        />
         <Stack.Screen 
          name="ManualAddress" 
          component={ManualAddress} 
          options={{ title: "ManualAddress" }} 
        />
             <Stack.Screen 
          name="Order" 
          component={Order} 
          options={{ title: "Order" }} 
        />
         <Stack.Screen 
          name="PaymentPa" 
          component={PaymentPa} 
          options={{ title: "PaymentPa" }} 
        />
            <Stack.Screen 
          name="OrderConfirmation" 
          component={OrderConfirmation} 
          options={{ title: "OrderConfirmation" }} 
        />
          
      </Stack.Navigator>
    
  );
}

import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useFonts } from "expo-font";

const Home = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Nosifer: require("../assets/fonts/Nosifer-Regular.ttf"), // Nosifer font
    Niramit: require("../assets/fonts/Niramit.ttf"), // Niramit font
  });

  if (!fontsLoaded) {
    return null; // Render nothing until fonts are loaded
  }

  return (
    <View style={styles.container}>
      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Logo and Tagline */}
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: "https://res.cloudinary.com/dw5gs63nn/image/upload/v1738069085/logo_j6utdd.png" }}
          style={styles.logo}
        />
        <Text style={styles.tagline}>Elevate Your Moments with Milky Slong.</Text>
      </View>

      {/* Centered Delivery Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: "https://res.cloudinary.com/dw5gs63nn/image/upload/v1738067867/milk-delivery-man-delivering-to-house-vector-illustration-42128556-removebg-preview_x6fhni.png",
          }}
          style={styles.deliveryImage}
        />
      </View>

      {/* Bottom Section with SIGN UP Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signupText}>SIGN UP</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footerText}>"Timeless Taste, Crafted for You"</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between", // Ensures proper spacing
  },
  loginButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  loginText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  tagline: {
    fontSize: 16,
    color: "#6c63ff",
    marginTop: 10,
    textAlign: "center",
  },
  imageContainer: {
    flex: 1, // This ensures the image stays centered
    justifyContent: "center",
    alignItems: "center",
  },
  deliveryImage: {
    width: 300,
    height: 250,
    resizeMode: "contain",
  },
  bottomContainer: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 30, // Ensures button stays at the bottom
  },
  signupButton: {
    backgroundColor: "#28a745", // Green color for sign-up button
    paddingVertical: 18,
    paddingHorizontal: 55,
    borderRadius: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  signupText: {
    color: "#fff",
    fontSize: 24, // Bigger font size
    fontFamily: "Nosifer", // Nosifer font for sign-up button text
  },
  footerText: {
    marginTop: 10,
    fontStyle: "italic",
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    fontFamily: "Niramit", // Niramit font for footer text
  },
});

export default Home;

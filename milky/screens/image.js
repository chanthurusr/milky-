import React from "react";
import { View, Image, StyleSheet } from "react-native";

const Imageer = () => {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Image 
          source={{ uri: "https://res.cloudinary.com/dw5gs63nn/image/upload/v1738069085/logo_j6utdd.png" }} 
          style={styles.topImageLeft} 
        />
        <Image 
          source={{ uri: "https://res.cloudinary.com/dw5gs63nn/image/upload/v1738570740/milky_rof0lg.jpg" }} 
          style={styles.topImageRight} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 0, // Remove bottom padding
    marginBottom: 0,  // Ensure no bottom margin
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topImageLeft: {
    width: 80,
    height: 50,
    resizeMode: "contain",
  },
  topImageRight: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});

export default Imageer;

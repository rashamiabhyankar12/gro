import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ref, onValue, remove } from "firebase/database";
import { db } from "../../Firebaseconfig";
import { imageMap } from "../Utils/imageMap";
import { myColors } from "../Utils/MyColors";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const nav = useNavigation();

  // Load wishlist from Firebase
  useEffect(() => {
    const wishlistRef = ref(db, "WishListDetail");
    const unsubscribe = onValue(wishlistRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const wishlistData = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setWishlist(wishlistData);
      } else {
        setWishlist([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Remove item from wishlist
  const removeFromWishlist = async (id) => {
    const itemRef = ref(db, "WishListDetail/" + id);
    await remove(itemRef);
  };

  // Render each wishlist item
  const renderItem = ({ item }) => {
  const { ProductName = "", Price = 0, Image: ImageFile = "" } = item;

let imageSource ;



if (item.ImageFile) {
  if (imageMap[item.ImageFile]) {
    imageSource = imageMap[item.ImageFile]; // local asset
  } else {
    imageSource = { uri: item.ImageFile };  // remote URL
  }
} 
 

  return (
    <View style={{
      flexDirection: "row",
      backgroundColor: "white",
      marginVertical: 8,
      borderRadius: 10,
      padding: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
    }}>
      <Image
       
        resizeMode="contain"
        style={{ width: 80, height: 80, borderRadius: 10 }}
         source={{ imageSource }}

      />
      <View style={{ flex: 1, marginLeft: 10, justifyContent: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: "black" }}>
          {String(ProductName)}
        </Text>
        <Text style={{ fontSize: 16, color: "grey", marginTop: 4 }}>
          ₹ {String(Price)}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => removeFromWishlist(item.id)}
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: 8,
          padding: 8,
          alignSelf: "center",
        }}
      >
        <Ionicons name="trash" size={22} color="red" />
      </TouchableOpacity>
    </View>
  );
};


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar backgroundColor="white" />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}
      >
        <Ionicons
          name="chevron-back"
          size={28}
          color="black"
          onPress={() => nav.goBack()}
        />
        <Text style={{ fontSize: 22, fontWeight: "700", color: "black" }}>
          My Wishlist
        </Text>
        <View style={{ width: 28 }} /> {/* Spacer for symmetry */}
      </View>

      {wishlist.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 18, color: "grey" }}>No items in wishlist</Text>
        </View>
      ) : (
        <FlatList
  data={wishlist}
  keyExtractor={(item) => String(item.id)}
  renderItem={renderItem}
  contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
/>

      )}
    </SafeAreaView>
  );
};

export default Wishlist;
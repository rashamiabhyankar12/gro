import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import DropBox from "../Components/DropBox";
import { myColors } from "./../Utils/MyColors";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Redux/CartSlice";
import { ref, onValue,set, remove } from "firebase/database";
import { imageMap } from "../Utils/imageMap";
import Login from "./Login";
import { db ,authentication } from "../../Firebaseconfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Details = ({ route }) => {
  const storeData = useSelector((state) => state.CartSlice);
  const dispatch = useDispatch();
const [products, setProducts] = useState([]); // ✅ state declared at top level
 const [wishlist, setWishlist] = useState([]);
// Load wishlist
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
      }
    });
    return () => unsubscribe();
  }, []);

  const nav = useNavigation();
const { Id } = route.params;
const [isFavorite, setIsFavorite] = useState(false);

useEffect(() => {
  const itemsRef = ref(db, "Products");

  const unsubscribe = onValue(itemsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const productsData = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));
      setProducts(productsData); // ✅ assign productsData directly
    }
  });

  return () => unsubscribe(); // cleanup listener
}, []);

  const productData = products.find(p => p.Id === route.params.Id) || {};
  
useEffect(() => {
  const getEmail = async () => {
    const email = await AsyncStorage.getItem("userEmail");
    setUserEmail(email);
  };
  getEmail();
}, []);

const user = authentication.currentUser;
const userEmail = user ? user.email : null;


const {
  ProductName = "",
  Price = 0,
  Desription = "",
  Origin = "",
  Brand = "",
  
 Image: ImageFile = "" 
 
} = productData;
// Normalize image source
let imageSource ;

if (ImageFile) {
  if (imageMap[ImageFile]) {
    imageSource = imageMap[ImageFile];   // local asset
  } else if (typeof ImageFile === "string") {
    imageSource = { uri: ImageFile };    // remote URL
  } 
} 


  return (
    <SafeAreaView style={{ flex: 1, gap: 20, backgroundColor: "white" }}>
      <StatusBar backgroundColor="white" />
      <View>
        

        <Image
          resizeMode="contain"
          style={{
            height: 300,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
           source={imageSource}


 
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            position: "absolute",
            width: "100%",
            paddingHorizontal: 15,
            alignItems: "center",
          }}
        >
          <Ionicons
            onPress={() => {
              nav.goBack();
            }}
            name="chevron-back"
            size={28}
            color="black"
          />
          <Feather name="share" size={28} color="black" />
        </View>
      </View>
      <View
        style={{ paddingHorizontal: 15, backgroundColor: "white", flex: 1 }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 25, color: "black", fontWeight: "600" }}>
            {ProductName.charAt(0).toUpperCase() + ProductName.slice(1)}
          </Text>

         <TouchableOpacity
  onPress={async () => {
    const wishlistRef = ref(db, "WishListDetail/" + Id);

    if (isFavorite) {
      // ✅ remove from wishlist
      await remove(wishlistRef);
      setIsFavorite(false);
    } else {
      // ✅ add to wishlist
      await set(wishlistRef, {
        userId:userEmail,
        productId: Id,
        ProductName,
        Price,
        ImageFile
        
      });
      setIsFavorite(true);
      nav.navigate("Wishlist"); 
    }
  }}
>
  <MaterialIcons
    name={isFavorite ? "favorite" : "favorite-border"}
    size={30}
    color={isFavorite ? "red" : "black"}
  />
</TouchableOpacity>

        </View>
        <Text style={{ marginTop: 5, fontSize: 15, color: "grey" }}>
          Price
        </Text>
        <Text
          style={{
            marginTop: 5,
            fontSize: 28,
            color: "black",
            fontWeight: "bold",
          }}
        >
          ₹ {Price}
        </Text>
        <DropBox Id={Id} />
        <View
          style={{
            flex: 0.9,
            justifyContent: "flex-end",
          }}
        >
          {storeData.some((value) => value.ProductName == productData.ProductName) ? (
            <TouchableOpacity
              disabled={true}
              activeOpacity={0.8}
              style={{
                backgroundColor: "#E3E3E3",
                borderRadius: 10,
                height: 70,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "black", fontSize: 18, fontWeight: "700" }}>
                Added to Basket
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                dispatch(addToCart(productData));
                nav.navigate("Cart");
              }}
              activeOpacity={0.8}
              style={{
                backgroundColor: myColors.primary,
                borderRadius: 10,
                height: 70,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
                Add to Basket
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Details;

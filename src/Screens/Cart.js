import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { imageMap } from "../Utils/imageMap";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { myColors } from "../Utils/MyColors";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "../../Redux/CartSlice";
import { useNavigation } from "@react-navigation/native";
import { ref, set, push } from "firebase/database";
import { db ,authentication } from "../../Firebaseconfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Cart = () => {
  const nav = useNavigation();
  const dispatch = useDispatch();
  const storeData = useSelector((state) => state.CartSlice);

let imageSource;
let amount = 0;
storeData.forEach((element) => {
  amount += element.Price * element.quantity;
});
useEffect(() => {
  const getEmail = async () => {
    const email = await AsyncStorage.getItem("userEmail");
    setUserEmail(email);
  };
  getEmail();
}, []);

const user = authentication.currentUser;
const userEmail = user ? user.email : null;
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: "white",
        gap: 15,
      }}
    >
      <Text style={{ textAlign: "center", fontSize: 24, fontWeight: "500" }}>
        My Cart
      </Text>

      <View
        style={{
          flex: 0.93,
        }}
      >
    <FlatList
      showsVerticalScrollIndicator={false}
      style={{}}
      data={storeData}
      renderItem={({ item, index }) => {
        // ✅ item is available here
        if (item.Image) {
          if (item.Image && imageMap[item.Image]) {
            imageSource = imageMap[item.Image];
          } 
        }

        return (
        <View
              style={{
                height: responsiveHeight(18),

                borderBottomColor: "#E3E3E3",
                borderBottomWidth: 2,
                flexDirection: "row",
              }}
            >
              {/* ///Child 1 */}

              <View
                style={{
                  flex: 0.35,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{ height: 120, width: 120, resizeMode: "contain" }}
                   source={imageSource}
                />
              </View>

              {/* ///Child 2 */}
              <View
                style={{
                  flex: 0.7,
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "600" }}>
                    {item.ProductName}
                  </Text>
                  <AntDesign
                    name="close"
                    size={25}
                    color="grey"
                    onPress={() => {
                      dispatch(removeFromCart(item));
                    }}
                  />
                </View>
                <Text style={{ fontSize: 17, color: "grey", marginTop: 5 }}>
                  {item.Price}
                </Text>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "row",

                    marginTop: 10,
                  }}
                >
                  {/* ///Quantity Container// */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
               <EvilIcons
        name="minus"
        size={28}
        color={myColors.primary}
        onPress={() => dispatch(decrementQuantity(item))}
      />
      <Text style={{ fontSize: 17 }}>{item.quantity}</Text>
      <EvilIcons
        name="plus"
        size={28}
        color={myColors.primary}
        onPress={() => {
          if (item.quantity < 7) {
            dispatch(incrementQuantity(item));
          }
        }}
      />

                  </View>

                  {/* ///Quantity Container// */}

                  <Text style={{ fontSize: 22, fontWeight: "600" }}>
                    ₹ {item.quantity * item.Price}
                  </Text>
                </View>
              </View>

              {/* ///Child 2 */}
            </View>
            );
          }}
        />
      </View>

      <View>
        <TouchableOpacity
  onPress={async () => {
    try {
      // ✅ Create one order object with all cart items
      const orderRef = ref(db, "Orders");

      await push(orderRef, {
          userId: userEmail, // include user context if needed
        createdAt: Date.now(),

        CartDetails: storeData.map((item) => ({
          ProductName: item.ProductName,
          UnitPrice: item.Price,
          Quantity: item.quantity,
          Image: item.Image,
          ProductId: item.Id
        })),
      });

      // Navigate after saving
      nav.navigate("OrderPlaced");
    } catch (error) {
      console.error("Error saving order:", error);
    }
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
  <View style={{ flexDirection: "row", alignItems: "center", gap: 30 }}>
    <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
      Go to CheckOut
    </Text>
    <Text style={{ fontSize: 15, fontWeight: "500", color: "white" }}>
      ₹ {amount}
    </Text>
  </View>
</TouchableOpacity>


      </View>
    </SafeAreaView>
  );
};

export default Cart;

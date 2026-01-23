import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { fruits } from "./../Utils/Date";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { FontAwesome } from "@expo/vector-icons";
import { myColors } from "./../Utils/MyColors";
import { useNavigation } from "@react-navigation/native";
import { imageMap } from "../Utils/imageMap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../Redux/CartSlice";

const ProductsCarousel = ({ data }) => {
  const dispatch = useDispatch();
  const storeData = useSelector((state) => state.CartSlice);
 const nav = useNavigation();
  // Normalize image source

  return (
    <View>
     <FlatList
  horizontal
  showsHorizontalScrollIndicator={false}
  data={data}
  keyExtractor={(item) => item.Id}
  renderItem={({ item }) => {
    // Normalize image per item
   let imageSource;
   if (item) {
     if (item.Image && imageMap[item.Image]) {
       // Case: Local asset mapping
       imageSource = imageMap[item.Image];
     }
   }

    return (
      <TouchableOpacity
        onPress={() =>
          nav.navigate("Details", { Id: item.Id, main: item })
        }
        activeOpacity={0.7}
        style={{
          height: responsiveHeight(28),
          borderWidth: 2,
          borderColor: "#E3E3E3",
          width: responsiveWidth(45),
          marginRight: 15,
          borderRadius: 15,
        }}
      >
        {imageSource && (
          <Image
            style={{
              height: 125,
              width: 125,
              alignSelf: "center",
              resizeMode: "contain",
            }}
            source={imageSource}
          />
        )}
        <View style={{ paddingHorizontal: 10, gap: 3 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            {item.ProductName.charAt(0).toUpperCase() +
              item.ProductName.slice(1)}
          </Text>
          <Text style={{ color: "grey" }}>{item.pieces} Priceg</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              ₹ {item.Price}
            </Text>
            {storeData.some(
              (value) => value.ProductName === item.ProductName
            ) ? (
              <FontAwesome
                name="minus-square"
                size={33}
                color={myColors.primary}
                onPress={() => dispatch(removeFromCart(item))}
              />
            ) : (
              <FontAwesome
                name="plus-square"
                size={33}
                color={myColors.primary}
                onPress={() => dispatch(addToCart(item))}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }}
/>
    </View>
  );
};

export default ProductsCarousel;

import { db } from "../../Firebaseconfig";
import { ref, onValue } from "firebase/database";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { FontAwesome } from "@expo/vector-icons";
import { myColors } from "../Utils/MyColors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { imageMap } from "../Utils/imageMap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../Redux/CartSlice";

const ProductsList = () => {
  const [productsArray, setProductsArray] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { CategoryId } = route.params || {};   // ✅ get param
  const dispatch = useDispatch();
  const storeData = useSelector((state) => state.CartSlice);

  useEffect(() => {
    const itemsRef = ref(db, "Products");
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setProductsArray(productsArray);
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ filter by category if param exists
  const filteredProducts = CategoryId
    ? productsArray.filter((p) => Number(p.CategoryId) === Number(CategoryId))
    : productsArray;

  const renderItem = ({ item }) => {
    let imageSource = null;
    if (item.Image && imageMap[item.Image]) {
      imageSource = imageMap[item.Image];
    }

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Details", { Id: item.Id, main: item })}
        activeOpacity={0.7}
        style={{
          height: responsiveHeight(28),
          borderWidth: 2,
          borderColor: "#E3E3E3",
          width: responsiveWidth(45),
          margin: 10,
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
            {item.ProductName.charAt(0).toUpperCase() + item.ProductName.slice(1)}
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
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>₹ {item.Price}</Text>
            {storeData.some((value) => value.ProductName === item.ProductName) ? (
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
  };

  return (
    <FlatList
      data={filteredProducts}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      numColumns={2}
      contentContainerStyle={{ padding: 10 }}
    />
  );
};

export default ProductsList;
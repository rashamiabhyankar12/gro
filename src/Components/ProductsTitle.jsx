import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { myColors } from "../Utils/MyColors";

const ProductsTitle = ({ title, categoryId }) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "600" }}>{title}</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("ProductsList", { CategoryId: categoryId })}
      >
        <Text style={{ fontSize: 16, color: myColors.primary }}>See All</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ProductsTitle;
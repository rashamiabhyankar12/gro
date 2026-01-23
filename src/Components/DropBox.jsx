import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { db } from "../../Firebaseconfig";
import { ref, onValue } from "firebase/database";

const DropBox = ({ Id }) => {
  const [products, setProducts] = useState([]);
  const [myIndex, setMyIndex] = useState(null);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const itemsRef = ref(db, "Products");
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsData = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setProducts(productsData);
      }
    });
    return () => unsubscribe();
  }, []);

  // find product by Id
  const productData = products.find((p) => p.Id === Id) || {};

  // turn productData into array of fields for FlatList
  const detailsArray = [
    { title: "Brand", content: productData.Brand },
    { title: "Origin", content: productData.Origin },
    { title: "Description", content: productData.Description }
  ];

  return (
    <View style={{ marginTop: 20 }}>
      <FlatList
        data={detailsArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View>
            <TouchableOpacity
              onPress={() => {
                setMyIndex(index);
                setToggle(myIndex === index ? !toggle : true);
              }}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomColor: "#E3E3E3",
                borderBottomWidth: 2,
                marginBottom: 10,
                paddingVertical: 15,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
              <AntDesign
                name={myIndex === index && toggle ? "down" : "right"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
            {myIndex === index && toggle ? (
              <Text style={{ marginLeft: 10 }}>{item.content}</Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
};

export default DropBox;
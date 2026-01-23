import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeIcon from "../Components/HomeIcon";
import HomeSearch from "../Components/HomeSearch";
import HomeBanner from "../Components/HomeBanner";
import ProductsTitle from "../Components/ProductsTitle";
import ProductsCarousel from "../Components/ProductsCarousel";
import { fruits, vegetables } from "../Utils/Date";
import { db } from "../../Firebaseconfig";
import { useNavigation } from "@react-navigation/native";
import { ref, onValue } from "firebase/database";
const Home = () => {

const [products, setProducts] = useState([]); // ✅ state declared at top level
const nav = useNavigation();
  useEffect(() => {
    const itemsRef = ref(db, "Products");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setProducts(productsArray); // ✅ update state
      }
    });
  }, []);


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 10,
        }}
      >
        <View style={{ gap: 20, paddingBottom: 20 }}>
          <HomeIcon />
         
          <HomeBanner />
          <ProductsTitle title="Fruits" categoryId={1}/>
          <ProductsCarousel data={products.filter(p => Number(p.CategoryId) === 1)} />
          <ProductsTitle title="Vegetables" categoryId={2} />
          <ProductsCarousel data={products.filter(p => Number(p.CategoryId) === 2)} />
             <ProductsTitle title=" Cold Drinks & Juices" categoryId={7} />
          <ProductsCarousel data={products.filter(p => Number(p.CategoryId) === 7)} />
             <ProductsTitle title="Chicken,Meat&Fish" categoryId={8} />
          <ProductsCarousel data={products.filter(p => Number(p.CategoryId) === 8)} />
            <ProductsTitle title="Dairy,Bread&Eggs" categoryId={3} />
          <ProductsCarousel data={products.filter(p => Number(p.CategoryId) === 3)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

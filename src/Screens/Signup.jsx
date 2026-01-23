import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { myColors } from "./../Utils/MyColors";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { authentication, database } from "./../../Firebaseconfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import uuid from 'react-native-uuid';

const Signup = () => {
  const [isVisbile, setisVisbile] = useState(true);
  const [userCrendetials, setuserCrendetials] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { email, password, name } = userCrendetials;


const uid=uuid.v4()
  const userAccount = () => {
    createUserWithEmailAndPassword(authentication, email, password)
      .then(() => {
        nav.navigate('Login')
        setDoc(doc(database, "users",uid ), {
          username:name,
          email:email,
          id:authentication.currentUser.uid
        });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Alert.alert("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }

        console.error(error);
      });
  };

  const nav = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: myColors.secondary }}>
      <StatusBar />
      <ScrollView style={{ flex: 1, paddingTop: 30 }}>
        <Image
          style={{ alignSelf: "center" }}
          source={require("../assets/mainIcon.png")}
        />

        <View style={{ paddingHorizontal: 20, marginTop: 50 }}>
          <Text
            style={{ color: myColors.third, fontSize: 24, fontWeight: "500" }}
          >
            Sign Up
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "400",
              color: "grey",
              marginTop: 10,
            }}
          >
            Enter your credentials to continue
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "grey",
              marginTop: 40,
            }}
          >
            Username
          </Text>
          <TextInput
            maxLength={9}
            value={name}
            onChangeText={(val) => {
              setuserCrendetials({ ...userCrendetials, name: val });
            }}
            keyboardType="name-phone-pad"
            style={{
              borderColor: "#E3E3E3",
              borderBottomWidth: 2,
              fontSize: 16,
              marginTop: 15,
            }}
          />

          {/* ////// */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "grey",
              marginTop: 30,
            }}
          >
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={(val) => {
              setuserCrendetials({ ...userCrendetials, email: val });
            }}
            keyboardType="email-address"
            style={{
              borderColor: "#E3E3E3",
              borderBottomWidth: 2,
              fontSize: 16,
              marginTop: 15,
            }}
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "grey",
              marginTop: 40,
            }}
          >
            Password
          </Text>
          <View
            style={{
              borderColor: "#E3E3E3",
              borderBottomWidth: 2,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextInput
              value={password}
              onChangeText={(val) => {
                setuserCrendetials({ ...userCrendetials, password: val });
              }}
              secureTextEntry={isVisbile}
              //maxLength={6}
              keyboardType="ascii-capable"
              style={{
                fontSize: 17,
                marginTop: 15,

                flex: 0.9,
              }}
            />
            <Ionicons
              onPress={() => {
                setisVisbile(!isVisbile);
              }}
              name={isVisbile == true ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="black"
            />
          </View>

          <Text
            numberOfLines={2}
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: "black",
              marginTop: 15,
              letterSpacing: 0.7,
              lineHeight: 25,
              width: "95%",
              opacity: 0.7,
            }}
          >
            By continuing you agree to our Terms of Service and Privacy Policy
          </Text>
          <TouchableOpacity
            onPress={userAccount}
            style={{
              backgroundColor: myColors.primary,
              marginTop: 30,
              height: 70,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 19,
                color: myColors.secondary,
                fontWeight: "500",
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
              gap: 5,
            }}
          >
            <Text style={{ fontSize: 16 }}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                nav.navigate("Login");
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: myColors.primary,
                  fontWeight: "600",
                }}
              >
                Login Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;

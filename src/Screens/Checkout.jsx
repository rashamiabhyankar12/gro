import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { db } from "../../Firebaseconfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, set, push } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

const Checkout = ({ options, selected, setSelected }) => {
  return (
    <View>
      {options.map((opt, idx) => (
        <View key={idx} style={styles.optionContainer}>
          {/* Radio Button */}
          <TouchableOpacity
            style={[
              styles.radioRow,
              selected === opt.value && styles.optionSelected
            ]}
            onPress={() => setSelected(opt.value)}
          >
            <View
              style={[
                styles.radioCircle,
                selected === opt.value && styles.radioSelected
              ]}
            />
            <Text
              style={[
                styles.label,
                selected === opt.value && styles.labelSelected
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>

          {/* Accordion Content */}
          {selected === opt.value && (
            <View style={styles.accordionContent}>
              {opt.content}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

function CheckoutScreen() {
  const [form, setForm] = useState({
    Name: "",
    lastName: "",
    Address: "",
    country: "",
    state: "",
    zip: "",
    Email: "",
    MobileNumber: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const [selected, setSelected] = useState(null); // ✅ moved here

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

 const validateForm = () => {
  const { Name, lastName, Address, country, state, zip, Email, MobileNumber, cardNumber, expiry, cvv } = form;

  // ✅ Always validate customer details regardless of payment method
  if (!Name || !lastName || !Address || !country || !state || !zip || !Email || !MobileNumber) {
    Alert.alert("Validation Error", "All customer details are required.");
    return false;
  }

  // ✅ Email format check (applies to both COD and Card)
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(Email)) {
    Alert.alert("Validation Error", "Please enter a valid email address.");
    return false;
  }

  if (selected === "Credit Card") {
    // Only validate card fields if Credit Card is chosen
    if (!cardNumber || !expiry || !cvv) {
      Alert.alert("Validation Error", "Card details are required.");
      return false;
    }

    if (cardNumber.length < 12 || cardNumber.length > 19) {
      Alert.alert("Validation Error", "Card number must be between 12–19 digits.");
      return false;
    }

    if (cvv.length < 3 || cvv.length > 4) {
      Alert.alert("Validation Error", "CVV must be 3 or 4 digits.");
      return false;
    }
  }

  return true;
};
const navigation = useNavigation();  // ✅ get navigation object

const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await push(ref(db, "checkout"), {
          ...form,
          PaymentMethod: selected,
          createdAt: new Date().toISOString()
        });

        Alert.alert("Success", "Saved to Firebase!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home") // ✅ navigate after success
          }
        ]);
      } catch (error) {
        Alert.alert("Error", error.message);
        console.error("Firebase save error:", error);
      }
    }
  };


const paymentOptions = [
  {
    label: "💳 Credit Card",
    value: "Credit Card",
    content: (
      <View>
        {/* Customer + Card Fields */}
        <TextInput style={styles.input} placeholder="Name" value={form.Name} onChangeText={(v) => handleChange("Name", v)} />
        <TextInput style={styles.input} placeholder="Last Name" value={form.lastName} onChangeText={(v) => handleChange("lastName", v)} />
        <TextInput style={styles.input} placeholder="Address" value={form.Address} onChangeText={(v) => handleChange("Address", v)} />
        <TextInput style={styles.input} placeholder="Country" value={form.country} onChangeText={(v) => handleChange("country", v)} />
        <TextInput style={styles.input} placeholder="State" value={form.state} onChangeText={(v) => handleChange("state", v)} />
        <TextInput style={styles.input} placeholder="Zip Code" keyboardType="numeric" value={form.zip} onChangeText={(v) => handleChange("zip", v)} />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={form.Email} onChangeText={(v) => handleChange("Email", v)} />
        <TextInput style={styles.input} placeholder="Mobile Number" keyboardType="phone-pad" value={form.MobileNumber} onChangeText={(v) => handleChange("MobileNumber", v)} />

        {/* Card-specific */}
        <TextInput style={styles.input} placeholder="Card Number" keyboardType="numeric" value={form.cardNumber} onChangeText={(v) => handleChange("cardNumber", v)} />
        <TextInput style={styles.input} placeholder="Expiry Date (MM/YY)" value={form.expiry} onChangeText={(v) => handleChange("expiry", v)} />
        <TextInput style={styles.input} placeholder="CVV" keyboardType="numeric" value={form.cvv} onChangeText={(v) => handleChange("cvv", v)} />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Payment</Text>
        </TouchableOpacity>
      </View>
    )
  },
  {
    label: "🚚 Cash on Delivery",
    value: "Cash on Delivery",
    content: (
      <View>
        {/* Customer Fields (same as card, but no card inputs) */}
        <TextInput style={styles.input} placeholder="Name" value={form.Name} onChangeText={(v) => handleChange("Name", v)} />
        <TextInput style={styles.input} placeholder="Last Name" value={form.lastName} onChangeText={(v) => handleChange("lastName", v)} />
        <TextInput style={styles.input} placeholder="Address" value={form.Address} onChangeText={(v) => handleChange("Address", v)} />
        <TextInput style={styles.input} placeholder="Country" value={form.country} onChangeText={(v) => handleChange("country", v)} />
        <TextInput style={styles.input} placeholder="State" value={form.state} onChangeText={(v) => handleChange("state", v)} />
        <TextInput style={styles.input} placeholder="Zip Code" keyboardType="numeric" value={form.zip} onChangeText={(v) => handleChange("zip", v)} />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={form.Email} onChangeText={(v) => handleChange("Email", v)} />
        <TextInput style={styles.input} placeholder="Mobile Number" keyboardType="phone-pad" value={form.MobileNumber} onChangeText={(v) => handleChange("MobileNumber", v)} />

        <Text style={styles.contentText}>Pay when the package arrives.</Text>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Confirm Order</Text>
        </TouchableOpacity>
      </View>
    )
  }
];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Select Payment Method</Text>
      <Checkout options={paymentOptions} selected={selected} setSelected={setSelected} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#222" },
  optionContainer: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    padding: 10
  },
  radioRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  optionSelected: { backgroundColor: "#e6f7ff", borderRadius: 8 },
  radioCircle: {
    height: 22, width: 22, borderRadius: 11,
    borderWidth: 2, borderColor: "#007AFF",
    marginRight: 12, justifyContent: "center", alignItems: "center"
  },
  radioSelected: { backgroundColor: "#007AFF" },
  label: { fontSize: 16, color: "#333" },
  labelSelected: { fontWeight: "600", color: "#007AFF" },
  accordionContent: { backgroundColor: "#f2f9ff", padding: 12, marginTop: 8, borderRadius: 8 },
  contentText: { fontSize: 14, color: "#555" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 14
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center"
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" }
});
export default CheckoutScreen;
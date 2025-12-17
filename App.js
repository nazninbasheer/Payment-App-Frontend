import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import Constants from "expo-constants";

const API_URL =  Constants.expoConfig.extra.EXPO_PUBLIC_API_URL; 

export default function App() {
  const [loans, setLoans] = useState([]);
  const [accountNumber, setAccountNumber] = useState("");
  const [emiAmount, setEmiAmount] = useState("");

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await fetch(`${API_URL}/customers`);
      const data = await response.json();
      setLoans(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to fetch loan details");
    }
  };

 const submitPayment = async () => {
  if (!accountNumber || !emiAmount) {
    Alert.alert("Error", "Please fill all fields");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account_number: accountNumber,
        amount: Number(emiAmount),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert("Success ✅", data.message);
      setAccountNumber("");
      setEmiAmount("");
    } else {
      Alert.alert("Error ❌", data.message || "Payment failed");
    }
  } catch (error) {
    Alert.alert("Error ❌", "Server not reachable");
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Loan Details</Text>

      <FlatList
        data={loans}
        keyExtractor={(item) => item.account_number}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Account: {item.account_number}</Text>
            <Text>Issue Date: {item.issue_date}</Text>
            <Text>Interest: {item.interest_rate}%</Text>
            <Text>Tenure: {item.tenure} months</Text>
            <Text>EMI Due: ₹{item.emi_due}</Text>
          </View>
        )}
      />

      <Text style={styles.heading}>Make Payment</Text>

      <TextInput
        placeholder="Account Number"
        style={styles.input}
        value={accountNumber}
        onChangeText={setAccountNumber}
      />

      <TextInput
        placeholder="EMI Amount"
        style={styles.input}
        keyboardType="numeric"
        value={emiAmount}
        onChangeText={setEmiAmount}
      />

      <Button title="Pay EMI" onPress={submitPayment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  card: {
    padding: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
});

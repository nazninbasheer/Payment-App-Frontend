import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.EXPO_PUBLIC_API_URL;
const Stack = createStackNavigator();

/* ===================== HOME SCREEN ===================== */
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeHeading}>Welcome to Secure Bank</Text>
      <Text style={styles.subHeading}>Payment Collection App</Text>

      <TouchableOpacity
        style={[styles.homeCard, { pointerEvents: 'auto' }]}
        onPress={() => navigation.navigate("CustomerDetails")}
      >
        <Text style={styles.cardText}>View Loan Details</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.homeCard, { pointerEvents: 'auto' }]}
        onPress={() => navigation.navigate("Payment")}
      >
        <Text style={styles.cardText}>Make Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ===================== CUSTOMER DETAILS ===================== */
/* ===================== CUSTOMER DETAILS ===================== */
function CustomerDetailsScreen() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await fetch(`${API_URL}/customers`);
      const data = await response.json();
      setLoans(data);
    } catch (error) {
      Alert.alert("Error", "Unable to fetch loan details");
    }
  };

  return (
    // style={{ flex: 1 }} ensures the container takes up the whole screen
    <View style={{ flex: 1, backgroundColor: "#f5f7fa" }}>
      <FlatList
        data={loans}
        keyExtractor={(item, index) =>
          item.account_number?.toString() || index.toString()
        }
        // contentContainerStyle is for the scrollable area itself
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.loanCard}>
            <Text style={styles.cardTitle}>Account: {item.account_number}</Text>
            <Text style={styles.cardText}>Issue Date: {item.issue_date}</Text>
            <Text style={styles.cardText}>Interest: {item.interest_rate}%</Text>
            <Text style={styles.cardText}>Tenure: {item.tenure} months</Text>
            <Text style={styles.cardText}>EMI Due: ₹{item.emi_due}</Text>
          </View>
        )}
      />
    </View>
  );
}

/* ===================== PAYMENT SCREEN ===================== */
function PaymentScreen() {
  const [accountNumber, setAccountNumber] = useState("");
  const [emiAmount, setEmiAmount] = useState("");

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

/* ===================== APP ROOT ===================== */
export default function App() {
  return (
    // This View must have flex: 1 to allow the navigator to expand
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="CustomerDetails"
            component={CustomerDetailsScreen}
            options={{ title: "Customer Loan Details" }}
          />
          <Stack.Screen name="Payment" component={PaymentScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}


/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  container: {
   flex: 1,  
    padding: 20,
    backgroundColor: "#f5f7fa",
  },

  listContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#f5f7fa",
  },

  welcomeHeading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 5,
  },

  subHeading: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 30,
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#34495e",
    marginVertical: 15,
    textAlign: "center",
  },

  homeCard: {
    padding: 20,
    backgroundColor: "#3498db",
    borderRadius: 12,
    marginBottom: 15,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    elevation: 3,
  },

  loanCard: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 15,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: "#3498db",
  },

  cardText: {
    fontSize: 16,
    color: "#000",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#bdc3c7",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#ffffff",
    fontSize: 16,
  },
});

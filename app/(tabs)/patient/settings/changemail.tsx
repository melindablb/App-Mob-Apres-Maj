import icons from "@/constants/icons";
import axios from "axios";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://your-api-endpoint";

export default function ChangeEmail(){
    const [fontsLoaded] = useFonts({
      "Montserrat-SemiBold": require("../../../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
      "Montserrat-Medium": require("../../../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
      'Montserrat-Bold': require('../../../../assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
    });

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/profile`);
        if (response.status === 200) {
          setEmail(response.data.email);
          setPhoneNumber(response.data.phoneNumber);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  if (!fontsLoaded) return null;

  const handleSave = async () => {
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/user/email`, { email });

      if (response.status === 200) {
        Alert.alert("Success", "Email updated successfully.");
        router.back();
      } else {
        Alert.alert("Error", "Failed to update email.");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      Alert.alert("Error", "Could not update email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => router.back()}>
                <Image source={icons.back} style={styles.backIcon} />
              </TouchableOpacity>
              <Text style={styles.headerText}>Change Email</Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={email}
                editable={false}
              />

            </View>

            <View style={styles.section}>
              <Text style={styles.label}>New Email Adress</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                editable={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, loading && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginTop: 45,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  backIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    tintColor: "#F05050",
  },
  headerText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    fontWeight: "600",
    color: "#F05050",
    textAlign: "center",
    flex: 1,
  },
  placeholder: {
    width: 30,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "black",
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderWidth: 0.75,
    borderColor: "#F05050",
    borderRadius: 17,
    paddingHorizontal: 15,
    backgroundColor: "white",
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  saveButton: {
    backgroundColor: "#F05050",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginHorizontal: 90,
    marginTop: 40,
    marginBottom: 50,
    width: "50%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  saveButtonText: {
    color: "white",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    fontWeight: "600",
  },
});

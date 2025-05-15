import icons from "@/constants/icons";
import { useAuth } from "@/contexts/AuthContext";
import { NewNumTel } from "@/services/changenumtel";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://your-api-endpoint";

export default function ChangePhone(){
    const [fontsLoaded] = useFonts({
      "Montserrat-SemiBold": require("../../../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
      "Montserrat-Medium": require("../../../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
      'Montserrat-Bold': require('../../../../assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
    });

  const [error,seterror]=useState<string | null>(null);
  const [phonenumb, setphonenumb] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, UpdateData } = useAuth();

  useEffect(() => {
    setphonenumb(user?.phonenumber || "");
  }, [user]);

  if (!fontsLoaded) return null;

  const handleSave = async () => {
    if(!phoneNumber) {
      seterror("Please enter a new phone number.");
      return;
    }
    if(phoneNumber.length < 10) {
      seterror("Phone number must be 10 digits.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("Uid", user?.uid || "");
      formData.append("Role","10");
      formData.append("newPhoneNumber", phoneNumber);
      
      const response = await NewNumTel(formData);
      const userupd ={
        uid: user?.uid || "",
        token: user?.token || "",
        name: user?.name || "",
        lastname: user?.lastname || "",
        email: user?.email || "",
        height: user?.height || "",
        weight: user?.weight || "",
        phonenumber: phoneNumber,
        postalcode: user?.postalcode || "",
        address: user?.address || "",
        birthdate: user?.birthdate || "",
        pdp : user?.pdp || "",      
        car: user?.car || false,
        watch: user?.watch || false,
        cgm: user?.cgm || false,   
      }
      setphonenumb(phoneNumber);
      UpdateData(userupd);
      Alert.alert(
              "Success",
              "Phone Number updated successfully.",
              [{ text: "OK", onPress: () => router.back() }]);

    } catch (error) {
      console.log("Error updating phonenumb:", error);
      Alert.alert("Error", "Could not update Phone Number.");
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
              <Text style={styles.headerText}>Change Phone Number</Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Old Phone Number</Text>
              <TextInput
                style={[styles.input,{color:"gray"}]}
                value={phonenumb}
                editable={false}
              />

            </View>

            <View style={styles.section}>
              <Text style={styles.label}>New Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="numeric"
                maxLength={10}
              />
              {error && (
              <Text style={{ marginTop:"2%",
                marginLeft:"2%",
                color: "red",
                fontFamily: "Montserrat-Regular",}}>
                {error}
              </Text>
            )}
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
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
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

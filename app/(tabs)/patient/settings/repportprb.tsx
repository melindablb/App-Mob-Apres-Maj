import icons from "@/constants/icons";
import { useAuth } from "@/contexts/AuthContext";
import { SendHelp } from "@/services/help";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, } from "react-native";


export default function ReportProblem(){
 const [fontsLoaded] = useFonts({
       "Montserrat-Thin": require("../../../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
       "Montserrat-SemiBold": require("../../../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
       "Montserrat-Medium": require("../../../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
       'Montserrat-Bold': require('../../../../assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
     });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  if (!fontsLoaded) return null;

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError("Please enter your message before submitting.");
      return;
    } 

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", user?.uid || "");
      formData.append("role", "10");
      formData.append("body", message);

      const response = await SendHelp(formData);
      setError(null);
      Alert.alert(
        "Success",
        "Your message has been sent successfully.",
        );
        router.back();
    } catch (error) {
      console.log("Error sending report:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Image source={icons.back} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Report a Problem</Text>
            <View style={styles.placeholder} />
          </View>

          <Text style={styles.label}>Describe your issue</Text>
          <TextInput
             style={styles.textArea}
             multiline
             numberOfLines={20}
             value={message}
             onChangeText={setMessage}
             placeholder="Write your problem or feedback here..."
             placeholderTextColor="#888"
            />


          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Sending..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
    marginBottom: 30,
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
    color:"#888"
  },
  label: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: "black",
    marginBottom: 10,
    marginLeft: 7,
  },
  textArea: {
    height: 140,
    borderWidth: 1,
    borderColor: "#F05050",
    borderRadius: 17,
    paddingHorizontal: 15,
    paddingTop: 15,
    fontSize: 14,
    backgroundColor: "white",
    fontFamily: "Montserrat-Medium",
    textAlignVertical: "top",
    elevation: 2,
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
  },
  submitButton: {
    backgroundColor: "#F05050",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginHorizontal: 60,
    marginTop: 40,
    elevation: 2,
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
  },
  submitButtonText: {
    color: "white",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    fontWeight: "600",
  },
});

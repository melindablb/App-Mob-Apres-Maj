import icons from "@/constants/icons";
import { useAuth } from "@/contexts/AuthContext";
import { NewEmail } from "@/services/resetmail";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";


export default function ChangeEmail(){
    const [fontsLoaded] = useFonts({
      "Montserrat-SemiBold": require("../../../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
      "Montserrat-Medium": require("../../../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
      'Montserrat-Bold': require('../../../../assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
    });

  const [email, setEmail] = useState("");
  const [newmail, setnewmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,seterror]=useState<string | null>(null);
  const { user, UpdateData } = useAuth();

   useEffect(() => {
     setEmail(user?.email || "");
   }, [user]);

  if (!fontsLoaded) return null;

  const handleSave = async () => {
    if (!email.includes("@")) {
      seterror("Please enter a valid email address.");
      return;
    }
    seterror(null);
    setLoading(true);
    try {
      //appel api
      const formData = new FormData();
      formData.append("id", user?.uid || "");
      formData.append("role","10");
      formData.append("newEmail", newmail);

      const response = await NewEmail(formData);
      const userupd ={
        uid: user?.uid || "",
        token: user?.token || "",
        name: user?.name || "",
        lastname: user?.lastname || "",
        email: newmail,
        height: user?.height || "",
        weight: user?.weight || "",
        phonenumber: user?.phonenumber || "",
        postalcode: user?.postalcode || "",
        address: user?.address || "",
        birthdate: user?.birthdate || "",
        pdp : user?.pdp || "",        
      }
      setEmail(newmail);
      UpdateData(userupd);
      Alert.alert(
                    "Success",
                    "Email updated successfully.",
                    [{ text: "OK", onPress: () => router.back() }]);

    } catch (errorr:any) {
      if(errorr.status == 409) {
        seterror("This email address is already taken.");
        return;
      }
      console.log("Error updating email:", error);
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
              <Text style={styles.label}>Old Email Address</Text>
              <TextInput
                style={[styles.input,{color:"gray"}]}
                value={email}
                editable={false}
                keyboardType="email-address"
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

            <View style={styles.section}>
              <Text style={styles.label}>New Email Adress</Text>
              <TextInput
                style={styles.input}
                value={newmail}
                onChangeText={setnewmail}
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

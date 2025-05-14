import icons from "@/constants/icons";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
//import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "@/contexts/AuthContext";
import { NewPwd } from "@/services/resetpwd";
import { Ionicons } from "@expo/vector-icons";
//import * as SecureStore from "expo-secure-store";


type PasswordInputProps = {
  label: string;
  value: string;
  onChange: (text: string) => void;
  visible: boolean;
  onToggleVisibility: () => void;
  placeholder: string;
};

function PasswordInput({
  label,
  value,
  onChange,
  visible,
  onToggleVisibility,
  placeholder,
}: PasswordInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChange}
          secureTextEntry={!visible}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={onToggleVisibility} style={styles.eyeIconContainer}>
          <Ionicons name={visible ? "eye" : "eye-off"} size={20} color={"white"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ChangePassword(){
   const [fontsLoaded] = useFonts({
     "Montserrat-SemiBold": require("../../../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
     "Montserrat-Medium": require("../../../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
     'Montserrat-Bold': require('../../../../assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
   });

  const [oldPasswordMasked, setOldPasswordMasked] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error1, seterror1] = useState<string | null>(null);
  const [error2, seterror2] = useState<string | null>(null);
  const { user } = useAuth();

  if (!fontsLoaded) return null;

  const isValidPassword = (password: string): boolean => password.length >= 6;
  const doPasswordsMatch = (): boolean => newPassword === confirmPassword;

  const validateForm = (): boolean => {
    if (!isValidPassword(newPassword)) {
      seterror1("Password must be at least 6 characters long.");
      return false;
    }
    if (!doPasswordsMatch()) {
      seterror2("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSavePassword = async () => {
    if (!validateForm()) return;
  
    setLoading(true);
    const formData = new FormData();
    formData.append("NewPassword", newPassword);
    formData.append("Role","10");
    formData.append("Uid", user?.uid || "");
    try {
      
      const response = await NewPwd(formData);
      Alert.alert(
        "Success",
        "Password updated successfully.",
        [{ text: "OK", onPress: () => router.back() }]);
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe :", error);
      Alert.alert("Error", "Failed to update password. Please try again.");
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
              <Text style={styles.headerText}>Change Password</Text>
              <View style={styles.placeholder} />
            </View>



            {/* NEW PASSWORD */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Edit Your Password</Text>
              <View style={{marginTop: -10}}>
              <PasswordInput
                label="New Password"
                value={newPassword}
                onChange={(newPassword)=>{
                  setNewPassword(newPassword);
                  seterror1(null);
                }}
                visible={showNewPassword}
                onToggleVisibility={() => setShowNewPassword(!showNewPassword)}
                placeholder="New Password"
              />
              {error1 && <Text style={styles.error}>{error1}</Text>}
              <PasswordInput
                label="Confirm The New Password"
                value={confirmPassword}
                onChange={(confirmPassword)=>{
                  setConfirmPassword(confirmPassword);
                  seterror2(null);
                }}
                visible={showConfirmPassword}
                onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                placeholder="Confirm The New Password"
              />
              {error2 && <Text style={styles.error}>{error2}</Text>}

              </View>
            </View>
            

            <TouchableOpacity
              style={[styles.saveButton, loading && { opacity: 0.6 }]}
              onPress={handleSavePassword}
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
  inputGroup: {
    alignSelf: "stretch",
    marginTop: 20,
    marginBottom: 12,
  },
  inputLabel: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "black",
    marginBottom: 5,
    paddingLeft: 10,
  },
  inputWrapper: {
    height: 44,
    width: "100%",
    borderColor: "#F05050",
    borderWidth: 0.75,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    backgroundColor: "white",
    marginBottom: -13,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "black",
  },
  maskedPasswordText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#888",
  },
  eyeIconContainer: {
    padding: 10,
  },
  saveButton: {
    backgroundColor: "#F05050",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginHorizontal: 90,
    marginBottom: 50,
    marginTop: 40,
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
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: "600",
    color: "#FE8080",
    marginBottom: 5,
  },
  error:{
    marginTop:"2%",
    marginLeft:"2%",
    color: "red",
    fontFamily: "Montserrat-Regular",
  }
});


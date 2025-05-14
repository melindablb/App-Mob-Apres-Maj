import icons from "@/constants/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useFonts } from 'expo-font';
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://your-api-endpoint";

export default function Settings() {
  const [fontsLoaded] = useFonts({
    "Montserrat-SemiBold": require("../../../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "Montserrat-Medium": require("../../../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
    'Montserrat-Bold': require('../../../../assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {user, signOutD} = useAuth();

  const handleDeleteAccount = () => {
    setModalVisible(false);
    router.replace("../settings/confirmation");
  };
  

  const handleLogout = async () => {
    try {
      //FIXME: logout avec le contexte
      signOutD();
      router.replace("../../welcome");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  return (
    
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Settings</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <TouchableOpacity 
              style={styles.settingItem} 
              onPress={() => router.push("../settings/editprofile")}
            >
              <Image source={icons.edit} style={styles.icons} />
              <Text style={styles.settingText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push("../settings/resetpwd")}
            >
              <Image source={icons.psw} style={styles.icons} />
              <Text style={styles.settingText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push("../settings/resetemail")}
            >
              <Image source={icons.mail} style={styles.icons} />
              <Text style={styles.settingText}>Change Email</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push("../settings/resetnumtel")}
            >
              <Image source={icons.tel} style={{width:27,height:27,tintColor:"#F05050"}} />
              <Text style={styles.settingText}>Change Phone Number</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => setModalVisible(true)}
            >
              <Image source={icons.trashR} style={styles.icons} />
              <Text style={styles.settingText}>Delete your Account</Text>
            </TouchableOpacity>
          </View>


          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Help</Text>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push("../settings/repportprb")}
              >
              <Image source={icons.problem} style={{width:36,height:36,tintColor:"#F05050"}} />
              <Text style={styles.settingText}>Report a Problem</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirm Deletion</Text>
              <Text style={styles.modalText}>
                Are you sure you want to delete your account? This action cannot be undone.
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalDeleteButton, loading && { opacity: 0.6 }]}
                  onPress={handleDeleteAccount}
                  disabled={loading}
                >
                  <Text style={styles.modalDeleteButtonText}>
                    {loading ? "Deleting..." : "Delete"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginTop: "12%",
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
    fontFamily: 'Montserrat',
    fontSize: 25,
    fontWeight: "600",
    color: "#F05050",
    textAlign: "center",
    flex: 1,
  },
  placeholder: {
    //width: 30,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Montserrat',
    fontSize: 20,
    fontWeight: "600",
    color: "#FE8080",
    marginBottom: "2%",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  deleteItem: {
    borderBottomColor: "#FF3B30",
  },
  settingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: 10,
    flex: 1,
  },
  deleteText: {
    color: "#FF3B30",
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    tintColor: "#F05050",
  },
  logoutButton: {
    backgroundColor: "#F05050",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  logoutText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  icons: {
    width: 32,
    height: 32,
    tintColor: "#F05050",
  },
 
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontFamily: "Montserrat",
    fontSize: 18,
    color: "#F05050",
    marginBottom: 10,
  },
  modalText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "whitw",
    borderColor: "#F05050",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    marginRight: 10,
  },
  modalCancelButtonText: {
    color: "#F05050",
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "600",
  },
  modalDeleteButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    marginLeft: 10,
  },
  modalDeleteButtonText: {
    color: "white",
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "600",
  },
});
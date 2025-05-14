import { Ionicons } from "@expo/vector-icons"
import icons from "@/constants/icons"
import { useState } from "react"
import { useFonts } from "expo-font"
import { StyleSheet, Text, View, ScrollView,Image, TouchableOpacity, SafeAreaView, StatusBar } from "react-native"
import PatientDetails from "../components/PatientDetails"
import PatientMapView from "../components/MapView"
import { mockPatientData } from "../data/mockData"

const  med = () => {
  const [patientAssigned, setPatientAssigned] = useState(false)
  const [showMap, setShowMap] = useState(false)

  const [fontsLoaded] = useFonts({
      "Montserrat-Thin": require("../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
      "Montserrat-Regular": require("../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
      "Montserrat-SemiBold": require("../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
      "Montserrat-Medium": require("../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
    });

  const assignPatient = () => {
    setPatientAssigned(true)
    // Automatically show map when patient is assigned
    setShowMap(true)
  }

  const resetPatient = () => {
    setPatientAssigned(false)
    setShowMap(false)
  }

  const toggleMap = () => {
    setShowMap(!showMap)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
          <View style={styles.headerL}>
            <Image source={icons.avatar} style={{width: 45, height: 45}}/>
            <Text style={{
              color:"black", 
              fontSize:20, 
              textAlign:"left", 
              marginLeft:5,
              alignSelf:"center",
              fontFamily: "Montserrat-SemiBold",
              }}>User Name</Text>
          </View>
          <View style={styles.headerR}>
          <Ionicons name="notifications" size={25} color="#F05050" style={styles.notificationIcon} />
            </View>
          </View>

      {!patientAssigned ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No patient to take care of</Text>
          <TouchableOpacity style={styles.button} onPress={assignPatient}>
            <Text style={styles.buttonText}>Assign Patient</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.contentContainer}>
          <PatientDetails patient={mockPatientData} />

            <PatientMapView
              location={mockPatientData.location}
              name={`${mockPatientData.firstName} ${mockPatientData.lastName}`}
            />
          

          <TouchableOpacity style={styles.resetButton} onPress={resetPatient}>
            <Text style={styles.buttonText}>Finish</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header:{
    height: "5%",
    marginHorizontal:"5%",
    flexDirection: 'row',
    justifyContent: "space-between",
    marginBottom:"5%",
  },
  headerL:{
    flexDirection: 'row',
  },
  headerR:{
    justifyContent:"center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
    fontFamily:"Montserrat-Medium"
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },
  mapToggleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  mapToggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
  },
  showMapButton: {
    backgroundColor: "#4a90e2",
  },
  hideMapButton: {
    backgroundColor: "#888",
  },
  resetButton: {
    backgroundColor: "#e25c4a",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
    marginTop: 20,
    marginBottom: 30,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily:"Montserrat-SemiBold",
    textAlign: "center",
  },
  notificationIcon: {
    alignSelf: "flex-end",
  },
})

export default med;
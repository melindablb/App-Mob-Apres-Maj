"use client"
import { useFonts } from "expo-font"
import type React from "react"
import { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, Linking, Platform } from "react-native"
import type { Patient } from "../types/types"

interface PatientDetailsProps {
  patient: Patient
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patient }) => {
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null)

  const toggleRecord = (recordId: string) => {
    if (expandedRecord === recordId) {
      setExpandedRecord(null)
    } else {
      setExpandedRecord(recordId)
    }
  }

  const [fontsLoaded] = useFonts({
    "Montserrat-Thin": require("../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    "Montserrat-Regular": require("../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "Montserrat-Medium": require("../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
  });

  const openMap = () => {
    const { latitude, longitude } = patient.location
    const label = `${patient.firstName} ${patient.lastName}'s Location`

    // Different URL schemes for different platforms
    const url = Platform.select({
      ios: `maps:${latitude},${longitude}?q=${label}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
      default: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=16`,
    })

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url)
      } else {
        // Fallback to OpenStreetMap in browser if native maps not supported
        Linking.openURL(`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=16`)
      }
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Patient Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>
            {patient.firstName} {patient.lastName}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{patient.age}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{patient.position}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Coordinates:</Text>
          <Text style={styles.value}>
            {patient.location.latitude.toFixed(6)}, {patient.location.longitude.toFixed(6)}
          </Text>
        </View>

      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{patient.phoneNumber}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{patient.email}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Physical Attributes</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Height:</Text>
          <Text style={styles.value}>{patient.height} cm</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Weight:</Text>
          <Text style={styles.value}>{patient.weight} kg</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Medical Records</Text>

        {patient.medicalRecords.length > 0 ? (
          patient.medicalRecords.map((record) => (
            <View key={record.id} style={styles.recordContainer}>
              <TouchableOpacity style={styles.recordHeader} onPress={() => toggleRecord(record.id)}>
                <Text style={styles.recordTitle}>{record.title}</Text>
                <Text style={styles.recordDate}>{record.date}</Text>
              </TouchableOpacity>

              {expandedRecord === record.id && (
                <View style={styles.recordDetails}>
                  <Text style={styles.recordDescription}>{record.description}</Text>
                  <View style={styles.recordMeta}>
                    <Text style={styles.recordMetaText}>Doctor: {record.doctor}</Text>
                    <Text style={styles.recordMetaText}>Medication: {record.medication}</Text>
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noRecords}>No medical records available</Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth:0.3,
    borderColor:"#9C9C9C",
    padding: 16,
    marginBottom: "5%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily:"Montserrat-SemiBold",
    marginBottom: 12,
    color: "#F05050",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    width: 100,
    color: "black",
    fontFamily:"Montserrat-SemiBold",
  },
  value: {
    flex: 1,
    color: "#333",
    fontFamily:"Montserrat-Medium",
  },
  mapButton: {
    backgroundColor: "#4a90e2",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center",
  },
  mapButtonText: {
    color: "white",
    fontWeight: "600",
  },
  recordContainer: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 6,
    marginBottom: 8,
    overflow: "hidden",
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  recordTitle: {
    fontWeight: "600",
    color: "#333",
    fontFamily:"Montserrat-SemiBold",
  },
  recordDate: {
    color: "#888",
    fontSize: 12,
  },
  recordDetails: {
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  recordDescription: {
    marginBottom: 8,
    color: "#444",
    fontFamily:"Montserrat-Medium",
  },
  recordMeta: {
    marginTop: 8,
  },
  recordMetaText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontFamily:"Montserrat-Medium",
  },
  noRecords: {
    fontFamily:"Montserrat-SemiBold",
    color: "#888",
    textAlign: "center",
    padding: 12,
  },
})

export default PatientDetails

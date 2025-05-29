"use client"
import { useFonts } from "expo-font";
import type React from "react";
import { useEffect, useState } from "react";
import { Button, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export interface MedRec {
  id: string;
  label: string;
  mailmed: string;
  filepath: string;
  date: string;
}

export interface Request {
  id: string;
  title: string;
  timestamp: string;
  patient :{
  id: string;  
  firstname: string;
  lastname: string;
  latitudepatient: string;
  longitudepatient: string;
  birthdate: string;
  location:string;
  phone: string;
  email: string;
  height: string;
  weight: string;
  }
  medrec?: MedRec[] | null;
}



interface PatientDetailsProps {
  patient: Request
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patient }) => {

  const [adresse, setAdresse] = useState<string | null>(null);

  const getLocationName = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`
      );
      const data = await response.json();
      console.log("data ",data.locality)
      setAdresse(data.locality+" "+data.principalSubdivision);
      return {
        city: data.locality,
        region: data.principalSubdivision,
        country: data.countryName
      };
    } catch (error) {
      console.error("Erreur lors du reverse geocoding :", error);
      return null;
    }
  };

  useEffect(() => {
    getLocationName(
      parseFloat(patient.patient.latitudepatient), 
      parseFloat(patient.patient.longitudepatient))
  }, []);



  const [expandedRecord, setExpandedRecord] = useState<string | null>(null)

  const toggleRecord = (recordId: string) => {
    if (expandedRecord === recordId) {
      setExpandedRecord(null)
    } else {
      setExpandedRecord(recordId)
    }
  }
  function formatDateToEnglish(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
 
  const [fontsLoaded] = useFonts({
    "Montserrat-Thin": require("../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    "Montserrat-Regular": require("../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "Montserrat-Medium": require("../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
  });

 
  const openURL = (url :any) => {
    const partievalide = url.replace(/\\/g, "/");
    Linking.
    openURL
    (`http://192.168.1.102:5001/${partievalide}`);
  };

 const openMap = () => {
    const latitude = parseFloat(patient.patient.latitudepatient);
    const longitude = parseFloat(patient.patient.longitudepatient);
    const label = `${patient.patient.firstname} ${patient.patient.lastname}'s Location`

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
      <Text style={styles.cardTitle}>Alert Reason:</Text>
      <Text style={[styles.value, {fontSize: 16}]}>
            {patient.title}
          </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Patient Information:</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>
            {patient.patient.firstname} {patient.patient.lastname}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Birth Date:</Text>
          <Text style={styles.value}>{formatDateToEnglish(patient.patient.birthdate)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{adresse}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Coordinates:</Text>
          <Text style={styles.value}>
            Lat: {patient.patient.latitudepatient.slice(0,6)}, Long:{patient.patient.longitudepatient.slice(0,6)}
          </Text>
        </View>

      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact Information:</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{patient.patient.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{patient.patient.email}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Physical Attributes:</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Height:</Text>
          <Text style={styles.value}>{patient.patient.height} cm</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Weight:</Text>
          <Text style={styles.value}>{patient.patient.weight} kg</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Medical Records:</Text>
        {Array.isArray(patient.medrec) && patient.medrec.length > 0 ? (
          patient.medrec.map((record) => (
            <View key={record.id} style={styles.recordContainer}>
              <TouchableOpacity style={styles.recordHeader} onPress={() => toggleRecord(record.id)}>
                <Text style={styles.recordTitle}>{record.label}</Text>
                <Text style={styles.recordDate}>{formatDateToEnglish(record.date)}</Text>
              </TouchableOpacity>
              {expandedRecord === record.id && (
                <View style={styles.recordDetails}>
                  <Button title="Open File On Navigator" onPress={()=>openURL(record.filepath)}/>
                  <View style={styles.recordMeta}>
                    <Text style={styles.recordMetaText}>Doctor Email:  {record.mailmed}</Text>
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noRecords}>No medical records available</Text>)}
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

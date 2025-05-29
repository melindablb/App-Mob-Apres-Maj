import PatientMapView from "@/app/components/MapView";
import icons from "@/constants/icons";
import { useAuth } from "@/contexts/AuthContext";
import { AcceptAlert, FinishAlert, GetInfoPatMed, ListAlerts } from "@/services/proSalerte";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from 'date-fns';
import { useFonts } from "expo-font";
import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { Alert, Image, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import PatientDetails from "../../../components/PatientDetails";


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


const Med = () => {



  // getAddressFromCoords.ts






  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied")
        return
      }

      try {
        const location = await Location.getCurrentPositionAsync({})
        setLocation(location)
      } catch (error) {
        Alert.alert("Could not get your location")
      }
    })()
  }, [])



  const [accfinish , setaccfinish] = useState("Accept");
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState<Request[] | null >(null);
  const [activeRequest, setActiveRequest] = useState<Request | null>(null);
  const [showMap, setShowMap] = useState(false)
  const { user } = useAuth();
  const toggleMap = () => {
  setShowMap(!showMap)
}

useEffect(() => {
  const fetchAlerts = async () => {
   
  }
  fetchAlerts();
}
, []);

  const [fontsLoaded] = useFonts({
    "Montserrat-Thin": require("../../../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    "Montserrat-Regular": require("../../../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../../../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "Montserrat-Medium": require("../../../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
  });

const handleaccept = async (request: Request) => {

if(accfinish=="Accept") { //bouton = accept
const formData = new FormData();
formData.append("ProS", user?.uid || "");
formData.append("IdAlert", request.id || "");
formData.append("lat",location?.coords.latitude.toString() || "");
formData.append("longt", location?.coords.longitude.toString() || "");

try{
  const result = await AcceptAlert(formData);
  console.log("Response from AcceptAlert:", result.data);
  setaccfinish("Finish");

}catch(error){
  console.log("Error accepting request:", error);
  Alert.alert("Error", "Could not accept the request. Please try again.");
  return;
}
}
else{ //bouton = finish
  const formData = new FormData();
  formData.append("ProS", user?.uid || "");
  formData.append("IdAlert", request.id || "");

try{
  const result = await FinishAlert(formData);
  console.log("Response from FinishAlert:", result.data);
  setActiveRequest(null);
  setaccfinish("Accept");
  onRefresh();

}catch(error){
  console.log("Error finishing request:", error);
  Alert.alert("Error", "Could not finish the request. Please try again.");
  return;
}
}
}

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  useEffect(() => {
    onRefresh();}, []);

  const onRefresh = useCallback(async () => {
    setRequests(null);
    setRefreshing(true);
    try {
      const formdata = new FormData();
      formdata.append("ProSid", user?.uid || "");
      const response = await ListAlerts(formdata);
      console.log("Response from ListAlerts:", response.data);
      response.data.forEach(async (alert : any) => {
        const formdata = new FormData();
        formdata.append("PatientUID", alert.patientUID);
        try{
        const pat = await GetInfoPatMed(formdata);
        console.log("Response from GetInfoPatMed:", pat.data);
        const obj : Request ={
          timestamp: alert.createdAt,
          id: alert.alertID,
          title: alert.descrip,
          patient:{
          id: pat.data.patient.uid,  
          firstname: pat.data.patient.name,
          lastname: pat.data.patient.lastName,
          latitudepatient: alert.latitudePatient,
          longitudepatient: alert.longitudePatient,
          birthdate: pat.data.patient.dateofBirth,
          location: "uknown",
          phone: pat.data.patient.phoneNumber,
          email: pat.data.patient.email,
          height: pat.data.patient.height.toString(),
          weight: pat.data.patient.weight.toString(),
          },
          medrec: (pat.data.medRecs || []).map((record: any) => ({
            id: record.uidMedRec,
            label: record.title,
            mailmed: record.mailMed,
            filepath: record.filePath,
            date: record.createdAt,
          })),
        }
        console.log("obj:", obj);
        setRequests((prev) => {
          if (!prev) return [obj];
        
          const exists = prev.some((item) => item.id === obj.id);
          if (exists) return prev;
        
          return [...prev, obj];
        });
      }
      catch (error) {
        console.log("Error fetching patient data:", error);
      }
      });
    } catch (error) {
      console.log("Error fetching requests:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    console.log("Updated requests:", JSON.stringify(requests, null, 2));
  }, [requests]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerL}>
          <Image source={icons.avatar} style={{ width: 45, height: 45 }} />
          <Text style={styles.headerText}>{user?.name} {user?.lastname}</Text>
        </View>
        <View style={styles.headerR}>
          <Ionicons name="notifications" size={25} color="#F05050" style={styles.notificationIcon} />
        </View>
      </View>
    { !activeRequest && (
      <View>
    <Text style={{
    alignSelf: "center",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 30,
    color: "#F05050",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
    marginBottom: "2%",}}>Alerts</Text>
    <View style={{
    width: "88%",
    height: 1,
    backgroundColor: "#d3d3d3",
    alignSelf: "center",
    }}/> 
    </View>
  )}
      {activeRequest ? (
        <ScrollView style={styles.contentContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <PatientDetails patient = {activeRequest} />
          <PatientMapView
              location={{ latitude: parseFloat(activeRequest.patient.latitudepatient), longitude: parseFloat(activeRequest.patient.longitudepatient) }}
              name={`${activeRequest.patient.firstname} ${activeRequest.patient.lastname}`}
            />
            {/*TODO: accepter/terminer */}
            <View style={{ flexDirection: "row", justifyContent: "center", gap:"10%", marginTop: 20 }}>
          <TouchableOpacity style={[styles.resetButton,{backgroundColor:accfinish=="Accept"?"#20c970":"#f05050"}]} onPress={() => handleaccept(activeRequest)}>
            <Text style={styles.buttonText}>{accfinish}</Text>
          </TouchableOpacity>
          {accfinish=="Accept" &&
          <TouchableOpacity style={[styles.resetButton,{backgroundColor:"gray"}]} onPress={() => setActiveRequest(null)}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
          }
          </View>
          <View style={{height:80}}></View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.contentContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"#F05050"}/>} >
          {requests && requests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No incoming requests</Text>
            </View>
          ) : (
            requests?.map((req) => (
              <View key={req.id} style={styles.requestCard}>
                <Text style={styles.requestTitle}>{req.title}</Text>
                <Text style={styles.timestamp}>
                  {req.timestamp ?  formatDistanceToNow(new Date(req.timestamp), { addSuffix: true }): "No timestamp available"}
                </Text>

                <View style={{ flexDirection: "row", justifyContent:"flex-end", marginTop: 0 }}>
                  <TouchableOpacity style={styles.button} onPress={() => {setActiveRequest(req);}}>
                    <Text style={[styles.buttonText,{color:"#F08080"}]}>See Details &gt;</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
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
  header: {
    height: "5%",
    marginHorizontal: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "5%",
  },
  headerL: {
    flexDirection: "row",
  },
  headerR: {
    justifyContent: "center",
  },
  headerText: {
    color: "black",
    fontSize: 20,
    textAlign: "left",
    marginLeft: 5,
    alignSelf: "center",
    fontFamily: "Montserrat-SemiBold",
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
    fontFamily: "Montserrat-Medium",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  button: {
    //backgroundColor: "#FE8080",
   // paddingVertical: 0,
    paddingHorizontal: 6,
    borderRadius: 8,
    elevation: 2,
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
    fontFamily: "Montserrat-SemiBold",
    textAlign: "center",
  },
  notificationIcon: {
    alignSelf: "flex-end",
  },
  requestCard: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 0.3,
    borderColor: "#9C9C9C",
  },
  requestTitle: {
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
    color: "#F05050",
  },
  requestDesc: {
    fontSize: 14,
    fontFamily: "Montserrat-Medium",
    color: "#444",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#888",
    marginTop: 4,
    marginBottom:4,
  },
  
});

export default Med;




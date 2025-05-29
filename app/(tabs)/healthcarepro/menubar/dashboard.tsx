import OBU from "@/app/components/OBUP";
import icons from "@/constants/icons";
import { useAuth } from "@/contexts/AuthContext";
import { SetStatus } from "@/services/proSalerte";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";


const Dashboard = () => {
  const [fontsLoaded] = useFonts({
   "Montserrat-SemiBold": require("../../../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "Montserrat-Medium": require("../../../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
    'Montserrat-Bold': require('../../../../assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
  });
const { user } = useAuth();
  const stateText = [
    { id: "1", title: "Available", value: "Tap here to change status" },
    { id: "2", title: "Available For Calls", value: "Tap here to change status" },
    { id: "3", title: "Not Available", value: "Tap here to change status" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleStatePress = () => {
    const nextIndex = (currentIndex + 1) % stateText.length;
    setCurrentIndex(nextIndex);
  };

  useEffect(() => {
    const setstatus = () => {
      const formdata = new FormData();
      formdata.append("ProS", user?.uid || "");

      if(currentIndex === 0){
        formdata.append("state", "0");
      }
      else if(currentIndex === 1){
        formdata.append("state", "1");
      }
      else if(currentIndex === 2){
        formdata.append("state", "-1");
      }
      try{
        const response = SetStatus(formdata);
        console.log("Response from SetStatus:", response);
        
      }catch(error){
        console.log("Error setting status: ", error);
      }
    }
  
  setstatus();
  }, [currentIndex]);
  const status = stateText[currentIndex];

  const getColor = (id: any) => {
    switch (id) {
      case "1": return "#49A551";
      case "2": return "#F89545";
      case "3": return "#E52C2C";
      default: return "#9C9C9C";
    }
  };

  // Time
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, 
      });
      setTime(formattedTime);
    };

    updateTime(); 
    const interval = setInterval(updateTime, 1000); 

    return () => clearInterval(interval); 
  }, []);

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  const mapRef = useRef<MapView | null>(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        return
      }

      try {
        const location = await Location.getCurrentPositionAsync({})
        setLocation(location)
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        })
      } catch (error) {
        setErrorMsg("Could not get your location")
      }
    })()
  }, [])

  const recenterMap = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({})
      setLocation(location)

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }

      setMapRegion(newRegion)

      // Use the map reference to animate to the new region
      mapRef.current?.animateToRegion(newRegion, 1000)
    } catch (error) {
      setErrorMsg("Could not get your location")
    }
  }

  let content
  if (errorMsg) {
    content = <Text style={styles.MerrorText}>{errorMsg}</Text>
  } else if (!location) {
    content = <ActivityIndicator size="large" color="#F05050" />
  } else {
    content = (
      <View style={styles.mapContainer}>
        <MapView ref={mapRef} style={styles.map} region={mapRegion}>
          <UrlTile urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            description="Your current location"
          />
        </MapView>
        <TouchableOpacity style={styles.MrecenterButton} onPress={recenterMap}>
          <MaterialIcons name="my-location" size={24} color="black" />
        </TouchableOpacity>
      </View>
    )
  }


  const [showOverlay, setShowOverlay] = useState(false);

  const handlePress = () => {
    setShowOverlay(!showOverlay);
  };

  return (
    
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerL}>
            <Image source={icons.avatar} style={styles.iconeco} />
            <Text style={{
              color: "black",
              fontSize: 20,
              textAlign: "left",
              marginLeft: 5,
              alignSelf: "center",
              fontFamily: "Montserrat-SemiBold",
            }}>{user?.name} {user?.lastname}</Text>
          </View>
          <View style={styles.headerR}>
      <Pressable onPress={() => router.push('../notification')}>
      <View style={styles.headerR}>
          <Ionicons name="notifications" size={25} color="#F05050" style={styles.notificationIcon} />
        </View>
      </Pressable>
    </View>
        </View>

        {/* State Section */}
        <TouchableOpacity style={styles.state} onPress={handleStatePress} activeOpacity={0.7}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{
              flex: 1,
              justifyContent: 'center',
              marginLeft: "5%"
            }}>
              <Text style={[styles.title, { color: getColor(status.id) }]}>{status.title}</Text>
              <Text style={[styles.value, { color: getColor(status.id) }]}>{status.value}</Text>
            </View>
            <Text style={{
              fontSize: 30,
              fontFamily: "Montserrat-SemiBold",
              textAlign: "right",
              alignSelf: "center",
              color: "black",
              marginRight: "5%",
            }}>
              {time}</Text>
          </View>
        </TouchableOpacity>


        {/* Localization Section */}
        <View style={styles.localisation}>
                    {content}
          </View>

        {/* Objects Section */}
       <OBU/>

        {/* Total Section */}
        <View style={styles.total}>
            <Text style={{
              fontSize: 18,
              color:"black",
              fontFamily: "Montserrat-SemiBold",
              textAlign:"left",
             
            }}>
              <Text>Total Interventions: </Text>
              <Text style={{color:"#F05050"}}>3</Text>
              </Text>
            <Text style={{
              fontSize: 18,
              color:"black",
              fontFamily: "Montserrat-SemiBold",
              textAlign:"right",
            }}>
              <Text>This Week: </Text>
              <Text style={{color:"#F05050"}}>0</Text>
              </Text>
            </View>  
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  header: {
    flexDirection: 'row',
    justifyContent: "space-between",
    marginHorizontal: "5%",
    marginTop: "11%",
    marginBottom: "5%",
  },
  headerL: {
    flexDirection: 'row',
  },
  headerR: {
    justifyContent: "center",
  },
  state:{
    height: "12%",
    backgroundColor:"white",
    borderColor:"#9C9C9C",
    borderWidth: 0.5,
    borderRadius: 29,
    marginBottom:"5%",
    justifyContent: 'center',
    marginHorizontal:"5%",
    boxShadow: "0 1 3 1px rgba(0, 0, 0, 0.15)",
    filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))",
  },
  localisation: {
    height: 330,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "5%",
    marginBottom: "5%",
  },
  
  total: {
    height: 60,
    flexDirection: 'row',
    marginHorizontal: "5%",
    marginBottom: "5%",
    backgroundColor: "white",
    borderColor: "#9C9C9C",
    borderWidth: 0.5,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    paddingHorizontal: "5%",
  },
  title: {
    fontSize: 20,
    fontFamily: "Montserrat-SemiBold",
    textAlign: "left",
    alignSelf: "flex-start",
    marginBottom: 5,
   
  },
  value: {
    fontSize: 15,
    fontFamily: "Montserrat-Medium",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  Mcontainer: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  map: {
    backgroundColor: "white",
    borderColor: "#9C9C9C",
    borderWidth: 0.5,
    borderRadius: 26,
    width: "100%",
    height: "100%",
    // Fixed shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  MerrorText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    textAlign: "center",
    color: "red",
  },
  MrecenterButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overlayContent: {
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    padding: 25,
    borderRadius: 30,
    alignItems: 'center',
    width: "75%",
    zIndex: 5,
    borderWidth: 2,
    borderColor: "#9C9C9C"
  },
  closeButton: {
    marginTop: 0,
    backgroundColor: '#F05050',
    padding: 10,
    borderRadius: 10,
    justifyContent: "center"
  },
  overlayContentAlt: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    padding: 25,
    borderRadius: 30,
    alignItems: 'center',
    width: "75%",
    zIndex: 5,
    borderWidth: 2,
    borderColor: "#9C9C9C"
  },
  iconeco: {
    width: 45,
    height: 45,
  },

  notificationIcon: {
    alignSelf: "flex-end",
  }
});

export default Dashboard;
import BloodPressureW from '@/app/components/BloodPressureW';
import BloodSugarW from '@/app/components/BloodSugarW';
import CGM from '@/app/components/CGM';
import HeartRateW from '@/app/components/HeartRateW';
import NoDataW from '@/app/components/NoDataW';
import OBU from '@/app/components/OBU';
import OxSaturationW from '@/app/components/OxSaturationW';
import Watch from '@/app/components/Watch';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { useFonts } from "expo-font";
import * as Location from "expo-location";
import { useRouter } from 'expo-router';
import React, { JSX, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";
import icons from '../../../../constants/icons';
import { useAuth } from '../../../../contexts/AuthContext';
import DualRadioSelector from '../radiobuttons';




const widgetComponents: Record<string, JSX.Element> = {
  'Heart Rate': <HeartRateW />,
  'O2 Saturation': <OxSaturationW />,
  'Blood Sugar': <BloodSugarW />,
  'Blood Pressure': <BloodPressureW />,
};

const dashboard = () => {

  const [fontsLoaded] = useFonts({
        "Montserrat-Thin": require("../../../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
        "Montserrat-Regular": require("../../../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
        "Montserrat-SemiBold": require("../../../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
        "Montserrat-Medium": require("../../../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
      });

      {/*changement de couleur */}
  const stateText=[
    {id:"1", title:"No Anomaly", value:"Everything is in order for now"},
    {id:"2", title:"Moderate Anomaly", value:"Slight irregularity. Stay cautious"},
    {id:"3", title:"Critical Anomaly", value:"Medical help is on the way"}
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handlePress = () => {
    const nextIndex = (currentIndex + 1) % stateText.length;
    setCurrentIndex(nextIndex);
  };

  const anomaly = stateText[currentIndex];

  const getColor = (id:any) => {
    switch (id) {
      case "1": return "#49A551"; 
      case "2": return "#F89545"; 
      case "3": return "#E52C2C"; 
    }
  };

  {/*affichage de l heure en temps reel */}

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

  {/*affichage de la carte */}
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
        <MapView ref={mapRef} style={styles.map} region={mapRegion} provider={PROVIDER_DEFAULT}>
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

{/*widget data */}
const [showOverlay, setShowOverlay] = useState(false);

const [selectedWidgets, setSelectedWidgets] = useState<string[]>(["Heart Rate", "O2 Saturation"])
useEffect(() => {
  const loadSelectedWidgets = async () => {
    try {
      const savedSelected = await AsyncStorage.getItem("selectedOptions")
      if (savedSelected) {
        setSelectedWidgets(JSON.parse(savedSelected))
      }
    } catch (error) {
      console.error("Error loading saved widget options", error)
    }
  }

  loadSelectedWidgets()
}, [])

const handleWidgetSelectionUpdate = (selected: string[]) => {
  console.log("Selection updated in dashboard:", selected)
  setSelectedWidgets([...selected]) // Create a new array to ensure state update
}

// Render the appropriate widget based on selection
/////////// //FIXME: a revoir avec le back 
const renderWidget = (index: number) => {
  if (selectedWidgets.length > index) {
    const widgetName = selectedWidgets[index]
    return widgetComponents[widgetName] || <NoDataW />
  }
  return <NoDataW />
}
//display du username et pdp

const { user } = useAuth();
const [pdp,setpdp]=useState<any>(null)

useEffect(() => {
  if(user?.pdp){
    setpdp(user.pdp);
    
  }
  else{
    
    setpdp(require("../../../../assets/icons/avatar.png"));
    //console.log(pdp)
  }
}),[user?.pdp];

{/*objets co */}
const [showOverlay1, setShowOverlay1] = useState(false);
const [showOverlay2, setShowOverlay2] = useState(false);
const [showOverlay3, setShowOverlay3] = useState(false);

// ecran alert
const router = useRouter();
useEffect(() => {
  if (currentIndex === 2) {
    router.push("../alert");
  }
}, [currentIndex]);

//couleurs
const [coulCGM, setCoulCGM] = useState("#9C9C9C");
const [coulOBU, setCoulOBU] = useState("#9C9C9C");
const [coulWatch, setCoulWatch] = useState("#9C9C9C");

const [v1, setV1] = useState(false);
const [v2, setV2] = useState(false);
const [v3, setV3] = useState(false);

useEffect(() => {
  const checkWatch = async () => {
    try {
      const watch = await AsyncStorage.getItem('watch');
      if (watch === '1') {
        setCoulWatch('#49a551');
      } else {
        setCoulWatch('#e52c2c');
      }
    } catch (error) {
      console.log('Erreur de lecture AsyncStorage:', error);
      setCoulWatch('#e52c2c'); // fallback en cas d'erreur
    }
    finally{
      setV2(false);
    }
  };

  checkWatch();
}, [v2]);

useEffect(() => {
  const checkCGM = async () => {
    try {
      const CGM = await AsyncStorage.getItem('CGM');
      if (CGM === '1') {
        setCoulCGM('#49a551');
      } else {
        setCoulCGM('#e52c2c');
      }
    } catch (error) {
      console.log('Erreur de lecture AsyncStorage:', error);
      setCoulCGM('#e52c2c'); // fallback en cas d'erreur
    }
    finally{
      setV3(false);
    }
  };

  checkCGM();
}, [v3]);


  return(
    
      <SafeAreaView style={styles.container}>
        {showOverlay && (
                    <View style={[StyleSheet.absoluteFill,{zIndex:5}]}>
                      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            
                      <View style={styles.overlayContent}>
                      <DualRadioSelector initialSelection={selectedWidgets} onSelectionChange={handleWidgetSelectionUpdate} />
            
                        <TouchableOpacity onPress={() => setShowOverlay(false)} style={styles.closeButton}>
                          <Text style={{ color: 'white',  fontFamily:"Montserrat-SemiBold" }}>Close</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
        {showOverlay1 && (
                    <View style={[StyleSheet.absoluteFill,{zIndex:5}]}>
                      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            
                      <View style={styles.overlayContentAlt}>
                      <OBU />
                      <View style={{flexDirection:"row", gap:"5%"}}>
                      <TouchableOpacity style={styles.closeButton}>
                          <Text style={{ color: 'white',  fontFamily:"Montserrat-SemiBold" }}>Connect</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowOverlay1(false)} style={styles.closeButton}>
                          <Text style={{ color: 'white',  fontFamily:"Montserrat-SemiBold" }}>Close</Text>
                        </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
          {showOverlay2 && (
                    <View style={[StyleSheet.absoluteFill,{zIndex:5}]}>
                      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            
                      <View style={styles.overlayContentAlt}>
                      <Watch />
                      <View style={{width:"40%",}}>
                        <TouchableOpacity onPress={() => {setShowOverlay2(false)
                          setV2(true);
                        }} style={styles.closeButton}>
                          <Text style={{ color: 'white',  fontFamily:"Montserrat-SemiBold", fontSize:17,textAlign:"center"}}>Close</Text>
                        </TouchableOpacity>
                        </View>
                        </View>
                      </View>
                    
                  )}
          {showOverlay3 && (
                    <View style={[StyleSheet.absoluteFill,{zIndex:5}]}>
                      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            
                      <View style={styles.overlayContentAlt}>
                      <CGM />  
                      <View style={{width:"40%",}}>
                        <TouchableOpacity onPress={() => {setShowOverlay3(false)
                          setV3(true);
                        }} style={styles.closeButton}>
                          <Text style={{ color: 'white',  fontFamily:"Montserrat-SemiBold", fontSize:17,textAlign:"center"}}>Close</Text>
                        </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
          <View style={styles.header}>
          <View style={styles.headerL}>
            <Image 
            source={typeof pdp === "string" ? { uri: pdp } : pdp}
            style={{width: 45, height: 45,borderRadius:100000}}/>
            <Text style={{
              color:"black", 
              fontSize:20, 
              textAlign:"left", 
              marginLeft:5,
              alignSelf:"center",
              fontFamily: "Montserrat-SemiBold",
              }}>{user?.name} {user?.lastname}</Text>
          </View>
          <View style={styles.headerR}>
          <Ionicons name="notifications" size={25} color="#F05050" style={styles.notificationIcon} />
            </View>
          </View>
          <TouchableOpacity style={styles.state} onPress={handlePress} activeOpacity={0.7}>
          <View style={{flexDirection: 'row',}}>
            <View style={{ flex: 1, 
                  justifyContent: 'center',
                  marginLeft:"5%" }}>
            <Text style={[styles.title, {color:getColor(anomaly.id)}]}>{anomaly.title}</Text>
            <Text style={[styles.value, {color:getColor(anomaly.id)}]}>{anomaly.value}</Text>
            </View>
            <Text style={{
                fontSize: 30,
                fontFamily: "Montserrat-SemiBold",
                textAlign:"right",
                alignSelf:"center",
                color:"black",
                marginRight:"5%",
              }}>
              {time}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.data}>
            <TouchableOpacity style={styles.dataL} onPress={() => setShowOverlay(true)}>
            {renderWidget(0)}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dataR} onPress={() => setShowOverlay(true)}>
            {renderWidget(1)}
            </TouchableOpacity>
            </View>
          <View style={styles.localisation}>
                    {content}
          </View>
          <View style={styles.objects}>
            <TouchableOpacity style={styles.OBU} onPress={() => setShowOverlay1(true)}>
            <View style={{
              width:17,
              height:17,
              backgroundColor:coulOBU, //TODO:
              borderRadius: 50,
              position:"absolute",
              left:"10%",
              top:"10%",
            }}/>
            <Image source={icons.car} style={{width: "45%", height: "45%"}}/>
            <Text style={{
              color:"black", 
              fontSize:22, 
              textAlign:"center", 
              marginTop:5,
              fontFamily: "Montserrat-SemiBold",
            }}>Car</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.watch} onPress={() => setShowOverlay2(true)}>
            <View style={{
              width:17,
              height:17,
              backgroundColor:coulWatch, 
              borderRadius: 50,
              position:"absolute",
              left:"10%",
              top:"10%",
            }}/>
            <Image source={icons.watch} style={{width: "40%", height: "40%"}}/>
            <Text style={{
              color:"black", 
              fontSize:22, 
              textAlign:"center", 
              marginTop:5,
              fontFamily: "Montserrat-SemiBold",
            }}>Watch</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.CGM} onPress={() => setShowOverlay3(true)}>
            <View style={{
              width:17,
              height:17,
              backgroundColor:coulCGM, 
              borderRadius: 50,
              position:"absolute",
              left:"10%",
              top:"10%",
            }}/>
            <Image source={icons.CGM} style={{width: "40%", height: "40%"}}/>
            <Text style={{
              color:"black", 
              fontSize:22, 
              textAlign:"center", 
              marginTop:5,
              fontFamily: "Montserrat-SemiBold",
            }}>CGM</Text>
            </TouchableOpacity>
            </View>
          <View style={styles.total}>
            <Text style={{
              fontSize: 20,
              color:"#353432",
              fontFamily: "Montserrat-SemiBold",
              textAlign:"left",
              marginLeft:"3%"
            }}>
              <Text>Total Alerts: </Text>
              <Text style={{color:"#F05050"}}>3</Text>
              </Text>
            <Text style={{
              fontSize: 20,
              color:"#353432",
              fontFamily: "Montserrat-SemiBold",
              textAlign:"right",
            }}>
              <Text>This Week: </Text>
              <Text style={{color:"#F05050"}}>0</Text>
              </Text>
            </View>  
      </SafeAreaView>
      
  );
};


const styles = StyleSheet.create ({
container:{
  flex: 1, 
  flexDirection: "column",
  backgroundColor:"white",
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
state:{
  height: "9%",
  backgroundColor:"white",
  borderColor:"#9C9C9C",
  borderWidth: 0.5,
  borderRadius: 26,
  marginBottom:"5%",
  justifyContent: 'center',
  marginHorizontal:"5%",
  boxShadow: "0 1 3 1px rgba(0, 0, 0, 0.15)",
  filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))",
},
data:{
  height: "15%",
    flexDirection: 'row',
    marginHorizontal:"5%",
    justifyContent: "space-between",
    marginBottom:"5%",
    gap:"5%"
},
dataL:{
  flex: 1,
  backgroundColor:"white",
  boxShadow: "0 1 3 1px rgba(0, 0, 0, 0.15)",
  filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))",
  borderColor:"#9C9C9C",
  borderWidth: 0.5,
  borderRadius: 26,
},
dataR:{
  flex: 1,
  backgroundColor:"white",
  boxShadow: "0 1 3 1px rgba(0, 0, 0, 0.15)",
  filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))",
  borderColor:"#9C9C9C",
  borderWidth: 0.5,
  borderRadius: 26,
},
localisation:{
  height: "30%",
  flexDirection: 'row',
  alignItems: "center",
  justifyContent: "center",
  marginHorizontal:"5%",
  marginBottom:"5%",
},
objects:{
  height: "14%",
  flexDirection: 'row',
  marginHorizontal:"5%",
  marginBottom:"5%",
  gap: 15,
},
OBU:{
  flex: 1,
  backgroundColor:"white",
  boxShadow: "0 1 3 1px rgba(0, 0, 0, 0.15)",
  filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))",
  borderColor:"#9C9C9C",
  borderWidth: 0.5,
  borderRadius: 26,
  justifyContent: "center",
  alignItems: "center",
  
},
watch:{
  flex: 1,
  backgroundColor:"white",
  boxShadow: "0 1 3 1px rgba(0, 0, 0, 0.15)",
  filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))",
  borderColor:"#9C9C9C",
  borderWidth: 0.5,
  borderRadius: 26,
  justifyContent: "center",
  alignItems: "center",
},
CGM:{
  flex: 1,
  backgroundColor:"white",
  boxShadow: "0 1 3 1px rgba(0, 0, 0, 0.15)",
  filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))",
  borderColor:"#9C9C9C",
  borderWidth: 0.5,
  borderRadius: 26,
  justifyContent: "center",
  alignItems: "center",
},
total:{
  height: "7%",
  flexDirection: 'row',
  marginHorizontal:"5%",
  marginBottom:"5%",
  backgroundColor:"white",
  boxShadow: "0 1 3 1px rgba(0, 0, 0, 0.15)",
  filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))",
  borderColor:"#9C9C9C",
  borderWidth: 0.5,
  borderRadius: 20,
  paddingHorizontal:"4%",
  alignItems: "center",
  gap:"12%",
},
title:{
  fontSize: 20,
  fontFamily: "Montserrat-SemiBold",
  textAlign:"left",
  alignSelf:"flex-start",
},
value:{
  fontSize: 15,
  fontFamily: "Montserrat-Medium",
  textAlign:"left",
  alignSelf:"flex-start",
},
Mcontainer: {
  flex: 1,
},
mapContainer: {
  flex: 1,
},
map: {
  backgroundColor:"white",
  boxShadow: "0 1 3 1px rgba(0, 0, 0, 0.15)",
  filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))",
  borderColor:"#9C9C9C",
  borderWidth: 0.5,
  borderRadius: 26,
  width: "100%",
  height: "100%",
},
notificationIcon: {
  alignSelf: "flex-end",
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
  width:"75%",
  zIndex:5,
  borderWidth:2,
  borderColor:"#9C9C9C"
},
closeButton: {
  marginTop: 0,
  backgroundColor: '#a3a3a3',
  padding: 10,
  borderRadius: 10,
  justifyContent:"center"
},
overlayContentAlt:{
  position: 'absolute',
  top: '35%',
  alignSelf: 'center',
  backgroundColor: 'rgba(255,255,255,1)',
  padding: 25,
  borderRadius: 20,
  alignItems: 'center',
  width:"86%",
  zIndex:5,
  borderWidth:2,
  borderColor:"#9C9C9C"
}
});

export default dashboard;
import CGM from '@/app/components/CGM';
import NoDataW from '@/app/components/NoDataW';
import OBU from '@/app/components/OBU';
import Watch from '@/app/components/Watch';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { useFonts } from "expo-font";
import * as Location from "expo-location";
import { useRouter } from 'expo-router';
import React, { JSX, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";
import icons from '../../../../constants/icons';
import { useAuth } from '../../../../contexts/AuthContext';
import { PercentageCircle } from '../PercentageCircle';
import DualRadioSelector from '../radiobuttons';


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
  const [montrer,setmontrer]=useState(false);
 /* const handlePress = () => {
    const nextIndex = (currentIndex + 1) % stateText.length;
    setCurrentIndex(nextIndex);
  };*/

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
////////////////////////////////////////////////////////////////////////////////////////////////
//blood sugar
const [raison,setraison]=useState("");
// ecran alert
useEffect(() => {
  if (currentIndex === 2) {
    router.push({pathname: "../alert", params:{lat:location?.coords.latitude, long:location?.coords.longitude}});
  }
  if (currentIndex === 1) {
    router.push({pathname: "../alertorange", params:{reason:raison, lat:location?.coords.latitude, long:location?.coords.longitude} });
  }
}, [currentIndex]);

  const [gly, setGly] = useState(1.3);
  const [hyper, setHyper] = useState<boolean | null>(false);
  const [hypo, setHypo] = useState<boolean | null>(false);
  const intervalRef = useRef<number | null>(null);


  const handlehyper = () => setHyper(!hyper);
  const handlehypo = () => setHypo(!hypo);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setGly((prev) => {
        if (hyper === true) {
          setraison("hyper");
          setCurrentIndex(1);
          return 3.01;}
        if (hypo === true) {
          setraison("hypo");
          setCurrentIndex(1);
          return 0.43;}

        if (prev > 0.63) return prev - 0.1;
        return prev + 0.3;
      });
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hyper, hypo]);


/////////////////////////////////////////////////////////////////////////////////////////////////
//heart rate
const [avc,setavc] = useState(false)

const handleavc = () => setavc(!avc);

useEffect(() => {
  if (avc === true) {
    setCurrentIndex(2)
  }
}, [avc]);

const [heartRate, setHeartRate] = useState(75); 

useEffect(() => {
  const interval = setInterval(() => {
    setHeartRate((prev) => {
      const variation = Math.floor(Math.random() * 5) - 2; 
      let newRate = prev + variation;

      
      if (newRate < 61) newRate = 61;
      if (newRate > 100) newRate = 100;

      return newRate;
    });
  }, 1000); 

  return () => clearInterval(interval);
}, []);
/////////////////////////////////////////////////////////////////////////////////////
//pression arterielle
const [systolic, setSystolic] = useState(120); 
  const [diastolic, setDiastolic] = useState(80); 

  useEffect(() => {
    const interval = setInterval(() => {
      setSystolic((prev) => {
        const variation = Math.floor(Math.random() * 5) - 2; 
        let newVal = prev + variation;
        if (newVal < 100) newVal = 100;
        if (newVal > 130) newVal = 130;
        return newVal;
      });

      setDiastolic((prev) => {
        const variation = Math.floor(Math.random() * 5) - 2; 
        let newVal = prev + variation;
        if (newVal < 60) newVal = 60;
        if (newVal > 90) newVal = 90;
        return newVal;
      });
    }, 1000); 

    return () => clearInterval(interval);
  }, []);
////////////////////////////////////////////////////////////////////////
//o2 saturation
const [spo2, setSpo2] = useState(98); // valeur de départ

  useEffect(() => {
    const interval = setInterval(() => {
      setSpo2((prev) => {
        const variation = Math.floor(Math.random() * 3) - 1; // -1, 0 ou +1
        let newVal = prev + variation;
        if (newVal < 95) newVal = 95;
        if (newVal > 100) newVal = 100;
        return newVal;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
//////////////////////////7
const widgetComponents: Record<string, JSX.Element> = {
  'Heart Rate': 
  <View style={{}}>
  <Text style={{
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: "#000000",
    textAlign: "center",
    marginTop:"5%",
  }}>Heart Rate</Text>
  <Text style={{
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    textAlign: "center",
    marginLeft:"-50%",
    marginTop:"8%",
  }}>
    <Text style={{color:"#F05050"}}>{heartRate}</Text>
    <Text style={{color:"black"}}>{"\n"}BPM</Text>
    </Text>
  <Image source={icons.ECG} style={{
  width:"50%",
  height:"50%",
  marginTop:"-28%",
  marginLeft:"45%",
  }}/>
  </View>,

  'O2 Saturation': 
    <View style={{alignItems:"center"}}>
          <Text style={{
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: 20,
                    color: "#000000",
                    textAlign: "center",
                    marginTop:"5%",
                    marginBottom:"2%"
                  }}>O2 Saturation</Text>
                  <PercentageCircle 
                  percentage={spo2}
                  radius={35}
                  strokeWidth={6}
                  color="#F05050"
                  textSize={18}
                />
          </View>,

  'Blood Sugar':  <View>
                  <Text style={{
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: 20,
                  color: "#000000",
                  textAlign: "center",
                  marginTop:"5%",
                }}>Blood Sugar</Text>
                <Image source={icons.blood} style={{width:"32%",height:"57%", marginTop:"5%",marginLeft:"8%"}}/>
                <Text style={{
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: 20,
                  textAlign: "center",
                  marginLeft:"30%",
                  marginTop:"-30%",
                }}>
                <Text style={{color:"#F05050"}}>{gly.toString().slice(0,4)}</Text>
              <Text style={{color:"black"}}>{"\n"}mg/dL</Text>
                </Text>
                </View>,

  'Blood Pressure': <View>
          <Text style={{
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: 20,
                    color: "#000000",
                    textAlign: "center",
                    marginTop:"5%",
                  }}>Blood Pressure</Text>
                  <Text style={{
                    fontFamily:"MontSerrat-SemiBold",
                    fontSize:20,
                    textAlign:"center",
                    marginHorizontal:"5%",
                    marginTop:"5%"
                  }}>
                  <Text style={{color:"#F05050",fontSize:23}} >Sys </Text>
                  <Text>{systolic} </Text>
                  <Text style={{fontSize:14}}>mmHg</Text>
                  </Text>
                  <Text style={{
                    fontFamily:"MontSerrat-SemiBold",
                    fontSize:20,
                    textAlign:"center",
                    marginHorizontal:"5%",
                    marginTop:"1%"
                  }}>
                  <Text style={{color:"#F05050", fontSize:23}}>Dia </Text>
                  <Text>{diastolic} </Text>
                  <Text style={{fontSize:14}}>mmHg</Text>
                  </Text>
                   </View>,
};

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
const router = useRouter();


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

useEffect(() => {
  const checkOBU = async () => {
    try {
      const OBU = await AsyncStorage.getItem('OBU');
      if (OBU === '1') {
        setCoulOBU('#49a551');
      } else {
        setCoulOBU('#e52c2c');
      }
    } 
    catch (error) {
      console.log('Erreur de lecture AsyncStorage:', error);
      setCoulOBU('#e52c2c'); // fallback en cas d'erreur
    }
    finally{
      setV1(false);
    }
  };

  checkOBU();
}, [v1]);


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
                            <View style={{width:"40%",}}>
                              <TouchableOpacity onPress={() => {setShowOverlay1(false)
                                setV1(true);
                                }} style={styles.closeButton}>
                                <Text style={{ color: 'white',  fontFamily:"Montserrat-SemiBold", fontSize:17,textAlign:"center"}}>Close</Text>
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
          {montrer && (
            <View style={{gap:5}}>
          <View style={{marginTop:10, flexDirection:"row",gap:8}}>
          <TouchableOpacity onPress={handlehyper} style={{height:20,width:30,borderRadius:1000,backgroundColor:hyper ? "#B3FFB3":"#FFB3B3",alignItems:"center",justifyContent: "center"}}><Text style={{color:"white", fontWeight:"bold",fontSize:17, alignSelf:"center"}}>+</Text></TouchableOpacity>
          <TouchableOpacity onPress={handlehypo} style={{height:20,width:30,borderRadius:1000,backgroundColor:hypo ?"#B3FFB3" :"#B3D9FF",alignItems:"center",justifyContent: "center"}}><Text style={{color:"white", fontWeight:"bold",fontSize:17, alignSelf:"center"}}>-</Text></TouchableOpacity>
          <TouchableOpacity onPress={handleavc} style={{height:20,width:30,borderRadius:1000,backgroundColor:avc ?"#B3FFB3" :"#FFF9C4",alignItems:"center",justifyContent: "center"}}><Text style={{color:"white", fontWeight:"bold",fontSize:17, alignSelf:"center"}}>H</Text></TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=>setCurrentIndex(0)} style={{height:20,width:30,borderRadius:1000,backgroundColor:"#B3FFB3",alignItems:"center",justifyContent: "center"}}/>
            </View>
          )}
          <Pressable onPress={() => router.push('../notification')}>
          <View style={styles.headerR}>
          <Ionicons name="notifications" size={25} color="#F05050" style={styles.notificationIcon} />
            </View>
            </Pressable>
          </View>
          <TouchableOpacity style={styles.state} onPress={()=>setmontrer(!montrer)} activeOpacity={1}>
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
              color:"black",
              fontFamily: "Montserrat-SemiBold",
              textAlign:"left",
              marginLeft:"3%"
            }}>
              <Text>Total Alerts: </Text>
              <Text style={{color:"#F05050"}}>3</Text>
              </Text>
            <Text style={{
              fontSize: 20,
              color:"black",
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
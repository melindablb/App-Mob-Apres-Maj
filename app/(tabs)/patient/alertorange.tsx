import { useAuth } from '@/contexts/AuthContext';
import { AlerteDiabete } from '@/services3/AlerteDiabete';
import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from "expo-font";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const AlertOrange = () =>{
    

    const { reason, lat, long } = useLocalSearchParams();
    
    const { user } = useAuth();
    const [canceled, setcanceled] = useState(false);
    const router = useRouter();


    useFocusEffect(
      useCallback(() => {
        if (canceled) {
          router.back();
        }
      }, [canceled])
    );

     const [fontsLoaded] = useFonts({
          "Montserrat-Thin": require("../../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
          "Montserrat-Regular": require("../../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
          "Montserrat-SemiBold": require("../../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
          "Montserrat-Medium": require("../../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
        });
        // compte a rebours
        const [secondsLeft, setSecondsLeft] = useState(30);

        useEffect(() => {
          if (secondsLeft === 0) return;
      
          const interval = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
          }, 1000);
      
          return () => clearInterval(interval);
        }, [secondsLeft]);
        //////////////////////////////////////////
        // affichage de l heure
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

/////////////////////////////////////////////////
// retours vers dashboard s il reste 0 sec

useEffect(() => {
    const handletimeout = async () => {
  if (secondsLeft === 0) {
    //TODO: env de l alerte diabete
    const formdata = new FormData();
    formdata.append("idPatientt", user?.uid || "");
    formdata.append("raison", Array.isArray(reason) ? reason[0] : reason ?? "");
    formdata.append("latitude", Array.isArray(lat) ? lat[0] : lat ?? "");
    formdata.append("longitude", Array.isArray(long) ? long[0] : long ?? "");
    try{
        const result = await AlerteDiabete(formdata);
        console.log(result.data);
    }
    catch(error){
      console.log(error);
    }
    router.back();
  }
}
handletimeout();
}, [secondsLeft]);

    return(
    <View style={styles.container}>
        
        <View style={styles.title}>
            <Text style={styles.text}>
            <Text style={{fontSize:40}}>ALERT{"\n"}</Text>
            <Text style={{fontSize:20}}>MODERATE ANOMALY{"\n"}</Text>
            <Text style={{color:"white",fontFamily:"Montserrat-SemiBold",fontSize:25,textAlign:"center",alignSelf:"center"}}>{time}</Text>
            </Text>
        </View>    
        
        <View style={styles.message}>
        <Text style={{textAlign:"center",fontSize:25,color:"white",fontFamily:"Montserrat-Medium"}}>We are currently locating an available healthcare professional. You will receive a call shortly.{"\n"}If everything's okay now, feel free to cancel the alert.</Text>
        </View>
        <TouchableOpacity style={styles.cancelbutton} activeOpacity={0.8} onPress={()=>{
            setcanceled(true)
            router.back()
        }}>
            <Text style={{fontFamily:"Montserrat-SemiBold",fontSize:25,color:"#E68333"}}>Cancel Help</Text>
        </TouchableOpacity>
        <Text style={{marginTop:"2%",fontSize:17,color:"white",fontFamily:"Montserrat-Regular"}}>Time left to cancel: {secondsLeft}s</Text>
    </View>
    );
}

const styles = StyleSheet.create({
container:{
    flex:1,
    backgroundColor:"#E68333",
    alignItems:"center"
},
text:{
    textAlign:"center",
    color:"white",
    fontFamily:"Montserrat-SemiBold",
    textShadowColor: 'rgba(0, 0, 0,0.35)',
    textShadowOffset: { width: 0, height: 2 }, 
    textShadowRadius: 10
},
title:{
    marginTop:"30%",
    width:260,
    height:260,
    borderRadius:9999,
    backgroundColor:"#E68333",
    borderColor:"white",
    borderWidth:7,
    boxShadow: "2px 3px 7px rgba(0, 0, 0, 0.35)",
    justifyContent:"center"
},
message:{
alignItems:"center",
marginTop:"10%",
paddingHorizontal:"10%",
},
cancelbutton:{
    marginTop:"15%",
    height:"7%",
    borderRadius:17,
    width:"46%",
    backgroundColor:"white",
    alignItems:"center",
    justifyContent:"center",
    boxShadow: "2px 2px 7px rgba(0, 0, 0, 0.25)",
},
});

export default AlertOrange;
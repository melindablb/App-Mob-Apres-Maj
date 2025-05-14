import React, { useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from "expo-font";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Alert = () =>{
    
  const navigation = useNavigation();


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
  if (secondsLeft === 0) {
    router.back();
  }
}, [secondsLeft]);

    return(
    <View style={styles.container}>
        
        <View style={styles.title}>
            <Text style={styles.text}>
            <Text style={{fontSize:40}}>ALERT{"\n"}</Text>
            <Text style={{fontSize:20}}>CRITICAL ANOMALY{"\n"}</Text>
            <Text style={{color:"white",fontFamily:"Montserrat-SemiBold",fontSize:25,textAlign:"center",alignSelf:"center"}}>{time}</Text>
            </Text>
        </View>    
        
        <View style={styles.message}>
        <Text style={{textAlign:"center",fontSize:25,color:"white",fontFamily:"Montserrat-Medium"}}>Help is on the way.{"\n"}If someone can drive you, please cancel the ride. Either way, stop moving and stay in place.</Text>
        </View>
        <TouchableOpacity style={styles.cancelbutton} activeOpacity={0.8} onPress={()=>{
            setcanceled(true)
            router.back()
        }}>
            <Text style={{fontFamily:"Montserrat-SemiBold",fontSize:25,color:"#F05050"}}>Cancel Help</Text>
        </TouchableOpacity>
        <Text style={{marginTop:"2%",fontSize:17,color:"white",fontFamily:"Montserrat-Regular"}}>Time left to cancel: {secondsLeft}s</Text>
    </View>
    );
}

const styles = StyleSheet.create({
container:{
    flex:1,
    backgroundColor:"#F05050",
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
    backgroundColor:"#F05050",
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

export default Alert;
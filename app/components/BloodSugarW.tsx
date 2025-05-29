import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import icons from '../../constants/icons';

const BloodSugarW = () => {

   const [activer,setactiver] = useState(false);
      const [connexion, setConnexion] = useState<any>(null);
      const [gly, setgly] = useState(0);
  
      useEffect (() => {
          //if (activer) {
            
    const newconnexion = new HubConnectionBuilder()
        .withUrl("http://192.168.1.102:5003/valeurtempsreelglycemie")
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();
    
        setConnexion(newconnexion);
      //}
      //else {
          //return;
      //}
      },[activer]);
      
      useEffect(() => {
          if (connexion) {
              connexion.start()
                .then(() => {
                  console.log("Connected to SignalR");
                  connexion.on("ReceiveGlycemia", (value:any) => {
                    setgly(value);
                  });
                  connexion.invoke("StartSimulation", "true","62DD9EA0-8AB5-47EF-9663-B958AE427E17","3.18291","36.72615");
                })
                .catch((error: any) => {
                  console.log("SignalR Connection Error: ", error);
                });
            }
          }, [connexion]);


    return(
        <View>
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
        <Text style={{color:"#F05050"}}>{gly.toString().slice(0, 4)}</Text>
       <Text style={{color:"black"}}>{"\n"}mg/dL</Text>
        </Text>
        </View>
    );
}

export default BloodSugarW;
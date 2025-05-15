import { useAuth } from "@/contexts/AuthContext";
import { ConnectSmartwatchNG, DisconnectSmartwatchNG, GetStateSmartwatchNG } from "@/services3/SmartwatchNG";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Watch = () => {
        const [fontsLoaded] = useFonts({
                    "Montserrat-Thin": require("../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
                    "Montserrat-Regular": require("../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
                    "Montserrat-SemiBold": require("../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
                    "Montserrat-Medium": require("../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
                  });

        const { user, UpdateData } = useAuth();
        const [state, setState] = React.useState("Disconnected");
        const [connexion,setConnexion]=useState(false);
        const [ipAdd,setIP]=useState("/");
        const [macAdd,setMac]=useState("/");
        const [bouton,setBouton]=useState("Connect");
        

        useEffect( () => {
            const fetchData = async () => {
            const formData = new FormData();
            formData.append("idPatientt",user?.uid || "");
            try{
                const result = await GetStateSmartwatchNG(formData);
                console.log("info montre : ",result.data);
                if(result.data.isconnected){
                    setState("Connected");
                    setIP(result.data.adrip);
                    setMac(result.data.adrmac);
                    setConnexion(true);
                    setBouton("Disconnect");
                    await AsyncStorage.setItem('watch', "1");
                }
                else{
                    setState("Disconnected");
                    setIP("/");
                    setMac("/");
                    setConnexion(false);
                    setBouton("Connect");
                    await AsyncStorage.setItem('watch', "0");
                }
            }
            catch (error) {
                console.error("Error:iciiiii", error);
            }
        }
        fetchData();
        });

        const handlePress = async () => {
            const formData = new FormData();
            formData.append("idPatientt",user?.uid || "");
            console.log(formData);
            if(bouton==="Connect"){ //connexion
            try{
                const response = await ConnectSmartwatchNG(formData);
                setState("Connected");
                setIP(response.data.ipAdress);
                setMac(response.data.adrmac);
                setConnexion(true);
                setBouton("Disconnect");
                await AsyncStorage.setItem('watch', "1");
            }
            catch (error) {
                console.error("Error:laaaaa", error);
            }
            }
            else{   //deco
                try{
                    const response = await DisconnectSmartwatchNG(formData);
                    console.log(response.data);
                    setState("Disconnected");
                    setIP("/");
                    setMac("/");
                    setConnexion(false);
                    setBouton("Connect");
                    await AsyncStorage.setItem('watch', "0");
                }
                catch (error) {
                    console.error("Error:", error);
                }
            }
        }


            return(
                <View>
                <Text style={styles.title}>Watch</Text>
                <Text style={{textAlign:"left"}}>
                <Text style={styles.props}>Link Status: </Text>   
                <Text style={styles.data}>{state}{"\n"}</Text> 
                <Text style={styles.props}>IP Adress: </Text>
                <Text style={styles.data}>{ipAdd}{"\n"}</Text> 
                <Text style={styles.props}>MAC Adress: </Text> 
                <Text style={styles.data}>{macAdd}{"\n"}</Text> 
                </Text>
                <View style={{marginBottom:"3%",alignItems:"center"}}>
                        <TouchableOpacity onPress={handlePress}
                        style={{backgroundColor:"#F05050", padding:10, borderRadius:10, alignItems:"center", justifyContent:"center",width:"75%"}}>
                          <Text style={{ color: 'white',  fontFamily:"Montserrat-SemiBold",fontSize:17 }}>{bouton}</Text>
                        </TouchableOpacity>
                        
                        </View>
                </View>
            );
        }
        const styles=StyleSheet.create({
        title:{
        fontFamily:"Montserrat-SemiBold",
        fontSize:24,
        textAlign:"center",
        marginBottom:"5%"
        },
        props:{
        fontFamily:"Montserrat-SemiBold",
        fontSize:18,
        textAlign:"left", 
        },
        data:{
        fontFamily:"Montserrat-Medium",
        fontSize:16,
        textAlign:"left", 
        color:"#F05050"
        },
        });

export default Watch;



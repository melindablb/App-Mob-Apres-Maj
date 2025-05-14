import {View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform} from 'react-native';
import React, { useEffect, useState } from 'react';
import images from '../../constants/images';
import icons from '../../constants/icons';
import { useFonts } from "expo-font";
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from "react-native-maps"
import * as Location from "expo-location"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from "@expo/vector-icons"
import Svg, { Circle } from 'react-native-svg';
import { PercentageCircle } from '../(tabs)/PercentageCircle';

const CGM = () => {
   const [fontsLoaded] = useFonts({
               "Montserrat-Thin": require("../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
               "Montserrat-Regular": require("../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
               "Montserrat-SemiBold": require("../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
               "Montserrat-Medium": require("../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
             });
   
       return(
           <View>
           <Text style={styles.title}>CGM</Text>
           <Text>
           <Text style={styles.props}>Link Status: </Text>   
           <Text style={styles.data}>data {"\n"}</Text> 
           <Text style={styles.props}>IP Adress: </Text>
           <Text style={styles.data}>data {"\n"}</Text> 
           <Text style={styles.props}>MAC Adress: </Text> 
           <Text style={styles.data}>data {"\n"}</Text> 
           </Text>
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

export default CGM;
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

const BloodSugarW = () => {
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
        <Text style={{color:"#F05050"}}>80</Text>
        <Text style={{color:"black"}}>{"\n"}mg/dL</Text>
        </Text>
        </View>
    );
}

export default BloodSugarW;
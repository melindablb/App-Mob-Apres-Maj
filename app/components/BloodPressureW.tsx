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

const BloodPressureW = () => {
    return(
        <View>
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
                <Text>120 </Text>
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
                <Text>80 </Text>
                <Text style={{fontSize:14}}>mmHg</Text>
                </Text>
        </View>
    );
}

export default BloodPressureW;
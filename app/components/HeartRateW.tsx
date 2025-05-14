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

const HeartRateW = () => {
    return(
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
          <Text style={{color:"#F05050"}}>110</Text>
          <Text style={{color:"black"}}>{"\n"}BPM</Text>
          </Text>
        <Image source={icons.ECG} style={{
        width:"50%",
        height:"50%",
        marginTop:"-28%",
        marginLeft:"45%",
        }}/>
        </View>
    );
}

export default HeartRateW;
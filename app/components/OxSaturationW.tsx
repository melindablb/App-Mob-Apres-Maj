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

const OxSaturationW = () => {
    return(
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
                percentage={89}
                radius={35}
                strokeWidth={6}
                color="#F05050"
                textSize={18}
              />
        </View>
    );
}

export default OxSaturationW;
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

const NoDataW = () => {
    return(
        <View style={{alignItems:"center"}}>
         <Text style={{
                  fontFamily:"Montserrat-SemiBold",
                  fontSize:22,
                  textAlign:"center",
                }}>No Data Available</Text>
        </View>
    );
}

export default NoDataW;
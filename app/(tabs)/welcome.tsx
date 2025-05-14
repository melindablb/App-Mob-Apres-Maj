import { useRouter } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import icons from '../../constants/icons'
import images from '../../constants/images'

const Welcome = () => { 
  
  const router = useRouter();
  return (
    <View style={{backgroundColor: 'white', flex:1}}>
      <Image source={images.designacc} style={{
        position: 'absolute',
        top: 0,
        width: '99.99%',
        height:"41%"
      }} 
      />
    <View style={{
      flex:1,
      alignItems:"center",
      marginTop:"30%",
    }}>
    <Text style={{
      fontSize: 53,
      fontFamily: 'Montserrat-SemiBold',
      color: "white",
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0,0.35)',
      textShadowOffset: { width: 0, height: 2 }, 
      textShadowRadius: 3
      }}>
      Welcome To
    </Text>
      </View>
    <View style={{
      flex:1,
      alignItems:"center",
      marginTop:"-45%",
    }}>
    <Image source={icons.logoR} style={{
      width: "25%",
      height: "22%",
      alignSelf: 'center',
      //marginBottom:"85%"
    }}/>
    <Text style={{
      //position: 'absolute',
      //bottom: 343,
      fontSize: 32,
      fontFamily: 'Montserrat-SemiBold',
      color: "#F05050",
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0,0.25)',
      textShadowOffset: { width: 0, height: 2 }, 
      textShadowRadius: 2,
      }}>
      E-Mergency
    </Text>
    <Text style={{
      //position: 'absolute',
      //bottom: 305,
      fontSize: 15,
      marginLeft: 40,
      marginRight: 40,
      fontFamily: 'Montserrat-SemiBold',
      color: "#F05050",
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.25)',
      textShadowOffset: { width: 0, height: 1 }, 
      textShadowRadius: 2,
      }}>
      An IoT-based emergency detection and alert system
    </Text>
    </View> 

    <View style={{alignItems:"center",}}>
    <TouchableOpacity style={{
      position: 'absolute',
      bottom: 137,
      width: 341,
      height: 65,
      backgroundColor: "#F05050",
      borderRadius: 20,
      boxShadow: "0px 2px 7px rgba(0, 0, 0, 0.25)"
    }} activeOpacity={0.8} onPress={() => router.replace("/choosesignup")}>
    <Text style={{
      fontSize: 25,
      textAlign: "center",
      fontFamily: 'Montserrat-SemiBold',
      color: "white",
      lineHeight: 65,
      textShadowColor: 'rgba(0, 0, 0, 0.30)',
      textShadowOffset: { width: 0, height: 0.1 }, 
      textShadowRadius: 4
    }}>Join Us Now</Text>
    </TouchableOpacity>

    <TouchableOpacity style={{
        position: 'absolute',
        bottom: 100,
    }}activeOpacity={0.8} onPress={() => router.replace("/signin")}>
    <Text style={{
      fontSize: 16,
      fontFamily: 'Montserrat-SemiBold',
      color: "#F05050",
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.30)',
      textShadowOffset: { width: 0, height: 0.1 }, 
      textShadowRadius: 4,
      }}>
    I already have an account
    </Text>
    </TouchableOpacity>
  </View>
    </View>
  );
};


export default Welcome;
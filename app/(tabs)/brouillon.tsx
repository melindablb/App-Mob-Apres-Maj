import {View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform, FlatList, TextInput} from 'react-native';
import React, { useEffect, useState } from 'react';
import images from '../../constants/images';
import icons from '../../constants/icons';
import { useFonts } from "expo-font";
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from "react-native-maps"
import * as Location from "expo-location"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from "@expo/vector-icons"
import Svg, { Circle } from 'react-native-svg';
import { PercentageCircle } from './PercentageCircle';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { BlurView } from 'expo-blur';


type friend = {
  Id:string;
  Name:string;
  PhoneNumber:string;
}

type ItemProps = {
  item: friend;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Brouillon = () => {

  const [fontsLoaded] = useFonts({
    "Montserrat-Thin": require("../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    "Montserrat-Regular": require("../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "Montserrat-Medium": require("../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
  });
///////////////////////////
  const [selectedId, setSelectedId] = useState<string>();
  const Item = ({item, onPress, backgroundColor, textColor}: ItemProps) => (
    <TouchableOpacity onPress={onPress} style={{}}>
      <Text>{item.Name}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}: {item: friend}) => {
    const backgroundColor = item.Id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.Id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.Id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

///////////////////////
const [friends , setfriends] = useState<friend[]>([]);
const [newfriend, setnewfriend]= useState<friend | null>(null);
const [name, setname] = useState("");
const [phone, setphone] = useState("");


const addFriend = (name:string, phone:string) =>{
    const id2=uuidv4();
    console.log("id:",id2);
    const newfriend: friend={
      Id: id2,
      Name: name,
      PhoneNumber: phone
    };
    setfriends((prev)=>[...prev, newfriend])
}

const [showOverlay, setShowOverlay] = useState(false);

 
  return(
    <View style={{backgroundColor:"white",alignItems:"center",flex:1,flexDirection:"column"}}>
      {showOverlay && (
        <View style={[StyleSheet.absoluteFill,{zIndex:5}]}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
           <View style={styles.overlayContent}>

           <TextInput
              style={{height:"15%",width:"80%",backgroundColor:"beige",marginHorizontal:"10%",paddingHorizontal:"4%"}}
              placeholder='name'
              placeholderTextColor={"black"}
              value={name}
              onChangeText={setname}
              />
          <TextInput
              style={{height:"15%",width:"80%",backgroundColor:"beige",marginHorizontal:"10%",paddingHorizontal:"4%"}}
              placeholder='phone'
              placeholderTextColor={"black"}
              value={phone}
              onChangeText={setphone}
          />
          <TouchableOpacity 
            style={{height:"15%",width:"40%",backgroundColor:"black",marginHorizontal:"10%",paddingHorizontal:"4%"}}
            onPress={() => addFriend(name,phone)}>
            <Text style={{alignSelf:"center",color:"white" }}>
            Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{height:"15%",width:"40%",backgroundColor:"black",marginHorizontal:"10%",paddingHorizontal:"4%"}}
            onPress={() => setShowOverlay(false)}>
            <Text style={{alignSelf:"center",color:"white" }}>
            close</Text>
          </TouchableOpacity>
           </View>
        </View>
      )}
      <Text style={{fontSize:30,alignSelf:"center",marginTop:"10%"}}>Friends</Text>
      <FlatList
      data={friends}
      keyExtractor={item => item.Id}
      renderItem={renderItem}
      />
      <TouchableOpacity 
      onPress={() => setShowOverlay(true)}
      style={{marginBottom:"20%", width:"25%",height:"5%",backgroundColor:"pink"}}>
        <Text>New Friend</Text>
      </TouchableOpacity>
    </View>
  )};

const styles = StyleSheet.create({
  overlayContent: {
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    padding: 25,
    borderRadius: 30,
    alignItems: 'center',
    width:"75%",
    height:"40%",
    zIndex:5,
    borderWidth:2,
    borderColor:"#9C9C9C"
  },
});

export default Brouillon;
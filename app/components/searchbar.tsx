import {View, Text, StyleSheet,Image, TouchableOpacity, TextInput} from 'react-native';
import React, { useState }  from 'react';  
import { useFonts } from 'expo-font';
import images from '../../constants/images'
import icons from '../../constants/icons'

export default function SearchBar ({ onSearch }: { onSearch: (query: string) => void }) {

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        onSearch(text); 
    };

const [fontsLoaded] = useFonts({
        "Montserrat-Thin": require("../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
        "Montserrat-Regular": require("../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
        "Montserrat-SemiBold": require("../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
        "Montserrat-Medium": require("../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
      });

      return(
        <TouchableOpacity style={styles.searchbar} activeOpacity={0.7}>
            <Image source={icons.loupe} style={{width:"7%",height:"52%",}}/>
            <TextInput
                placeholder=" Search for a friend..."
                style={{fontFamily:"Montserrat-Medium", marginLeft:"5%",fontSize:17, width:"100%"}}
                value={searchQuery}
                onChangeText={handleSearch}
                placeholderTextColor="#aaa"
                cursorColor={"red"}
            />
        </TouchableOpacity>
      );
    }

const styles = StyleSheet.create({
    searchbar:{
        flexDirection:"row",
        //justifyContent:"flex-end",
        paddingHorizontal:"4%",
        alignItems:"center",
        height:"24%",
        backgroundColor:"white",
        borderColor:"#F05050",
        borderWidth:1,
        borderRadius:20,
        marginHorizontal:"5%",
        boxShadow: "0 1 3 1px rgba(0, 0, 0, 0.15)",
        filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))",
      },
});

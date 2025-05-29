import icons from '@/constants/icons';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const OBU = () => {
  const [isConnected, setIsConnected] = useState(false);

  const handlePress = () => {
    setIsConnected(prev => !prev);
  };

  return (
    <View style={styles.container}>
      {/* LED dynamique */}
      

      
    <View style={{width:25}}></View>
      {/* Infos et bouton à droite */}
      <View style={styles.leftSection}>
        <Text style={styles.label}>
          Link Status:{"\n"}<Text style={styles.data}>{isConnected ? 'Connected' : 'Disconnected'}</Text>
        </Text>
        <Text style={styles.label}>
          IP Address:{"\n"}<Text style={styles.data}>{isConnected ? '192.168.1.2' : '--'}</Text>
        </Text>
        <Text style={styles.label}>
          MAC Address:{"\n"}<Text style={styles.data}>{isConnected ? '00:1B:44:11:3A:B7' : '--'}</Text>
        </Text>

      </View>

      {/* Icône de voiture et nom */}
      <View style={styles.rightSection}>
        <Image source={icons.car} style={styles.carIcon} />
        <Text style={styles.carLabel}>Car</Text>
        
        <TouchableOpacity style={styles.disconnectButton} onPress={handlePress}>
          <Text style={styles.disconnectText}>{isConnected ? 'Disconnect' : 'Connect'}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.statusDot, { backgroundColor: isConnected ? '#49a551' : '#e52c2c' }]} />
    </View>
  );
};

export default OBU;

const styles = StyleSheet.create({
  container: {
    height: 140,
    flexDirection: 'row',
    //padding: 20,
    flex: 1,
    backgroundColor: 'white',
    borderColor: '#9C9C9C',
    borderWidth: 0.5,
    borderRadius: 26,
    //alignItems: 'center',
    //justifyContent: 'space-between',
    //position: 'relative',
    marginHorizontal: '5%',
    marginBottom: '5%',
    //gap: 15,
  },
  statusDot: {
    //position: 'absolute',
    //top: 12,
    //left: 12,
    marginTop: 10,
    marginRight: 15,
    width: 17,
    height: 17,
    borderRadius: 1000,
    zIndex: 2,
  },
  leftSection: {
    //position:"fixed",
    alignItems:"flex-start",
    justifyContent: "center",
    marginRight: 30,
    marginLeft: "3%",
  },
  carIcon: {
    width: 60,
    height: 60,
    tintColor: "#F05050",
    resizeMode: 'contain',
    alignSelf:"center",
    //marginRight:"20%"
    //marginTop: 11,
    //marginLeft: 10,
  },
  carLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    alignSelf:"center",
    
    marginTop: -4,
    //marginRight: "25.5%",
    color: "#000000",
  },
  rightSection: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 6,
    alignContent: 'center',
    marginLeft: 15,
    alignItems:"flex-end",
    textAlign: 'center',
    
  },
  label: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#000',
    //marginBottom: 0,
    textAlign: 'left',

  },
  data: {
    color: "#F05050",
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
  },
  disconnectButton: {
    marginTop: 4,
    backgroundColor:"#F05050",
    paddingVertical: 8,
    paddingHorizontal: 16,
    //marginLeft: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  disconnectText: {
    color: "#FFFFFF",
    fontFamily: 'Montserrat-SemiBold',
  },
});



import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from "expo-font";
import icons from '../../constants/icons';

const ChoiceSU = () => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const router = useRouter();

  const handleNext = () => {
    if (selectedUser === 'healthcare pro') {
      router.push('./healthcarepro/signup');
    } else if (selectedUser === 'patient') {
      router.push('./patient/signup');
    }
  };

  const [fontsLoaded] = useFonts({
    "Montserrat-Thin": require("../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    "Montserrat-Regular": require("../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf")
  });

  return (
    <View style={styles.container}>


<Image source={icons.logoB} style={{
        width: 60,
        height: 60,
        marginTop:"11%"
    }}/>
    <Text style={{
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 22,
        color:"white",
        marginTop:"1%",
        textShadowColor: 'rgba(0, 0, 0,0.35)',
        textShadowOffset: { width: 0, height: 2 }, 
        textShadowRadius: 2
    }}>E-Mergency</Text>


      <Text style={styles.title}>You are a...</Text>

      <View style={styles.radioGroup}>
        {[
          { value: "patient", icon: icons.patientB, label: "Patient" },
          { value: "healthcare pro", icon: icons.healthproB, label: "Healthcare Pro" },
        ].map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[styles.radioContainer, selectedUser === item.value && styles.selectedContainer]}
            onPress={() => setSelectedUser(item.value)}
            activeOpacity={0.7}
          >
            <View style={[styles.radioCircle, selectedUser === item.value && styles.selectedCircle]} />
            <Image source={item.icon} style={styles.icon} />
            <Text style={[styles.label, selectedUser === item.value && styles.selectedText]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedUser && (
        <TouchableOpacity onPress={handleNext} style={styles.nextButton} activeOpacity={0.7}>
          <Text style={styles.nextButtonText}>Next</Text>
          <Image source={icons.next} style={styles.nextIcon} />
        </TouchableOpacity>
      )}


      <TouchableOpacity style={{
                      flexDirection: "row",  
                      marginTop:"20%"
                  }}activeOpacity={0.8} onPress={() => router.back()}>
                    <Image source={icons.back} style={{
                        width:30,
                        height:30
                    }}/>
                  <Text style={{
                    fontSize: 22,
                    fontFamily: 'Montserrat-SemiBold',
                    color: "white",
                    textAlign: 'center',
                    textShadowColor: 'rgba(0, 0, 0, 0.30)',
                    textShadowOffset: { width: 0, height: 0.1 }, 
                    textShadowRadius: 4,
                    }}>
                  Go Back
                  </Text>
                  </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 50,
    backgroundColor: "#F05050",
    alignItems: "center",
    //justifyContent: "center",
  },
  title: {
    fontSize: 48,
    marginTop:"30%",
    color: "white",
    textAlign: "center",
    marginBottom: "8%",
    fontFamily: "Montserrat-SemiBold",
    textShadowColor: 'rgba(0, 0, 0, 0.30)',
    textShadowOffset: { width: 0, height: 2 }, 
    textShadowRadius: 4,
  },
  radioGroup: {
    width: "100%",
    alignItems: "center",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    paddingVertical: "4%",
    paddingHorizontal: "5%",
    borderRadius: 10,
    marginVertical: "2%",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedContainer: {
    borderColor: "#fff",
    backgroundColor: "#E57373",
    boxShadow:"0px 2px 5px rgba(0, 0, 0, 0.25)"
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    marginRight: "3%",
  },
  selectedCircle: {
    backgroundColor: "white",
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: 10,
  },
  label: {
    fontSize: 26,
    fontFamily: "Montserrat-SemiBold",
    color: "white",
  },
  selectedText: {
    fontWeight: "bold",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "15%",
  },
  nextButtonText: {
    fontFamily: "Montserrat-SemiBold",
    color: "white",
    fontSize: 28,
    marginRight: "1.5%",
  },
  nextIcon: {
    width: 39,
    height: 39,
  },
});

export default ChoiceSU;
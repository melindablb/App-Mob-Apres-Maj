import React, { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BloodPressureW from '@/app/components/BloodPressureW';
import BloodSugarW from '@/app/components/BloodSugarW';
import HeartRateW from '@/app/components/HeartRateW';
import OxSaturationW from '@/app/components/OxSaturationW';
import NoDataW from '@/app/components/NoDataW';

const OPTIONS = ['Heart Rate', 'O2 Saturation', 'Blood Sugar', 'Blood Pressure'];

interface DualRadioSelectorProps {
  initialSelection?: string[]
  onSelectionChange?: (selected: string[]) => void
}

export default function DualRadioSelector({ initialSelection = [], onSelectionChange }: DualRadioSelectorProps) {

  const [selected, setSelected] = useState<string[]>([])

 const [fontsLoaded] = useFonts({
         "Montserrat-Thin": require("../../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
         "Montserrat-Regular": require("../../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
         "Montserrat-SemiBold": require("../../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
         "Montserrat-Medium": require("../../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
       });

  useEffect(() => {
    // Charger les choix sauvegardés depuis AsyncStorage lors de l'ouverture de la page
    const loadSelectedOptions = async () => {
      try {
        const savedSelected = await AsyncStorage.getItem('selectedOptions');
        if (savedSelected) {
          setSelected(JSON.parse(savedSelected)); // Récupérer les choix sauvegardés
        } else {
          // Si rien n'est sauvegardé, on initialise avec les 2 premières options
          setSelected([OPTIONS[0], OPTIONS[1]]);
        }
      } catch (error) {
        console.error("Erreur de chargement des options sauvegardées", error);
      }
    };

    loadSelectedOptions(); // Appel à la fonction pour charger les données au montage

  }, []); // Ce useEffect se lance uniquement au montage du composant

  useEffect(() => {
    // Sauvegarder les choix dans AsyncStorage quand ils changent
    const saveSelectedOptions = async () => {
      try {
        await AsyncStorage.setItem('selectedOptions', JSON.stringify(selected));
        if (onSelectionChange) {
          onSelectionChange(selected)
        }
      } catch (error) {
        console.error("Erreur de sauvegarde des options", error);
      }
    };

    saveSelectedOptions(); // Appel à la fonction pour sauvegarder à chaque modification
  }, [selected]); // Ce useEffect se lance à chaque fois que selected change

  const toggleOption = (option: string) => {
    setSelected((prev) => {
      if (prev.includes(option)) return prev; // Si déjà sélectionnée, on ne fait rien

      if (prev.length < 2) {
        return [...prev, option];
      } else {
        const mostRecent = prev[1]; // LIFO : on garde le dernier (second choix)
        return [mostRecent, option]; // Remplace l'option la plus ancienne
      }
    });
  };

  useEffect(() => {
    console.log('Sélection à jour :', selected);
  }, [selected]);
  
  {/*widgets*/}

  const allWidgets = {
    HeartRate: () => <HeartRateW />,
    OxSat: () => <OxSaturationW />,
    BloodSug: () => <BloodSugarW />,
    BloodPre: () => <BloodPressureW />,
    NoData: () => <NoDataW />
  };

  return (
    <View>
      <Text style={styles.title}>Choose 2 options: </Text>
      {OPTIONS.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => toggleOption(option)}
          style={[
            styles.option,
            selected.includes(option) && styles.optionSelected,
          ]}
        > 
          <Text
            style={[
              styles.optionText,
              selected.includes(option) && styles.optionTextSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily:"Montserrat-SemiBold"
  },
  option: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#9C9C9C',
    height:"16.5%",
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  optionSelected: {
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.5)",
    backgroundColor:"#F05050",
    borderColor: 'transparent',
  },
  optionText: {
    color: '#333',
    fontFamily:"Montserrat-SemiBold"
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

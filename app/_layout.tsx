import { SplashScreen, Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import 'react-native-reanimated';
import 'react-native-gesture-handler';

import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
  });

  useEffect(() => {
    if (!fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
  <AuthProvider>
  <Stack screenOptions={{headerShown: false}}/>
  </AuthProvider>
);
}

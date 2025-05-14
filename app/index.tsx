import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{fontWeight:"bold"}}>Welcome To E-Mergency</Text>
      <Link href="./(tabs)/welcome">Welcome</Link>
      <Link href="./(tabs)/signin">Sign In</Link>
      <Link href="./(tabs)/brouillon">Brouillon</Link>
      <Link href="./(tabs)/brouillon2">Brouillon 2</Link>
      <Link href="./(tabs)/patient/signup">Patient</Link>
      <Link href="./(tabs)/patient/menubar/dashboard">dashboard</Link>
      <Link href="./(tabs)/patient/alert/alert">alert</Link>
      <Link href="./(tabs)/med">prise en charge</Link>
      <Link href="./(tabs)/brouillon4">scroll test</Link>
    
    </View>
  );
}

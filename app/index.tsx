import { Link } from "expo-router";
import { Text, View } from "react-native";

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
      <Link href="./(tabs)/healthcarepro/menubar/dashboard">dashboard pro s</Link>
      <Link href="./(tabs)/patient/alert/alert">alert</Link>
      <Link href="./(tabs)/med">prise en charge</Link>
      <Link href="./(tabs)/brouillon4">scroll test</Link>
      <Link href="./(tabs)/testhub">SignalR</Link>
    
    </View>
  );
}

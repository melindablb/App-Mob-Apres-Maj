import { useAuth } from "@/contexts/AuthContext";
import { getAddressFromCoords } from "@/services/getAddressFromCoords";
import { historique } from "@/services/histoalt";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

type Alert = {
  alertID: string;
  id: string;
  color: string;
  createdAt: string;
  descrip: string;
  name?: string;
  lastName?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
};

export default function MedicalRec() {
  const [fontsLoaded] = useFonts({
    "Montserrat-Thin": require("../../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    "Montserrat-Regular": require("../../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "Montserrat-Medium": require("../../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
  });

 
  const [takenCareOfAlerts, setTakenCareOfAlerts] = useState<Alert[]>([]);
  const [otherAlerts, setOtherAlerts] = useState<Alert[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"taken" | "others">("taken");

  const { user } = useAuth();

  const getSoftColor = (color: string): string => {
    const lowerColor = color.toLowerCase();
    switch (lowerColor) {
      case "#f05050":
      case "rouge":
      case "#ff0000":
        return "#E52C2C";
      case "orange":
      case "#ffa500":
      case "#f97316":
        return "#F89545";
      default:
        return lowerColor;
    }
  };

  const renderItem = ({ item }: { item: Alert }) => (
    <View style={[styles.alertCard]}>
      <View style={styles.alertTitleContainer}>
  <View style={styles.alertTitleLeft}>
  <View
  style={[
    styles.alertCircle,
    { backgroundColor: getSoftColor(item.color || "#F05050") },
  ]}
/>
    <Text
      style={[
        styles.alertTitle,
        { color: getSoftColor(item.color || "#F05050") },
      ]}
      numberOfLines={1}
    >
      {item.descrip}
    </Text>
  </View>

  {item.createdAt && (
    <Text style={styles.alertDateTop}>
      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
    </Text>
  )}
</View>

  
{selectedTab === "taken" && item.name && item.lastName && (
  <Text style={styles.alertName}>
    Patient: {item.name} {item.lastName}
  </Text>
)}
  
      <View style={styles.alertFooter}>
        {selectedTab === "others" && item.address && (
          <Text style={styles.alertAddress} numberOfLines={1}>
            Location : {item.address}
          </Text>
        )}
      </View>
    </View>
  );
  
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const userID = user?.uid || "";
      const role = "20";
  
      if (!userID) throw new Error("ID utilisateur introuvable");
  
      const formData = new FormData();
      formData.append("ID", userID);
      formData.append("Role", role);
  
      const response = await historique(formData);
      console.log("Réponse des alertes :", response.data);
  
      const rawTakenAlerts: Alert[] = response.data.takenAlerts || [];
      const rawOtherAlerts: Alert[] = response.data.otherAlerts || [];
  
      // Résolution d’adresse pour les autres alertes
      const enrichedOtherAlerts = await Promise.all(
        rawOtherAlerts.map(async (alert) => {
          if (alert.latitude != null && alert.longitude != null) {
            const address = await getAddressFromCoords(alert.latitude, alert.longitude);
            return { ...alert, address };
          }
          return alert;
        })
      );
      
      setTakenCareOfAlerts(rawTakenAlerts);
      setOtherAlerts(enrichedOtherAlerts);
    } catch (error) {
      console.log("Erreur lors de la récupération des alertes :", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchAlerts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAlerts().finally(() => setRefreshing(false));
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#F05050" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginVertical: 0,
  marginHorizontal: 10,
  position: 'relative',
}}>

  {/* Back button en position absolue à gauche */}
  <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 0 }}>
    <Ionicons name="arrow-back" size={30} color="#F05050" />
  </TouchableOpacity>

  {/* Titre centré */}
  <Text style={[styles.title, { textAlign: 'center' }]}>Notifications</Text>

</View>

      {/* Onglets simples */}
     

      <View style={{flexDirection: "row", justifyContent: "center", marginBottom: 20,gap: 40, marginVertical:10 }}>
      <Text
      onPress={() => setSelectedTab("taken")}
    style={{
      fontFamily: "Montserrat-SemiBold",
      fontSize: 18,
      color: selectedTab === "taken" ? "#F05050" : "gray",
      marginHorizontal: 10,
    }}>
    Taken Care Of
  </Text>
  <Text
    onPress={() => setSelectedTab("others")}
    style={{
      fontFamily: "Montserrat-SemiBold",
      fontSize: 18,
      color: selectedTab === "others" ? "#F05050" : "gray",
      marginHorizontal: 10,
    }}
  >
    Others
  </Text>
</View>


      {loading ? (
        <ActivityIndicator size="large" color="#F05050" />
      ) : (
        <>
          {selectedTab === "taken" && takenCareOfAlerts.length === 0 && (
            <Text style={styles.emptyText}>No alerts taken care of.</Text>
          )}
          {selectedTab === "others" && otherAlerts.length === 0 && (
            <Text style={styles.emptyText}>No other alerts.</Text>
          )}

          <FlatList
            data={selectedTab === "taken" ? takenCareOfAlerts : otherAlerts}
            keyExtractor={(item) => item.alertID}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={renderItem}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  title: {
    alignSelf: "center",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 28,
    color: "#F05050",
    marginVertical: 10,
    marginBottom:20,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginHorizontal: 8,
  },
  tabButtonActive: {
    borderBottomColor: "#F05050",
  },
  tabButtonText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#666",
  },
  tabButtonTextActive: {
    color: "#F05050",
    fontWeight: "700",
  },
  alertCard: {
    backgroundColor: "#fff",
    padding: 7, // ↓ Réduit (anciennement 6)
    borderRadius: 16, // ↓ Légèrement réduit (anciennement 16)
    marginBottom: 8, // ↓ Réduit (anciennement 12)
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3, // ↓ Légèrement réduit (anciennement 4)
    alignSelf: "center",
    width: "95%",
  },
  
  alertTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    marginBottom: 2,       // réduit la marge sous le titre
  },
  alertCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  alertTitle: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: "#333",
    flex: 1,
    flexWrap: "wrap",
  },
  alertDate: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    marginTop: 6,
    color: "black",
  },
  emptyText: {
    alignSelf: "center",
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: "black",
    marginTop: 20,
  },
  alertName: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#333",
    marginTop: 2,          // réduit la marge au-dessus du nom patient
    marginBottom: 0,       // réduit la marge sous le nom patient
    marginLeft: 10,
  },
  alertFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 6,          // réduit la marge au-dessus du footer
    paddingHorizontal: 10,
    paddingBottom: 4,      // réduit la marge en bas
  },
  
  alertAddress: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "black",
    flexShrink: 1,
  },
  
alertDateTop: {
  fontFamily: "Montserrat-Regular",
  fontSize: 12,
  color: "#666",
  textAlign: "right",
},

alertTitleLeft: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  flexShrink: 1,
  flex: 1,
},

  
});






import { useAuth } from "@/contexts/AuthContext";
import { getAddressFromCoords } from '@/services/getAddressFromCoords';
import { historique } from "@/services/histoalt";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"own" | "others">("own");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const ownAlerts = useMemo(
    () => alerts.filter((a) => String(a.id) === String(user?.uid)),
    [alerts, user]
  );
  const otherAlerts = useMemo(
    () => alerts.filter((a) => String(a.id) !== String(user?.uid)),
    [alerts, user]
  );

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

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const userID = user?.uid;
      const role = "10";
      if (!userID) throw new Error("ID utilisateur introuvable");

      const formData = new FormData();
      formData.append("Role", role);
      formData.append("ID", userID);

      const response = await historique(formData);
      console.log("Réponse de l'API historique :", response.data);
      const ownAlerts = response.data.ownAlerts ?? [];
      const otherAlerts = response.data.otherAlerts ?? [];

      // Charger les adresses pour les alertes "others" qui ont latitude et longitude
      const updatedOtherAlerts = await Promise.all(
        otherAlerts.map(async (alert: Alert) => {
          if (alert.latitude != null && alert.longitude != null) {
            const address = await getAddressFromCoords(alert.latitude, alert.longitude);
            return { ...alert, address };
          }
          return alert;
        })
      );

      // Combine ownAlerts + updatedOtherAlerts
      setAlerts([...ownAlerts, ...updatedOtherAlerts]);
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

  const renderItem = ({ item }: { item: Alert }) => {
    const softColor = getSoftColor(item.color || "#F05050");
  
    return (
      <View style={styles.alertCard}>
        <View style={styles.alertTitleRow}>
          <View style={[styles.alertCircle, { backgroundColor: softColor }]} />
          <Text
            style={[
              styles.alertTitle,
              {
                color: softColor, 
                flex: 1,
              },
            ]}
          >
            {item.descrip}
          </Text>
          <Text style={styles.alertDateRight}>
            {item.createdAt
              ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })
              : "Date invalide"}
          </Text>
        </View>
  
        {activeTab === "others" && item.address && (
          <Text style={styles.alertAddress} numberOfLines={1}>
            Location : {item.address}
          </Text>
        )}
      </View>
    );
  };
  
  

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

      {loading ? (
        <ActivityIndicator size="large" color="#F05050" />
      ) : alerts.length === 0 ? (
        <Text style={styles.emptyText}>Alerts not found.</Text>
      ) : (
        <>
          <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20,gap: 40, marginVertical:10 }}>
            <Text
              onPress={() => setActiveTab("own")}
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: 18,
                color: activeTab === "own" ? "#F05050" : "gray",
                marginHorizontal: 10,
              }}
            >
              Mine
            </Text>
            <Text
              onPress={() => setActiveTab("others")}
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: 18,
                color: activeTab === "others" ? "#F05050" : "gray",
                marginHorizontal: 10,
              }}
            >
              Others
            </Text>
          </View>

          <FlatList
            data={activeTab === "own" ? ownAlerts : otherAlerts}
            keyExtractor={(item) => item.alertID}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
  alertCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignSelf: "center",
    width: "95%",
  },
  alertTitleRow: {
    flexDirection: "row",
    alignItems: "center",  // ici c'est important
    gap: 8,
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
    flexWrap: "wrap",
  },
  alertDateRight: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "black",
    marginLeft: 10,
    flexShrink: 0,
    textAlign: "right",
  },
  alertTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  alertInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginLeft: 10,
    marginRight: 10,
  },
  alertName: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "Black",
    flex: 1,
  },
  alertDate: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "black",
    flexShrink: 0,
  },
  alertDateN: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    marginTop: 6,
    color: "black",
    alignSelf: "flex-end",
  },
  emptyText: {
    alignSelf: "center",
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: "black",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  alertAddress: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    marginTop: 6,
    color: "black",
  },
});


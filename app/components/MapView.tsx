import type React from "react"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from "react-native-maps"
import type { GeoLocation } from "../types/types"
import * as Location from "expo-location"
import { useFonts } from "expo-font"
import { MaterialIcons } from "@expo/vector-icons"
import { useRef,useEffect , useState} from "react"

interface PatientMapViewProps {
  location: GeoLocation
  name: string
}

const PatientMapView: React.FC<PatientMapViewProps> = ({ location, name }) => {
  const { latitude, longitude } = location

  const [fontsLoaded] = useFonts({
      "Montserrat-Thin": require("../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
      "Montserrat-Regular": require("../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
      "Montserrat-SemiBold": require("../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
      "Montserrat-Medium": require("../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
    });

    const mapRef = useRef<MapView | null>(null)
    const [ulocation, setuLocation] = useState<Location.LocationObject>({
      coords: {
        latitude: 0,
        longitude: 0,
        altitude: null,
        accuracy: 0,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    });
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
    
    useEffect(() => {
        ;(async () => {
          const { status } = await Location.requestForegroundPermissionsAsync()
          if (status !== "granted") {
            setErrorMsg("Permission to access location was denied")
            return
          }
    
          try {
            const ulocation = await Location.getCurrentPositionAsync({})
            setuLocation(ulocation)
            setMapRegion({
              latitude: (latitude+ulocation.coords.latitude)/2,
              longitude: (longitude+ulocation.coords.longitude)/2,
              latitudeDelta: 0.3,
              longitudeDelta: 0.3,
            })
          } catch (error) {
            setErrorMsg("Could not get your location")
          }
        })()
      }, [])
//////////// recenter

  const recenterMap = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({})
      setuLocation(ulocation)

      const newRegion = {
        latitude: (latitude+ulocation.coords.latitude)/2,
        longitude: (longitude+ulocation.coords.longitude)/2,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      }

      setMapRegion(newRegion)

      // Use the map reference to animate to the new region
      mapRef.current?.animateToRegion(newRegion, 1000)
    } catch (error) {
      setErrorMsg("Could not get your location")
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}'s Location</Text>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          ref={mapRef} provider={PROVIDER_DEFAULT}
          region={mapRegion}
        >
          <UrlTile urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
          <Marker
            coordinate={{ latitude, longitude }}
            title={name}
            description={`Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}
            pinColor="#F05050"
          />
            <Marker
              coordinate={{
                latitude: ulocation.coords.latitude,
                longitude: ulocation.coords.longitude,
              }}
              title="You are here"
              description="Your current location"
              pinColor="green"
            />
        </MapView>
        <TouchableOpacity style={styles.MrecenterButton} onPress={recenterMap}>
          <MaterialIcons name="my-location" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.coordinatesContainer}>
        <Text style={styles.coordinates}>
          Latitude: {latitude.toFixed(6)}, Longitude: {longitude.toFixed(6)}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderWidth:0.3,
    borderColor:"#9C9C9C",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily:"Montserrat-SemiBold",
    marginBottom: 10,
    color: "#F05050",
  },
  mapContainer: {
    height: 300,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
    borderWidth:0.3,
    borderColor:"#9C9C9C",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  coordinatesContainer: {
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 4,
  },
  coordinates: {
    fontSize: 12,
    color: "#666",
    fontFamily:"Montserrat-Medium",
    textAlign: "center",
  },
  MrecenterButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})

export default PatientMapView

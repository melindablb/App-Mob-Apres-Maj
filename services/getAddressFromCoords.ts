import { Double } from "react-native/Libraries/Types/CodegenTypes";

export const getAddressFromCoords = async (lat: Double, lon: Double): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ReactNativeApp/1.0 (@email.com)',
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erreur réseau lors de la géolocalisation");
    }

    const data = await response.json();
    const address = data.address;

    // Compose une adresse courte lisible
    const road = address.road || address.pedestrian || address.footway || "";
    const postcode = address.postcode || "";
    const city = address.city || address.town || address.village || "";

    const shortAddress = [road, postcode, city].filter(Boolean).join(", ");
    return shortAddress || "Adresse inconnue";
  } catch (error) {
    console.error("Erreur dans getAddressFromCoords :", error);
    return "Adresse inconnue";
  }
};



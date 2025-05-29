"use client"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFonts } from "expo-font"
import { useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
// Import the image picker properly
import { MedRecDelete, MedRecLoad, MedRecP } from "@/services/medrec"
import * as ImagePicker from "expo-image-picker"
import { useAuth } from '../../../../contexts/AuthContext'


interface ImageValue {
  uri: string
  name: string
  mimeType: string
}

// Define MedicalRecord type
interface MedicalRecord {
  id: string
  label: string
  emailmed: string
  validationStatus: "validated" | "rejected" | "pending"
  image: ImageValue
}


export default function MedicalRec() {

  const [fontsLoaded] = useFonts({
    "Montserrat-Thin": require("../../../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    "Montserrat-Regular": require("../../../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../../../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "Montserrat-Medium": require("../../../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
  });

  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [label, setLabel] = useState("")
  const [description, setdescription] = useState("")
  const [emailmed, setEmailmed] = useState("")
  const [imageUri, setImageUri] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState<ImageValue | null>(null);
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // fonction pour associer le status a une chaine de car
  function getValidationStatus(status: number): 'rejected' | 'pending' | 'validated' {
    switch (status) {
      case -1:
        return 'rejected';
      case 0:
        return 'pending';
      case 1:
        return 'validated';
      default:
        throw new Error(`Statut inconnu : ${status}`);
    }
  }

  // FIXME: pour refresh la page et actualiser les dossiers medicaux

  const onRefresh = useCallback(async () => {
    //ca tourne
    setRefreshing(true);
    setIsLoading(true);

    console.log("test actualisation")

    if(!user?.uid){
      Alert.alert("Error", "User ID is missing. Please try again.");
      console.error("User ID is missing. Please try again.")
      setRefreshing(false);
      setIsLoading(false);
      return;
    }
    else{
      try{
      // on supprime ce qu il ya dans le cache
      await AsyncStorage.removeItem("medicalRecords");

      // on recharge les dossiers medicaux depuis la db
      const response = await MedRecLoad(user.uid);
      console.log("reponse de l api:", response.data)
      if (Array.isArray(response.data) && response.data.length > 0) {
      const loadedRecords: MedicalRecord[] = response.data.map((item: any) => ({
        id: item.uidMedRec,
        label: item.title,
        emailmed: item.mailMed,
        description: item.description,
        validationStatus: getValidationStatus(item.state),
        image: {
          uri: item.filePath,
          name: "medical_record.jpg",
          mimeType: "image/jpeg",
        },
      }));
      await saveRecords([...records, ...loadedRecords]);
    console.log("Dossiers médicaux chargés depuis la base de données.")
      setRefreshing(false);
      setIsLoading(false);
      
  } else {
    console.log("Aucun dossier médical trouvé.");
    await saveRecords([]);
  }
}
      catch(error){
        console.error("Error loading medical records:", error)
        Alert.alert("Error", "Failed to load medical records")
        setRefreshing(false);
        setIsLoading(false);
      }
    finally{
      setRefreshing(false);
      setIsLoading(false);
    }
    }
  

  }, []);


  const filteredRecords = records.filter(
    (record) =>
      record.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.emailmed.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  console.log("Rendering medical records list, filtered count:", filteredRecords.length)

  useEffect(() => {
    console.log("MedicalRecords component mounted")
    onRefresh();
  }, [])



  const saveRecords = async (updatedRecords: MedicalRecord[]) => {
    console.log("Saving medical records to local storage:", updatedRecords.length, "records")
    try {
      await AsyncStorage.setItem("medicalRecords", JSON.stringify(updatedRecords))
      console.log("Medical records saved to local storage successfully")
      setRecords(updatedRecords)
    } catch (error) {
      console.error("Error saving medical records to local storage:", error)
      Alert.alert("Error", "Failed to save medical records locally")
    }
  }

  const openAddModal = () => {
    console.log("Opening add modal")
    setLabel("")
    setdescription("")
    setEmailmed("")
    setImageUri("")
    setModalVisible(true)
  }

  const pickImage = async () => {
    try {
      // Request permission first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need camera roll permissions to upload images")
        return
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      console.log("Image picker result:", result)

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri)
        const image: ImageValue = {
          uri: result.assets[0].uri,
          name: result.assets[0].fileName || "medical_record.jpg",
          mimeType: result.assets[0].type || "image/jpeg",
        }
        setImage(image)
        console.log("Image selected:", result.assets[0].uri)
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Failed to pick image. Please try again.")
    }
  }


  const saveRecord = async () => {

    if (label.trim() === "" || emailmed.trim() === "") {
      console.log("Validation failed: empty label or email")
      Alert.alert("Error", "Please enter both label and email")
      return
    }
    if (!imageUri) {
      console.log("Validation failed: no image selected")
      Alert.alert("Error", "Please select an image of the medical record")
      return
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailmed)) {
      console.log("Validation failed: invalid email format")
      Alert.alert("Error", "Please enter a valid email address")
      return
    }

    console.log("Saving medical record")
    setIsLoading(true)

    try {
      
      const newRecord: MedicalRecord = {
        id: Date.now().toString(),
        label,
        emailmed,
        validationStatus: "pending", // Initial status is always pending
        image: image as ImageValue,
      }

      
      console.log("Adding new medical record:", newRecord)

      
      try {
        
        console.log("Attempting to add medical record to API")
        const formData = new FormData();
        if (user?.uid) {
          formData.append("ID", user.uid);
        } else {
          console.error("User ID is undefined");
          Alert.alert("Error", "User ID is missing. Please try again.");
          return;
        }

        formData.append("Title", newRecord.label)
        formData.append("MailMedecin", newRecord.emailmed)
        formData.append("file", {
          uri: newRecord.image.uri,
          name: newRecord.image.name,
          type: newRecord.image.mimeType,
        } as any);

        const jsonData = JSON.stringify(formData)
        console.log(jsonData)
        console.log("prout")
        const response = await MedRecP(formData);
        console.log("weeeee")
        const newRecordtoADD : MedicalRecord ={
          id: response.data.idfdossier,
          label,
          emailmed,
          validationStatus: "pending",
          image: image as ImageValue,
        }
        console.log("API add successful, updating local state with:", newRecordtoADD)

        const updatedRecords = [...records, { ...newRecordtoADD, validationStatus: newRecordtoADD.validationStatus as "validated" | "rejected" | "pending" }]
        await saveRecords(updatedRecords)
        Alert.alert("Success", "Medical record added successfully")
      } catch (error) {
        console.error("API add failed:", error)

        Alert.alert("API Error", "Failed to add medical record to the server.", [
          { text: "Cancel", style: "cancel" },
        ])
        return
      }


      console.log("Operation completed, closing modal")
      setModalVisible(false)
    } catch (error) {
      console.error("Error saving medical record:", error)
      Alert.alert("Error", "Failed to save medical record")
    } finally {
      setIsLoading(false)
    }
  }


  const deleteRecord = (idD: string) => {
    console.log("Delete requested for medical record id:", idD)
    Alert.alert("Delete Medical Record", "Are you sure you want to delete this medical record?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          console.log("User confirmed delete for id:", idD)
          setIsLoading(true)
          try {
            const response = await MedRecDelete({
              Patient: user?.uid ?? "",     
              Iddossier: idD
            });
            console.log(response)
            try{
            console.log("API delete successful, updating local state")
            const updatedRecords = records.filter((record) => record.id !== idD).map((record) => ({
                ...record,
                validationStatus: record.validationStatus as "validated" | "rejected" | "pending",
              }))
              await saveRecords(updatedRecords)
              Alert.alert("Success", "Medical record deleted successfully")
            } catch (error) {
              console.error("API delete failed:", error)
              
              Alert.alert("API Error", "Failed to delete medical record from the server. Delete locally only?")
            }
          } catch (error) {
            console.error("Error deleting medical record:", error)
            Alert.alert("Error", "Failed to delete medical record")
          } finally {
            setIsLoading(false)
          }
        },
      },
    ])
  }


  const getStatusIcon = (status: string) => {
    switch (status) {
      case "validated":
        return "checkmark-circle"
      case "rejected":
        return "close-circle"
      default:
        return "alert-circle"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated":
        return "#4CAF50" // Green
      case "rejected":
        return "#F44336" // Red
      default:
        return "#FFC107" // Yellow/Amber
    }
  }

  const renderRecordItem = ({ item }: { item: MedicalRecord }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordImageContainer}>
        <Image source={{ uri: item.image.uri }} style={styles.recordImage} resizeMode="cover" />
      </View>

      <View style={styles.recordInfo}>
        <Text style={styles.recordLabel}>{item.label}</Text>
        <View style={styles.emailContainer}>
          <Ionicons name="mail" size={16} color="#666" />
          <Text style={styles.recordEmail}>{item.emailmed}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Ionicons
            name={getStatusIcon(item.validationStatus)}
            size={16}
            color={getStatusColor(item.validationStatus)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.validationStatus) }]}>
            {item.validationStatus.charAt(0).toUpperCase() + item.validationStatus.slice(1)}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRecord(item.id)} disabled={isLoading}>
        <Ionicons name="trash" size={22} color="#F05050" />
      </TouchableOpacity>
    </View>
  )
  
const [pdp,setpdp]=useState<any>(null)
useEffect(() => {
    if(user?.pdp){
      setpdp(user.pdp);
    }
    else{
      setpdp(require("../../../../assets/icons/avatar.png"));
    }
  }),[user?.pdp];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <View style={styles.headerL}>
            <Image 
            source={typeof pdp === "string" ? { uri: pdp } : pdp}
            style={{width: 45, height: 45,borderRadius:100000}}/> 
              <Text style={{
              color:"black", 
              fontSize:20, 
              textAlign:"left", 
              marginLeft:5,
              alignSelf:"center",
              fontFamily: "Montserrat-SemiBold",
              }}>{user?.name} {user?.lastname}</Text>
          </View>
          <View style={styles.headerR}>
          <Ionicons name="notifications" size={25} color="#F05050" style={styles.notificationIcon} />
            </View>
      </View>

      <Text style={styles.title}>Medical Records</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#F05050" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search records..."
          value={searchQuery}
          placeholderTextColor="gray"
          onChangeText={(text) => {
            console.log("Search query changed:", text)
            setSearchQuery(text)
          }}
        />
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#F05050" />
        </View>
      )}

      <FlatList
        data={filteredRecords}
        keyExtractor={(item) => item.id}
        renderItem={renderRecordItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery ? "No matching records found" : "No medical records added yet"}
          </Text>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={openAddModal} disabled={isLoading}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal for adding new medical records */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log("Modal closed via back button/gesture")
          setModalVisible(false)
        }}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Medical Record</Text>
              <TouchableOpacity
                onPress={() => {
                  console.log("Modal close button pressed")
                  setModalVisible(false)
                }}
                disabled={isLoading}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Record Label</Text>
              <TextInput
                style={styles.input}
                value={label}
                onChangeText={(text) => {
                  console.log("Label input changed:", text)
                  setLabel(text)
                }}
                placeholder="Enter record label"
                editable={!isLoading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Doctor's email</Text>
              <TextInput
                style={styles.input}
                value={emailmed}
                onChangeText={(text) => {
                  console.log("Email input changed:", text)
                  setEmailmed(text)
                }}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Medical Record Image</Text>
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage} disabled={isLoading}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.previewImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="camera" size={40} color="#ccc" />
                    <Text style={styles.imagePlaceholderText}>Tap to select image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  console.log("Cancel button pressed")
                  setModalVisible(false)
                }}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  console.log("Add button pressed")
                  saveRecord()
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  header: {
    height: "5%",
    marginHorizontal: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "5%",
  },
  headerL: {
    flexDirection: "row",
  },
  headerR: {
    justifyContent: "center",
  },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#F05050",
  },
  headerUsername: {
    color: "black",
    fontSize: 20,
    textAlign: "left",
    marginLeft: 5,
    alignSelf: "center",
    fontFamily: "Montserrat-SemiBold",
  },
  notificationIcon: {
    alignSelf: "flex-end",
  },
  title: {
    alignSelf: "center",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 30,
    color: "#F05050",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
    marginBottom: "5%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: "5%",
    marginBottom: "7%",
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#F05050",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    fontFamily: "Montserrat-Medium",
  },
  recordItem: {
    backgroundColor: "white",
    padding: "3%",
    paddingHorizontal: "5%",
    marginVertical: 8,
    marginHorizontal: "5%",
    borderRadius: 28,
    borderWidth: 0.8,
    borderColor: "#FE8D80",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  recordImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 7,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  recordImage: {
    width: "100%",
    height: "100%",
  },
  recordInfo: {
    flex: 1,
  },
  recordLabel: {
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "2%",
    marginRight:"2%",
    width:"90%",
  },
  recordEmail: {
    fontSize: 11,
    color: "#666",
    marginLeft: "2%",
    fontFamily: "Montserrat-Medium",
    marginRight:"2%",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusText: {
    fontSize: 14,
    marginLeft: 4,
    fontFamily: "Montserrat-Medium",
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    marginBottom: "22%",
    marginLeft: "80%",
    backgroundColor: "#F05050",
    width: "15%",
    height: "7%",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: "#666",
    fontFamily: "Montserrat-Medium",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#9C9C9C",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Montserrat-SemiBold",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Montserrat-SemiBold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input2: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 100,
    textAlignVertical: "top",
  },  
  imagePickerButton: {
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: "#666",
    fontFamily: "Montserrat-Medium",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f2f2f2",
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#F05050",
    marginLeft: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Montserrat-Medium",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Montserrat-Medium",
  },
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 1000,
  },
})

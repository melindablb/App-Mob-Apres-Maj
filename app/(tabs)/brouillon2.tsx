"use client"
import { useFonts } from "expo-font"
import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native"
import icons from "@/constants/icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
// Import the image picker properly
import * as ImagePicker from "expo-image-picker"

// Define MedicalRecord type
interface MedicalRecord {
  id: string
  label: string
  emailmed: string
  validationStatus: "validated" | "rejected" | "pending"
  imageUri: string
}

// Simulated API URL (not actually used for requests)
const API_URL = "https://api.example.com/medical-records"

export default function MedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [label, setLabel] = useState("")
  const [emailmed, setEmailmed] = useState("")
  const [imageUri, setImageUri] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)



  const [fontsLoaded] = useFonts({
    "Montserrat-Thin": require("../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    "Montserrat-Regular": require("../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "Montserrat-Medium": require("../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
  });


  // Load records from storage when component mounts
  useEffect(() => {
    console.log("MedicalRecords component mounted")
    loadRecords()
  }, [])

  // Load records from AsyncStorage with simulated API call
  const loadRecords = async () => {
    console.log("Loading medical records...")
    setIsLoading(true)
    try {
      // Simulate API call
      console.log("Fetching medical records from API:", API_URL)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate successful API response
      console.log("API response status: 200 OK")

      // Actually load from AsyncStorage
      const storedRecords = await AsyncStorage.getItem("medicalRecords")
      if (storedRecords !== null) {
        const parsedRecords = JSON.parse(storedRecords)
        console.log("Medical records loaded from storage:", parsedRecords.length, "records")
        setRecords(parsedRecords)
      } else {
        console.log("No medical records found in storage, initializing empty array")
        setRecords([])
      }
    } catch (error) {
      console.error("Error loading medical records:", error)
      Alert.alert("Error", "Failed to load medical records")
    } finally {
      setIsLoading(false)
    }
  }

  // Save records to AsyncStorage
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

  // Simulate adding a record to API
  const addRecordToAPI = async (record: MedicalRecord) => {
    console.log("Adding medical record to API:", record)
    setIsLoading(true)

    try {
      // Simulate API request
      console.log("POST request to:", API_URL)
      console.log("Request body:", JSON.stringify(record))

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful API response
      console.log("API response status for add: 201 Created")

      // Simulate server-generated ID and validation status (in a real API, the server would assign these)
      const addedRecord = {
        ...record,
        id: `api-${Date.now()}`,
        validationStatus: "pending", // Initial status is always pending
      }
      console.log("Medical record added to API successfully:", addedRecord)

      return addedRecord
    } catch (error) {
      console.error("Error adding medical record to API:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Simulate deleting a record from API
  const deleteRecordFromAPI = async (id: string) => {
    console.log("Deleting medical record from API, id:", id)
    setIsLoading(true)

    try {
      // Simulate API request
      const url = `${API_URL}/${id}`
      console.log("DELETE request to:", url)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful API response
      console.log("API response status for delete: 204 No Content")
      console.log("Medical record deleted from API successfully")

      return true
    } catch (error) {
      console.error("Error deleting medical record from API:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Open modal to add a new record
  const openAddModal = () => {
    console.log("Opening add modal")
    setLabel("")
    setEmailmed("")
    setImageUri("")
    setModalVisible(true)
  }

  // Real image picker implementation
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
        console.log("Image selected:", result.assets[0].uri)
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Failed to pick image. Please try again.")
    }
  }

  // Save a new record
  const saveRecord = async () => {
    // Validate inputs
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailmed)) {
      console.log("Validation failed: invalid email format")
      Alert.alert("Error", "Please enter a valid email address")
      return
    }

    console.log("Saving medical record")
    setIsLoading(true)

    try {
      // Add new record
      const newRecord: MedicalRecord = {
        id: Date.now().toString(),
        label,
        emailmed,
        validationStatus: "pending", // Initial status is always pending
        imageUri,
      }

      console.log("Adding new medical record:", newRecord)

      // Simulate API add
      try {
        console.log("Attempting to add medical record to API")
        const addedRecord = await addRecordToAPI(newRecord)

        // If API succeeds, use the returned record (which might have a server-generated ID)
        console.log("API add successful, updating local state with:", addedRecord)
        const updatedRecords = [...records, { ...addedRecord, validationStatus: addedRecord.validationStatus as "validated" | "rejected" | "pending" }]
        await saveRecords(updatedRecords)
        Alert.alert("Success", "Medical record added successfully")
      } catch (error) {
        console.error("API add failed:", error)
        // If API fails, ask user if they want to add locally only
        Alert.alert("API Error", "Failed to add medical record to the server. Add locally only?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Add Locally",
            onPress: async () => {
              console.log("User chose to add locally only")
              const updatedRecords = [...records, { ...newRecord, validationStatus: newRecord.validationStatus as "validated" | "rejected" | "pending" }]
              await saveRecords(updatedRecords)
            },
          },
        ])
        return
      }

      // Close modal
      console.log("Operation completed, closing modal")
      setModalVisible(false)
    } catch (error) {
      console.error("Error saving medical record:", error)
      Alert.alert("Error", "Failed to save medical record")
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a record
  const deleteRecord = (id: string) => {
    console.log("Delete requested for medical record id:", id)
    Alert.alert("Delete Medical Record", "Are you sure you want to delete this medical record?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          console.log("User confirmed delete for id:", id)
          setIsLoading(true)
          try {
            // Simulate API delete
            try {
              console.log("Attempting to delete medical record from API")
              await deleteRecordFromAPI(id)

              // If API delete succeeds, update local state
              console.log("API delete successful, updating local state")
              const updatedRecords = records.filter((record) => record.id !== id).map((record) => ({
                ...record,
                validationStatus: record.validationStatus as "validated" | "rejected" | "pending",
              }))
              await saveRecords(updatedRecords)
              Alert.alert("Success", "Medical record deleted successfully")
            } catch (error) {
              console.error("API delete failed:", error)
              // If API fails, ask user if they want to delete locally only
              Alert.alert("API Error", "Failed to delete medical record from the server. Delete locally only?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete Locally",
                  onPress: async () => {
                    console.log("User chose to delete locally only")
                    const updatedRecords = records.filter((record) => record.id !== id)
                    await saveRecords(updatedRecords)
                  },
                },
              ])
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

  // Get status icon name based on validation status
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

  // Get status color based on validation status
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

  // Filter records based on search query
  const filteredRecords = records.filter(
    (record) =>
      record.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.emailmed.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  console.log("Rendering medical records list, filtered count:", filteredRecords.length)

  // Render each record item
  const renderRecordItem = ({ item }: { item: MedicalRecord }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordImageContainer}>
        <Image source={{ uri: item.imageUri }} style={styles.recordImage} resizeMode="cover" />
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <View style={styles.headerL}>
            <Image source={icons.avatar} style={{width: 45, height: 45}}/>
            <Text style={{
              color:"black", 
              fontSize:20, 
              textAlign:"left", 
              marginLeft:5,
              alignSelf:"center",
              fontFamily: "Montserrat-SemiBold",
              }}>User Name</Text>
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
    </View>
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
    marginTop: "11%",
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

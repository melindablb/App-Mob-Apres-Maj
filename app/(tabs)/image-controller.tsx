"use client"

import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  type ImageStyle,
  type StyleProp,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import { useFonts } from "expo-font"
import icons from "../../constants/icons"

interface ImageValue {
  uri: string
  isValid: boolean
  name: string
  size: number
  mimeType: string
}

interface ImageControllerProps {
  value: ImageValue | null
  onChange: (value: ImageValue | null) => void
  maxSizeInMB?: number
  requiredWidth?: number
  requiredHeight?: number
  allowedFormats?: string[]
  imageStyle?: StyleProp<ImageStyle>
}

interface FileInfoWithSize {
  exists: boolean
  isDirectory: boolean
  modificationTime?: number
  size?: number
  uri: string
}

export default function ImageController({
  value,
  onChange,
  maxSizeInMB = 5,
  requiredWidth = 0,
  requiredHeight = 0,
  allowedFormats = ["jpeg", "jpg", "png"],
  imageStyle,
}: ImageControllerProps) {
  const [validating, setValidating] = useState(false)
  const [validationMessages, setValidationMessages] = useState<string[]>([])
  const [imageInfo, setImageInfo] = useState<{
    width?: number
    height?: number
    size?: number
    format?: string
  }>({})

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission required", "Sorry, we need camera roll permissions to make this work!")
      return false
    }
    return true
  }

  const pickImage = async () => {
    const hasPermission = await requestPermission()
    if (!hasPermission) return

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        aspect: requiredWidth && requiredHeight ? [requiredWidth, requiredHeight] : undefined,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri

        if (result.assets[0].width && result.assets[0].height) {
          setImageInfo((prev) => ({
            ...prev,
            width: result.assets[0].width,
            height: result.assets[0].height,
          }))
        }

        validateImage(selectedImageUri)
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Failed to pick image")
    }
  }

  const validateImage = async (imageUri: string) => {
    if (!imageUri) {
      return
    }

    setValidating(true)
    setValidationMessages([])
    const messages: string[] = []
    let valid = true

    try {
      const fileInfo = (await FileSystem.getInfoAsync(imageUri, { size: true })) as FileInfoWithSize

      if (!fileInfo.exists) {
        messages.push("Image file not found")
        onChange({
          uri: imageUri,
          isValid: false,
          name: "unknown.jpg",
          size: 0,
          mimeType: "image/unknown",
        })
        setValidationMessages(messages)
        return
      }

      const fileSizeInMB = fileInfo.size ? fileInfo.size / (1024 * 1024) : 0
      setImageInfo((prev) => ({ ...prev, size: fileSizeInMB }))

      if (fileSizeInMB > maxSizeInMB) {
        messages.push(`Image size (${fileSizeInMB.toFixed(2)}MB) exceeds maximum allowed (${maxSizeInMB}MB)`)
        valid = false
      } else {
        messages.push(`Size: ${fileSizeInMB.toFixed(2)}MB ✓`)
      }

      const fileExt = imageUri.split(".").pop()?.toLowerCase()
      setImageInfo((prev) => ({ ...prev, format: fileExt }))

      if (fileExt && !allowedFormats.includes(fileExt)) {
        messages.push(`Format (.${fileExt}) not allowed. Allowed formats: ${allowedFormats.join(", ")}`)
        valid = false
      } else {
        messages.push(`Format: ${fileExt} ✓`)
      }

      const { width, height } = imageInfo
      if (width && height) {
        if (requiredWidth > 0 && width !== requiredWidth) {
          messages.push(`Width (${width}px) does not match required (${requiredWidth}px)`)
          valid = false
        }

        if (requiredHeight > 0 && height !== requiredHeight) {
          messages.push(`Height (${height}px) does not match required (${requiredHeight}px)`)
          valid = false
        }

        if ((requiredWidth === 0 || width === requiredWidth) && (requiredHeight === 0 || height === requiredHeight)) {
          messages.push(`Dimensions: ${width}x${height}px ✓`)
        }
      }

      setValidationMessages(messages)

      // Get filename from URI
      const fileName = imageUri.split("/").pop() || "image.jpg"

      // Determine MIME type based on extension
      let mimeType = "image/jpeg" // Default
      if (fileExt === "png") {
        mimeType = "image/png"
      } else if (fileExt === "gif") {
        mimeType = "image/gif"
      }

      // Update the onChange with all required properties
      onChange({
        uri: imageUri,
        isValid: valid,
        name: fileName,
        size: fileInfo.size || 0,
        mimeType: mimeType,
      })
    } catch (error) {
      console.error("Error validating image:", error)
      setValidationMessages(["Error validating image"])
      onChange({
        uri: imageUri,
        isValid: false,
        name: "error.jpg",
        size: 0,
        mimeType: "image/jpeg",
      })
    } finally {
      setValidating(false)
    }
  }

  const clearImage = () => {
    onChange(null)
    setValidationMessages([])
  }
  const [fontsLoaded] = useFonts({
    "Montserrat-Thin": require("../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    "Montserrat-Regular": require("../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "Montserrat-Medium": require("../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
  })
  return (
    <View style={styles.container}>
      {!value?.uri ? (
        <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
          <Image source={icons.upload} style={{ width: 20, height: 20, marginRight: 10 }} />
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.imageContainer}>
          <Image source={{ uri: value.uri }} style={[styles.image, imageStyle]} />

          <View style={styles.statusContainer}>
            {value.isValid && <Text style={styles.successText}>✓ Image is valid</Text>}
            {!value.isValid && <Text style={styles.errorText}>✗ Image is invalid</Text>}
          </View>

          {validationMessages.length > 0 && (
            <View style={styles.messagesContainer}>
              {validationMessages.map((message, index) => (
                <Text
                  key={index}
                  style={[
                    styles.messageText,
                    message.includes("✓")
                      ? styles.successText
                      : message.includes("not") || message.includes("exceeds")
                        ? styles.errorText
                        : styles.infoText,
                  ]}
                >
                  {message}
                </Text>
              ))}
            </View>
          )}

          {validating && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0891b2" />
              <Text style={styles.loadingText}>Validating image...</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
              <Text style={styles.buttonText}>Change Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearButton} onPress={clearImage}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#9C9C9C",
    borderRadius: 17,
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 10,
    backgroundColor: "white",
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "gray",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  statusContainer: {
    height: 20,
  },
  messagesContainer: {
    alignItems: "center",
    padding: 10,
  },
  messageText: {
    marginBottom: 5,
    fontSize: 14,
    fontFamily: "Montserrat-Medium",
  },
  successText: {
    color: "#10b981",
    fontWeight: "bold",
    fontFamily: "Montserrat-Medium",
  },
  errorText: {
    color: "#ef4444",
    fontWeight: "bold",
    fontFamily: "Montserrat-Medium",
  },
  infoText: {
    color: "#6b7280",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: "#6b7280",
    fontFamily: "Montserrat-Medium",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  changeButton: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 14,
    flex: 3,
    marginRight: 10,
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
    borderColor: "#9C9C9C",
    borderWidth: 1,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#FE8080",
    padding: 12,
    borderRadius: 14,
    flex: 1,
    alignItems: "center",
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
  },
  clearButtonText: {
    color: "white",
    fontFamily: "Montserrat-SemiBold",
  },
})

import React, { useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity, ImageSourcePropType, ViewStyle, ImageStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// Import as a require to ensure it works correctly
const placeholder = require("../../assets/icons/avatar.png");

interface AvatarProps {
  uri?: string;
  style?: ViewStyle;
  imgStyle?: ImageStyle;
  onPress?: () => void;
  onButtonPress?: () => void;
  aviOnly?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  uri = "",
  style = {},
  imgStyle = {},
  onPress = () => {},
  onButtonPress = () => {},
  aviOnly = false,
  ...props
}) => {
  // Add state to handle image loading errors
  const [imageError, setImageError] = useState(false);
  
  // Better validation - check if uri is a non-empty string
  const isImageValid = typeof uri === 'string' && uri.trim().length > 0 && !imageError;

  return (
    <View style={[styles.container, { marginBottom: aviOnly ? 0 : 15 }, style]} {...props}>
      <TouchableOpacity onPress={onPress}>
        <Image
          source={isImageValid ? { uri } : placeholder as ImageSourcePropType}
          style={[
            styles.image,
            aviOnly && styles.avatarLarge,
            imgStyle
          ]}
          // Add error handling
          onError={() => setImageError(true)}
        />
        {!aviOnly && (
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={onButtonPress}
            // Make the button more accessible
            accessibilityLabel="Edit profile picture"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="camera-outline" size={30} color={"white"} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    // Add background color to make placeholder more visible
    backgroundColor: '#f0f0f0',
  },
  avatarLarge: {
    width: 170,
    height: 170,
    resizeMode: "cover",
    borderRadius: 85,
    borderWidth: 2,
    borderColor: "#F05050",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#F05050",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    // Add shadow for better visibility
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default Avatar;

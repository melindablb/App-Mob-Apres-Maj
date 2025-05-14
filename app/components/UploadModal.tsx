import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import StyledText from "./StyledText";


interface UploadModelProps {
    modalVisible: boolean;
    onBackPress: () => void;
    onCameraPress: () => void;
    onGalleryPress: () => void;
    onRemovePress: () => void;
    isLoading?: boolean;
}

const styles = StyleSheet.create({
    optionBtn: {
        alignItems: "center",
        marginHorizontal: 10,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    blurView: {
        ...StyleSheet.absoluteFillObject, // Remplit tout l'espace
    },
    modalView: {
        width: "65%",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    decisionRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 21,
    },
});

const UploadModal: React.FC<UploadModelProps> = ({
    modalVisible,
    onBackPress,
    onCameraPress,
    onGalleryPress,
    onRemovePress,
    isLoading = false,
}) => {
    /*console.log("UploadModal props:", { 
        modalVisible, 
        hasOnBackPress: !!onBackPress,
        hasOnCameraPress: !!onCameraPress,
        hasOnGalleryPress: !!onGalleryPress,
        hasOnRemovePress: !!onRemovePress
    });*/

    return (
        <Modal animationType="slide" visible={modalVisible} transparent={true}>
            <Pressable style={styles.container} onPress={onBackPress}>
                {/* Ajout du BlurView pour l'effet de flou */}
                <BlurView
                    style={styles.blurView}
                    intensity={90} // Intensité du flou (0 à 100)
                    // Removed invalid property 'reducedTransparencyFallbackColor'
                />
                
                {isLoading && <ActivityIndicator size={70} color={"white"} />}

                {!isLoading && (
                    <View style={[styles.modalView, {
                        backgroundColor: "white",
                        borderRadius: 40,
                        borderWidth: 4,
                        borderColor: "#F05050",
                        marginTop: -35
                    }]}>
                        <StyledText big style={{ marginBottom: 10 }}>Profile Photo</StyledText>
                        <View style={styles.decisionRow}>
                            <TouchableOpacity 
                                style={styles.optionBtn}
                                onPress={() => {
                                    console.log("Camera button pressed");
                                    onCameraPress();
                                }}
                            >
                                <MaterialCommunityIcons 
                                    name="camera-outline"
                                    size={30}
                                    color={"#F05050"}
                                />
                                <StyledText small>Camera</StyledText>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.optionBtn}
                                onPress={() => {
                                    console.log("Gallery button pressed");
                                    onGalleryPress();
                                }}
                            >
                                <MaterialCommunityIcons 
                                    name="image-outline"
                                    size={30}
                                    color={"#F05050"}
                                />
                                <StyledText small>Gallery</StyledText>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.optionBtn}
                                onPress={() => {
                                    console.log("Remove button pressed");
                                    onRemovePress();
                                }}
                            >
                                <MaterialCommunityIcons 
                                    name="trash-can-outline"
                                    size={30}
                                    color={"#F05050"}
                                />
                                <StyledText small>Remove</StyledText>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Pressable>
        </Modal>
    );
};

export default UploadModal;
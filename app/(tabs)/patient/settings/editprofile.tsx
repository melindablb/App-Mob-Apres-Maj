import icons from "@/constants/icons";
import { useAuth } from "@/contexts/AuthContext";
import { changepfp, deletepfp, editprofil } from "@/services/editprof";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import * as yup from "yup";
import Avatar from "../../../components/Avatar";
import UploadModal from "../../../components/UploadModal";


interface data {
  height?: string;
  weight?: string;
  codePostal?: string;
  adress?: string;
}

type ImageData = {
  uri: string;
  name: string;
  type: string;
};

const schema = yup.object().shape({
  height: yup.string().matches(/^\d+(,\d+)?$/, "Numbers only").optional(),

  weight: yup.string().matches(/^\d+(,\d+)?$/, "Numbers only").optional(),

  codePostal: yup.string().matches(/^\d{5}$/, "Must be exactly 5 digits").optional(),

  adress: yup.string().optional(),
})



export default function Edit(){
  const [fontsLoaded] = useFonts({
        "Montserrat-Thin": require("../../../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
        "Montserrat-SemiBold": require("../../../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
        "Montserrat-Medium": require("../../../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
        'Montserrat-Bold': require('../../../../assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
      });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [imagepdp, setImagepdp] = useState<ImageData | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [codePostal, setCodePostal] = useState<string>(""); 
  
  const [isLoading, setIsLoading] = useState(false);
  const { user, UpdateData } = useAuth();

  const [OLDheight, OLDsetHeight] = useState("");
  const [OLDweight, OLDsetWeight] = useState("");
  const [OLDcodePostal, OLDsetCodePostal] = useState<string>("");
  const [OLDadress, OLDsetadress]= useState("");
  


  useEffect(() => {
    setIsLoading(true);
    if (fontsLoaded) {
      console.log("Fonts loaded successfully!");
    } else {
      console.log("Fonts not loaded yet.");
    }
    setIsLoading(false);
  }, [fontsLoaded]);

  useEffect(() => {
        //on charge les info du ctx      
        setFirstName(user?.name || "");
        setLastName(user?.lastname || "");
        setBirthday(user?.birthdate.slice(0, 10) || "");
        OLDsetHeight(user?.height || "");
        OLDsetWeight(user?.weight || "");
        OLDsetCodePostal(user?.postalcode || "");
        OLDsetadress(user?.address || "");
  });

  const isValidCodePostal = (code: string): Boolean => {

    if(code == "") return true; // pas de changement
    const codePostalRegex = /^\d{5}$/;
    if (!codePostalRegex.test(code)) return false; // incorrecte

    const provinceCode = parseInt(code.substring(0, 2), 10);
    const bool = provinceCode >= 1 && provinceCode <= 58;
    if (bool==false)
      return false; // incorrecte
    else
      return true; // correcte
  };

  useEffect(() => {
    const loadSavedImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem('profileImage');
        if (savedImage) {
          setImage(savedImage);
        }
      } catch (error) {
        console.log("Error loading saved image:", error);
      }
    };
    loadSavedImage();
  }, []);

useEffect(() => {
  console.log(imagepdp)
},[imagepdp])

  const uploadImage = async (mode: "gallery" | "camera") => {
    try {
      let result: ImagePicker.ImagePickerResult;

      if (mode === "gallery") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission needed", "Grant gallery permission.");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission needed", "Grant camera permission.");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled && result.assets?.length > 0) {
        await saveImage(result.assets[0].uri, result.assets[0].fileName||"",result.assets[0].mimeType||"");
      }
    } catch (error) {
      Alert.alert("Error", "Error uploading image.");
      setModalVisible(false);
    }
  };

  const saveImage = async (imageUri: string, imageName: string, mimeType:string) => {
    try {
      setImagepdp(
        {
          uri: imageUri,
          name:imageName,
          type:mimeType,
        }
      );
      setIsUploading(true);
      // env au back
      const formData = new FormData();
      formData.append("ID",user?.uid||"")
      formData.append("Role","10")
      formData.append("File",imagepdp as any)

      const response = await changepfp(formData)
      console.log("REPONSE DU BACK",response.data)
      // on update le contexte

      
      setImagepdp({
        uri: response.data,
        name: imagepdp?.name || "",
        type: imagepdp?.type || "",
      });

      console.log("imagepdp: ",imagepdp)

      const datamaj ={
        uid: user?.uid || "",
        token: user?.token || "",
        name: user?.name || "",
        lastname: user?.lastname || "",
        email: user?.email || "",
        height: user?.height|| "",
        weight: user?.weight|| "",
        phonenumber: user?.phonenumber || "",
        postalcode: user?.postalcode|| "",
        address: user?.address|| "",
        birthdate: user?.birthdate || "",
        pdp : response.data, 
      }
      console.log("datamaj",datamaj)
      UpdateData(datamaj)
      setIsUploading(false);
      //router.replace("/patient/settings/editprofile");
      setModalVisible(false);
    } catch (error) {
      setIsUploading(false);
      console.log(error)
      Alert.alert("Error", "Failed to save image. ici");
    }
  };

  const removeImage = async () => {
    try {
      setImagepdp(null);
      const formData = new FormData();
      formData.append("Uid",user?.uid||"");
      formData.append("Role","10")

      const response = await deletepfp(formData);
      console.log("REPONSE DU BACK",response.data)
      const datamaj ={
        uid: user?.uid || "",
        token: user?.token || "",
        name: user?.name || "",
        lastname: user?.lastname || "",
        email: user?.email || "",
        height: user?.height|| "",
        weight: user?.weight|| "",
        phonenumber: user?.phonenumber || "",
        postalcode: user?.postalcode|| "",
        address: user?.address|| "",
        birthdate: user?.birthdate || "",
        pdp : icons.avatar, 
      }
      UpdateData(datamaj)
      setModalVisible(false);
      Alert.alert("Success", "Profile picture removed.");
      
    } catch (error) {
      console.error("Error removing image:", error);
      Alert.alert("Error", "Failed to remove profile picture");
      setModalVisible(false);
    }
  };




  const onSubmit = async (data: data) => {

    if(data.height==null && data.weight==null && data.codePostal==null && data.adress==null){ console.log("Aucun Changement");return;} // on verif qu il y a au moins une modification
    
    if(data.codePostal!=null){
    const provinceCode = parseInt(data.codePostal.substring(0, 2), 10);
    const bool = provinceCode >= 1 && provinceCode <= 58;
    if(bool==false){
      Alert.alert("Erreur", "Le code postal est invalide. Il doit être composé de 5 chiffres, avec les deux premiers chiffres entre 01 et 58 (provinces algériennes).");
      return;
    }
  }
    try {
      
      console.log("Height: ",data.height,"weight",data.weight,"postal code",data.codePostal,"address",data.adress)
      setIsLoading(true);

      const formData=new FormData();

      formData.append("Role", "10")
      formData.append("ID", user?.uid || "");
      if(data.height!=null)formData.append("height", data.height);
      if(data.weight!=null)formData.append("weight", data.weight);
      if(data.codePostal!=null)formData.append("postalcode",data.codePostal);
      if(data.adress!=null)formData.append("address",data.adress);

      const jsonData = JSON.stringify(formData)
              console.log("DATA A ENV ",jsonData)

      const response = await editprofil(formData);
      console.log("REPONSE DU BACK",response.data);
      const userupd ={
        uid: user?.uid || "",
        token: user?.token || "",
        name: user?.name || "",
        lastname: user?.lastname || "",
        email: user?.email || "",
        height: response.data.newheightpatient.toString().replace(".",","),
        weight: response.data.newweightpatient.toString().replace(".",","),
        phonenumber: user?.phonenumber || "",
        postalcode: response.data.newpostalcodepatient,
        address: response.data.newaddresspatient,
        birthdate: user?.birthdate || "",
        pdp : user?.pdp || "",        
      }
      UpdateData(userupd);
      setFirstName(user?.name || "");
      setLastName(user?.lastname || "");
      setBirthday(user?.birthdate.slice(0, 10) || "");
      OLDsetHeight(user?.height || "");
      OLDsetWeight(user?.weight || "");
      OLDsetCodePostal(user?.postalcode || "");
      OLDsetadress(user?.address || "");

    } catch (error) {
      console.error("Erreur backend :", error);
      Alert.alert("Erreur", "Impossible de sauvegarder les données.");
    }
    finally{
      setIsLoading(false);
    }
  };



  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => router.back()}>
                <Image source={icons.back} style={styles.backIcon} />
              </TouchableOpacity>
              <Text style={styles.headerText}>Edit Profile</Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.profileContainer}>
                <Avatar uri={user?.pdp || ""} onButtonPress={() => setModalVisible(true)} />
                {isUploading && (
                  <Text style={styles.uploadingText}>Uploading image...</Text>
                )}
              </View>

              {isLoading ? (
                <Text style={styles.loadingText}>Loading user data...</Text>
              ) : (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>First Name</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        value={firstName}
                        editable={false}
                        style={[styles.input,{color:"#888"}]}
                        placeholder="First Name"
                        placeholderTextColor="#888"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Last Name</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        value={lastName}
                        editable={false}
                        style={[styles.input,{color:"#888"}]}
                        placeholder="Last Name"
                        placeholderTextColor="#888"
                      />
                    </View>
                  </View>

                  

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Birthday</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        value={birthday}
                        editable={false}
                        style={[styles.input,{color:"#888"}]}
                        placeholder="dd/mm/yyyy"
                        placeholderTextColor="#888"
                      />
                    </View>
                  </View>

                  <View style={styles.rowGroup}>
                    <View style={styles.smallInputGroup}>
                      <Text style={styles.inputLabel}>Height</Text>
                      <View style={styles.inputWrapper}>
                        <Controller
                         control={control}
                         name="height"
                         render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                          value={value}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          keyboardType="numeric"
                          style={styles.input}
                          placeholder={OLDheight+" m"}
                          placeholderTextColor="#888"
                          />
                         )}
                        />
                      </View>
                    </View>

                    <View style={styles.smallInputGroup}>
                      <Text style={styles.inputLabel}>Weight</Text>
                      <View style={styles.inputWrapper}>
                        <Controller
                        control={control}
                        name="weight"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                          value={value}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          keyboardType="numeric"
                          style={styles.input}
                          placeholder={OLDweight+" kg"}
                          placeholderTextColor="#888"
                          />
                         )}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Postal Code</Text>
                    <View style={styles.inputWrapper}>
                    <Controller
                        control={control}
                        name="codePostal"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                          value={value}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          keyboardType="numeric"
                          style={[
                            styles.input,
                            { color: isValidCodePostal(codePostal) || codePostal === "" ? "black" : "red" }
                          ]}
                          placeholder={OLDcodePostal}
                          placeholderTextColor="#888"
                          maxLength={5}
                          />
                         )}
                        />
                    </View>
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Adress</Text>
                    <View style={styles.inputWrapper}>
                    <Controller
                        control={control}
                        name="adress"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                          value={value}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          style={styles.input}
                          placeholder={OLDadress}
                          placeholderTextColor="#888"
                          />
                         )}
                        />
                    </View>
                  </View>
                </>
              )}
            </ScrollView>

            <UploadModal
              modalVisible={modalVisible}
              onBackPress={() => setModalVisible(false)}
              onCameraPress={() => uploadImage("camera")}
              onGalleryPress={() => uploadImage("gallery")}
              onRemovePress={removeImage}
            />
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginTop: 45,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  backIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    tintColor: "#F05050",
  },
  headerText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
    fontWeight: "600",
    color: "#F05050",
    textAlign: "center",
    flex: 1,
  },
  placeholder: {
    width: 30,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  uploadingText: {
    marginTop: 10,
    color: "#F05050",
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
  },
  loadingText: {
    marginTop: 20,
    color: "#F05050",
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    textAlign: "center",
  },
  inputGroup: {
    alignSelf: "stretch",
    marginTop: "2%",
    marginBottom: "2%",
  },
  inputLabel: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: "black",
    marginBottom: "1%",
    paddingHorizontal: 10,
  },
  inputWrapper: {
    height: 44,
    width: "100%",
    borderColor: "#F05050",
    borderWidth: 0.75,
    borderRadius: 17,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  input: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16.5,
    color: "black",
  },
  saveButton: {
    backgroundColor: "#F05050",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginHorizontal: 90,
    marginBottom: 50,
    marginTop: 10,
    width: "50%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  saveButtonText: {
    color: "white",
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
    fontWeight: "600",
  },
  rowGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "2%",
    marginBottom:"2%"
  },
  smallInputGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
});
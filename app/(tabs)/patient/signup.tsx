"use client"

import { Ionicons } from "@expo/vector-icons"
import { yupResolver } from "@hookform/resolvers/yup"
import { useFonts } from "expo-font"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import type { Float } from "react-native/Libraries/Types/CodegenTypes"
import * as yup from "yup"
import icons from "../../../constants/icons"
import images from "../../../constants/images"
import { signupPatient } from '../../../services/auth'
import ImageController from "../image-controller"

// Updated ImageValue interface to match the enhanced ImageController
interface ImageValue {
  uri: string
  isValid: boolean
  name: string
  size: number
  mimeType: string
}

interface SignUpFormVal {
  firstname: string //ok
  lastname: string //ok
  dateofbirth: Date //ok
  age: number //ok
  gender: boolean //ok
  Height: Float | string //ok
  Weight: Float | string //ok
  adress: string //ok
  postalcode: string //ok
  phonenumber: string //ok
  email: string //ok
  password: string //ok
  image: ImageValue | null //updated to use the enhanced ImageValue interface
}

const schema = yup.object().shape({
  firstname: yup
    .string()
    .matches(/^[^0-9]*$/, "Must not contain numbers")
    .required("First Name is required"),

  lastname: yup
    .string()
    .matches(/^[^0-9]*$/, "Must not contain numbers")
    .required("Last Name is required"),

  dateofbirth: yup.date().required("Date Of Birth is required"),

  age: yup.number().positive("Wrong Date of Birth").required("Wrong Date Of Birth"),

  gender: yup.boolean().required("Gender is required"),

  Height: yup
    .string()
    .matches(/^\d+(,\d+)?$/, "Numbers only")
    .required("Height is required"),

  Weight: yup
    .string()
    .matches(/^\d+(,\d+)?$/, "Numbers only")
    .required("Weight is required"),

  adress: yup.string().required("Adress is required"),

  postalcode: yup
    .string()
    .matches(/^\d{5}$/, "Must be exactly 5 digits")
    .required("Postal code is required"),

  phonenumber: yup
    .string()
    .matches(/^\d{10}$/, "Must be exactly 10 digits")
    .required("Phone Number is required"),

  email: yup.string().email("Must be a valid Email").required("Email is required"),

  password: yup
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(16, "Password cannot exceed 16 characters.")
    .required("Password is required"),

  image: yup
    .object()
    .shape({
      uri: yup.string().required("Image is required"),
      isValid: yup.boolean().oneOf([true], "Please upload a valid image").required(),
      name: yup.string().required(),
      size: yup.number().required(),
      mimeType: yup.string().required(),
    })
    .required("Image is required"),
})

const SignUpP = () => {
    const [isSecure,setIsSecure]=useState(true);

  const [validationResult, setValidationResult] = useState<{
    uri: string
    isValid: boolean
  } | null>(null)
  const handleImageValidated = (uri: string, isValid: boolean) => {
    console.log("Image validation result:", { uri, isValid })
    setValidationResult({ uri, isValid })
  }
  /////////////////////////////////
  const [fontsLoaded] = useFonts({
    "Montserrat-Thin": require("../../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    "Montserrat-Regular": require("../../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "Montserrat-Medium": require("../../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
  })

  const [isVisible, setIsVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())


  //pour calculer lage
  const calculateAge = (birthDate: Date): number => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    if (age <= 17) return -1
    const month = today.getMonth() - birthDate.getMonth()

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [gender, setGender] = useState<boolean | null>(null)

  //TODO: submit
  const onSubmit =  async (data: SignUpFormVal) => {
    try {
      const formData = new FormData();
  
      formData.append('Name', data.firstname);
      formData.append('LastName', data.lastname);
      formData.append('DateOfBirth', data.dateofbirth.toISOString());
      formData.append('Age', data.age.toString());
      formData.append('Gender', data.gender ? '1' : '0');
      formData.append('Height', typeof data.Height === 'string' ? data.Height.replace(',', '.') : data.Height.toString());
      formData.append('Weight', typeof data.Weight === 'string' ? data.Weight.replace(',', '.') : data.Weight.toString());
      formData.append('Adress', data.adress);
      formData.append('PostalCode', data.postalcode);
      formData.append('PhoneNumber', data.phonenumber);
      formData.append('Email', data.email);
      formData.append('PasswordHash', data.password);
      formData.append('Role', '10');
  
      if (data.image) {
        formData.append('File', {
          uri: data.image.uri,
          name: data.image.name,
          type: data.image.mimeType,
        } as any); 
      }
      
      // Affiche le contenu de formData dans la console
      const jsonData = JSON.stringify(formData)
      console.log(jsonData)
      
      const response = await signupPatient(formData); 

      Alert.alert('Succès', 'Inscription réussie ✅');
      console.log(response.data);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erreur', "Échec de l’inscription ❌");
    }
  }

  const router = useRouter()
  // taille de la page
  const [HeightPage,setHeightPage]=useState(1650)
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            backgroundColor: "white",
            alignItems: "center",
            minHeight: HeightPage,
          }}
          bounces={false}
        >
          <Image
            source={images.designSI}
            style={{
              width: 420,
              height: 300,
              position: "absolute",
              bottom: 0,
            }}
          />
          <Image
            source={icons.logoR}
            style={{
              width: 40,
              height: 40,
              marginTop:"11%"
            }}
          />
          <Text
            style={{
              fontFamily: "Montserrat-SemiBold",
              fontSize: 18,
              color: "#F05050",
              marginTop:"1%",
              textShadowColor: "rgba(0, 0, 0,0.35)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 2,
            }}
          >
            E-Mergency
          </Text>

          <Text
            style={{
              fontFamily: "Montserrat-SemiBold",
              fontSize: 32,
              color: "#F05050",
              marginTop:"7.5%",
              textShadowColor: "rgba(0, 0, 0,0.35)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3,
            }}
          >
            Sign Up
          </Text>
          <Text
            style={{
              fontFamily: "Montserrat-SemiBold",
              fontSize: 20,
              color: "#FE8080",
              marginTop:"-0.5%",
              textShadowColor: "rgba(0, 0, 0,0.25)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
          >
            Let's get started !
          </Text>

          <Controller
            control={control}
            name="firstname"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="First Name"
                placeholderTextColor="gray"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{
                  width: "80%",
                  height: "2.7%",
                  backgroundColor: "white",
                  borderRadius: 17,
                  borderWidth: 1,
                  borderColor: "#9C9C9C",
                  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
                  marginTop:"12%",
                  fontFamily: "Montserrat-Regular",
                  fontSize: 17,
                  color: "black",
                  textAlign: "left",
                  paddingHorizontal: "5%",
                }}
              />
            )}
          />
          {errors.firstname && (
            <Text
              style={{
                marginTop:"0.2%",
                color: "red",
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.firstname.message}
            </Text>
          )}

          <Controller
            control={control}
            name="lastname"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="gray"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{
                  width: "80%",
                  height: "2.7%",
                  backgroundColor: "white",
                  borderRadius: 17,
                  borderWidth: 1,
                  borderColor: "#9C9C9C",
                  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
                  marginTop:"5%",
                  fontFamily: "Montserrat-Regular",
                  fontSize: 17,
                  color: "black",
                  textAlign: "left",
                  paddingHorizontal: "5%",
                }}
              />
            )}
          />
          {errors.lastname && (
            <Text
              style={{
                marginTop:"0.2%",
                color: "red",
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.lastname.message}
            </Text>
          )}

          <Controller
            control={control}
            defaultValue={new Date()}
            name="dateofbirth"
            render={({ field: { onChange, value } }) => (
              <View
                style={{
                  marginTop: "5%",
                  height: "2.7%",
                  width: "80%",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height:"100%",
                    backgroundColor: "white",
                    borderRadius: 17,
                    borderWidth: 1,
                    borderColor: "#9C9C9C",
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
                    paddingHorizontal:"5%",
                    flexDirection: "row",
                    gap:"22.5%",
                    alignItems:"center",
                    justifyContent:"space-between",
                  }}
                  onPress={() => setIsVisible(true)}
                  activeOpacity={0.6}
                >
                  <Text
                    style={{
                      fontFamily: "Montserrat-Regular",
                      fontSize: 17,
                      color: "gray",
                      textAlign: "left",
                    }}
                  >
                    Birth Date
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Montserrat-Regular",
                      fontSize: 17,
                      color: "black",
                      textAlign: "right",
                    }}
                  >
                    {selectedDate.toDateString()}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isVisible}
                  mode="date"
                  onConfirm={(date) => {
                    onChange(date)
                    const agec = calculateAge(date)
                    if (agec !== 0) {
                      setValue("age", agec)
                    } else setValue("age", -1)
                    setSelectedDate(date)
                    setIsVisible(false)
                  }}
                  onCancel={() => setIsVisible(false)}
                  textColor="black"
                  pickerContainerStyleIOS={{ backgroundColor: "white" }}
                />
              </View>
            )}
          />
          {errors.dateofbirth && (
            <Text
              style={{
                marginTop:"0.2%",
                color: "red",
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.dateofbirth.message}
            </Text>
          )}
          {errors.age && (
            <Text
              style={{
                marginTop:"0.2%",
                color: "red",
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.age.message}
            </Text>
          )}

          <View
            style={{
              marginTop:"5%"
            }}
          >
            <Controller
              control={control}
              name="gender"
              rules={{ required: "Gender is required" }}
              render={({ field: { onChange } }) => (
                <View style={styles.radioGroup}>
                  {[
                    { value: true, label: "Male", nb: 1 },
                    { value: false, label: "Female", nb: 0 },
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.nb}
                      style={[styles.radioContainer]}
                      onPress={() => {
                        setGender(item.value)
                        onChange(item.value)
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.radioCircle, gender === item.value && styles.selectedCircle]} />
                      <Text style={[styles.label, gender === item.value && styles.selectedText]}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </View>

          {errors.gender && (
            <Text
              style={{
                marginTop:"0.2%",
                color: "red",
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.gender.message}
            </Text>
          )}

          <View
            style={{
              flexDirection: "row",
              marginTop:"4%",
              height:"2.7%",
              gap:"17.5%"
            }}
          >
            <Controller
              control={control}
              name="Height"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Height    m"
                  keyboardType="numeric"
                  placeholderTextColor="gray"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{
                    width: "30%",
                    height:"100%",
                    backgroundColor: "white",
                    borderRadius: 17,
                    borderWidth: 1,
                    borderColor: "#9C9C9C",
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
                    fontFamily: "Montserrat-Regular",
                    fontSize: 17,
                    color: "black",
                    textAlign: "left",
                    paddingHorizontal:"3%",
                  }}
                />
              )}
            />

            
            <Controller
              control={control}
              name="Weight"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Weight   kg"
                  keyboardType="numeric"
                  placeholderTextColor="gray"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{
                    width: "30%",
                    height:"100%",
                    backgroundColor: "white",
                    borderRadius: 17,
                    borderWidth: 1,
                    borderColor: "#9C9C9C",
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
                    fontFamily: "Montserrat-Regular",
                    fontSize: 17,
                    color: "black",
                    textAlign: "left",
                    paddingHorizontal:"3%",
                  }}
                />
              )}
            />
          </View>

          <View style={{
            flexDirection:"row",
            gap:"15%",
            marginTop:"0.2%",
          }}>
          {errors.Height && (
            <Text
              style={{
                marginLeft:"12%",
                color: "red",
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.Height.message}
            </Text>
          )}

          {errors.Weight && (
            <Text
              style={{
                marginRight:"12%",
                color: "red",
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.Weight.message}
            </Text>
          )}
        </View>
          <Controller
            control={control}
            name="adress"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Adress"
                placeholderTextColor="gray"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{
                  width: "80%",
                  height: "2.7%",
                  backgroundColor: "white",
                  borderRadius: 17,
                  borderWidth: 1,
                  borderColor: "#9C9C9C",
                  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
                  marginTop:"5%",
                  fontFamily: "Montserrat-Regular",
                  fontSize: 17,
                  color: "black",
                  textAlign: "left",
                  paddingHorizontal: "5%",
                }}
              />
            )}
          />
          {errors.adress && (
            <Text
              style={{
                marginTop:"0.2%",
                color: "red",
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.adress.message}
            </Text>
          )}

          <Controller
            control={control}
            name="postalcode"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Postal Code"
                placeholderTextColor="gray"
                keyboardType="numeric"
                onBlur={onBlur}
                maxLength={5}
                onChangeText={onChange}
                value={value}
                style={{
                  width: "80%",
                  height: "2.7%",
                  backgroundColor: "white",
                  borderRadius: 17,
                  borderWidth: 1,
                  borderColor: "#9C9C9C",
                  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
                  marginTop:"5%",
                  fontFamily: "Montserrat-Regular",
                  fontSize: 17,
                  color: "black",
                  textAlign: "left",
                  paddingHorizontal: "5%",
                }}
              />
            )}
          />
          {errors.postalcode && (
            <Text
              style={{
                marginTop:"0.2%",
                color: "red",
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.postalcode.message}
            </Text>
          )}

          <Controller
            control={control}
            name="phonenumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="gray"
                keyboardType="numeric"
                onBlur={onBlur}
                maxLength={10}
                onChangeText={onChange}
                value={value}
                style={{
                  width: "80%",
                  height: "2.7%",
                  backgroundColor: "white",
                  borderRadius: 17,
                  borderWidth: 1,
                  borderColor: "#9C9C9C",
                  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
                  marginTop:"5%",
                  fontFamily: "Montserrat-Regular",
                  fontSize: 17,
                  color: "black",
                  textAlign: "left",
                  paddingHorizontal: "5%",
                }}
              />
            )}
          />
          {errors.phonenumber && (
            <Text
              style={{
                marginTop:"0.2%",
                color: "red",
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.phonenumber.message}
            </Text>
          )}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{
                width: "80%",
                  height: "2.7%",
                  backgroundColor: "white",
                  borderRadius: 17,
                  borderWidth: 1,
                  borderColor: "#9C9C9C",
                  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
                  marginTop:"5%",
                  overflow:"scroll",
                  paddingHorizontal: "5%",
                  justifyContent:"center"
              }}>
              <TextInput
                placeholder="Email"
                placeholderTextColor="gray"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: 17,
                  color: "black",
                  textAlign: "left",
                }}
              />
              </View>
            )}
          />
          {errors.email && (
            <Text
              style={{
                marginTop:"0.2%",
                color: "red",
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.email.message}
            </Text>
          )}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Password"
                placeholderTextColor="gray"
                secureTextEntry={isSecure}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{
                  width: "80%",
                  height: "2.7%",
                  backgroundColor: "white",
                  borderRadius: 17,
                  borderWidth: 1,
                  borderColor: "#9C9C9C",
                  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
                  marginTop:"5%",
                  fontFamily: "Montserrat-Regular",
                  fontSize: 17,
                  color: "black",
                  textAlign: "left",
                  paddingHorizontal: "5%",
                }}
              />
            )}
          />
            <TouchableOpacity style={{ position: 'absolute', top:825,right:60}} onPress={()=> setIsSecure(!isSecure)}>
      <Ionicons name={isSecure ? 'eye-off' : 'eye'} size={24} color="gray" />
      </TouchableOpacity>
          {errors.password && (
            <Text
              style={{
                marginTop:"0.2%",
                color: "red",
                fontFamily: "Montserrat-Regular",
              }}
            >
              {errors.password.message}
            </Text>
          )}

          <View style={{ marginTop:"5%", alignItems:"center" }}>
            <Text
              style={{
                fontFamily: "Montserrat-Medium",
                fontSize: 18,
                color: "black",
                textAlign: "center",
              }}
            >
              ID card
            </Text>

            <View>
              <Controller
                control={control}
                name="image"
                render={({ field: { onChange, value } }) => (
                  <ImageController
                    value={value}
                    onChange={onChange}
                    maxSizeInMB={4}
                    allowedFormats={["jpeg", "jpg", "png"]}
                    imageStyle={{ width: 150, height: 100 }}
                  />
                )}
              />
              {errors.image && (
                <Text style={styles.errorText}>
                  {typeof errors.image.message === "string" ? errors.image.message : "Please upload a valid image"}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={{
                width: 230,
                height: 65,
                backgroundColor: "#F05050",
                borderRadius: 20,
                boxShadow: "0px 2px 7px rgba(0, 0, 0, 0.25)",
                marginTop: 50,
              }}
              activeOpacity={0.8}
              onPress={handleSubmit(onSubmit)}
            >
              <Text
                style={{
                  fontSize: 25,
                  textAlign: "center",
                  fontFamily: "Montserrat-SemiBold",
                  color: "#FFFAF0",
                  lineHeight: 65,
                  textShadowColor: "rgba(0, 0, 0, 0.30)",
                  textShadowOffset: { width: 0, height: 0.1 },
                  textShadowRadius: 4,
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 20,
              }}
              activeOpacity={0.8}
              onPress={() => router.back()}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Montserrat-SemiBold",
                  color: "#F05050",
                  textAlign: "center",
                  textShadowColor: "rgba(0, 0, 0, 0.30)",
                  textShadowOffset: { width: 0, height: 0.1 },
                  textShadowRadius: 4,
                }}
              >
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  radioGroup: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    gap:"7%"
  },
  radioContainer: {
    flexDirection: "row",
    
    alignItems: "center",
    width: 160,
    paddingHorizontal: "5%",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#F05050",
    marginRight: 10,
  },
  selectedCircle: {
    backgroundColor: "#F05050",
  },
  label: {
    fontSize: 17,
    fontFamily: "Montserrat-Regular",
    color: "gray",
  },
  selectedText: {
    fontFamily: "Montserrat-Medium",
    color: "black",
  },
  resultContainer: {
    margin: 20,
    padding: 15,
    borderRadius: 8,
  },
  validResult: {
    backgroundColor: "#dcfce7",
    borderColor: "#10b981",
    borderWidth: 1,
  },
  invalidResult: {
    backgroundColor: "#fee2e2",
    borderColor: "#ef4444",
    borderWidth: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
  },
  errorText: {
    marginTop:"0.2%",
    color: "red",
    fontFamily: "Montserrat-Regular",
  },
})

export default SignUpP

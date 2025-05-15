import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from "@hookform/resolvers/yup";
import { useFonts } from "expo-font";
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as yup from "yup";
import icons from '../../constants/icons';
import images from '../../constants/images';
import { useAuth } from '../../contexts/AuthContext';
import { signinPatient, signinProS } from '../../services/auth';


interface FormData {
    category: string;
    email: string;
    password: string;
  }

const schema = yup.object().shape({

    category: yup
    .string()
    .required("Type is required"),

    email: yup
    .string()
    .email("Email must be a valid email")
    .required("Email is required"),

    password: yup
    .string()
    .required("Password is required"),

  });

const SignIn = () => {

  const router = useRouter();

    const [fontsLoaded] = useFonts({
        "Montserrat-Thin": require("../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
        "Montserrat-Regular": require("../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    });

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
      });

    const [isSecure,setIsSecure]=useState(true);
    const [category, setCategory] = useState("");
    const [error,seterror]=useState<string | null>(null);
      
    const { user, signInD } = useAuth();

  const onSubmit = async (data: FormData) => {
    seterror(null);
    try {
      const formData = new FormData();
  
      formData.append('Role', data.category); // ou ce que tu veux mettre
      formData.append('Email', data.email);
      formData.append('PasswordHash', data.password);
        
        const jsonData = JSON.stringify(formData)
              console.log(jsonData)



              if (category === "10") {
              const response = await signinPatient(formData); 
              console.log(response.data);
              const userD = {
                uid: response.data.result.uid,
                token: response.data.result.token,
                name: response.data.result.name,
                lastname: response.data.result.lastName,
                email: response.data.result.email,
                height: response.data.result.height,
                weight: response.data.result.weight,
                phonenumber: response.data.result.phonenumber,
                postalcode: response.data.result.postalcode,
                address: response.data.result.address,
                birthdate: response.data.result.birthdate,
                pdp: response.data.result.pdp,
              }
              signInD(userD);
              router.replace("./patient/menubar/dashboard");
              }
              else
              {
              const response = await signinProS(formData); 
              console.log(response.data);  
              const userD = {
                uid: response.data.result.uid,
                token: response.data.result.token,
                name: response.data.result.name,
                lastname: response.data.result.lastName,
                email: response.data.result.email,
                height: response.data.result.height,
                weight: response.data.result.weight,
                phonenumber: response.data.result.phonenumber,
                postalcode: response.data.result.postalcode,
                address: response.data.result.address,
                birthdate: response.data.result.birthdate,
                pdp: response.data.result.pdp,
              }
              signInD(userD);
              router.replace("./healthcarepro/menubar/dashboard");

              }
            } catch (errorA: any) {
              console.log(errorA);
              if (errorA.response.status == 500){
                seterror("Email or password is incorrect");
              }
            }
            

      }  

    return (

    <View
     style={{
            flex: 1,
            alignItems: "center",
            backgroundColor: 'white'
        }}>


    <Image source={images.designSI} style={{
                width:420,
                height:300,
                position:"absolute",
                bottom:"-3%",
              }}/>
   
   <Image source={icons.logoR} style={{
        width:50,
        height:50,
        marginTop:"10%"
    }}/>
    <Text style={{
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color:"#F05050",
        marginTop:"1%",
        textShadowColor: 'rgba(0, 0, 0,0.25)',
        textShadowOffset: { width: 0, height: 2 }, 
        textShadowRadius: 2
    }}>E-Mergency</Text>
    <Text style={{
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 32,
        color:"#F05050",
        marginTop:"7%",
        textShadowColor: 'rgba(0, 0, 0,0.35)',
        textShadowOffset: { width: 0, height: 1 }, 
        textShadowRadius: 3
    }}>Sign In</Text>
    <Text style={{
        fontFamily: 'Montserrat-SemiBold',
        fontSize:20,
        color:"#FE8080",
        marginTop:"-1%",
        textShadowColor: 'rgba(0, 0, 0,0.25)',
        textShadowOffset: { width: 0, height: 1 }, 
        textShadowRadius: 2,
        marginBottom:"3%"
    }}>Good to see you back !</Text>


<Text style={styles.label}>You Are a ...</Text>

<View style={{
  marginTop:"2%",
  alignContent:"center",
  marginBottom:"0%",
  height:"9%"
}}>
      <Controller
        control={control}
        name="category"
        rules={{ required: "Choisissez une catégorie" }}
        render={({ field: { onChange } }) => (
          <View style={styles.cardContainer}>
            {[
              { id: "10", label: "Patient", icon: icons.patient },
              { id: "20", label: "Healthcare Pro", icon: icons.healthpro },
            ].map((cat) => (
              <Pressable
                key={cat.id}
                style={[styles.card, category === cat.id && styles.selectedCard]}
                onPress={() => { setCategory(cat.id); onChange(cat.id); }}
              >
                <Image source={cat.icon} style={styles.icon} /> 
                <Text style={styles.cardText}>{cat.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
      />
</View>

{typeof errors.category?.message === "string" && (
  <Text style={{
    color: 'red',
    fontFamily: 'Montserrat-Regular',
    textAlign:"center",
  }}>{errors.category.message}</Text>
)}

<TouchableOpacity style={{
            width: "80%",
                height: "5%",
                backgroundColor: "white",
                borderRadius: 17,
                borderWidth:1,
                borderColor:"#9C9C9C",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
                marginTop:"4.5%",
                justifyContent:"center",
                paddingLeft: "5%",
          }}
          activeOpacity={1}>
    <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          
          <TextInput
            placeholder="Email"
            placeholderTextColor="gray"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={{
                fontFamily: 'Montserrat-Regular',
                fontSize: 17,
                color: "black",
                textAlign: 'left',
            }}
          />
          
        )}
      />
      </TouchableOpacity>
      {errors.email && <Text style={{
        marginTop:"1%",
        color: 'red',
        fontFamily: 'Montserrat-Regular',
      }}>{errors.email.message}</Text>}
   
      

   <TouchableOpacity style={{
            width: "80%",
                height: "5%",
                backgroundColor: "white",
                borderRadius: 17,
                borderWidth:1,
                borderColor:"#9C9C9C",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
                marginTop:"5%",
                justifyContent:"space-between",
                paddingLeft: "5%",
                paddingRight:"4%",
                flexDirection:"row",
          }}
          activeOpacity={1}>
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Password"
            placeholderTextColor="gray"
            secureTextEntry={isSecure}
            onBlur={onBlur}
            onChangeText={(value)=>{
              seterror(null);
              onChange(value);
            }}
            value={value}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 17,
              color: "black",
              textAlign: 'left',
              width:"80%"
            }}
          />
        )}
      />
      <TouchableOpacity style={{ justifyContent:"center"}} onPress={()=> setIsSecure(!isSecure)}>
      <Ionicons name={isSecure ? 'eye-off' : 'eye'} size={24} color="gray" />
      </TouchableOpacity>
      </TouchableOpacity>
      
      {errors.password && <Text style={{
        marginTop:"1%",
        color: 'red',
        fontFamily: "Montserrat-Regular"
      }}>{errors.password.message}</Text>}  
      {error && <Text style={{
        marginTop:"1%",
        color: 'red',
        fontFamily: 'Montserrat-Regular',
      }}>{error}</Text>}

      

      <TouchableOpacity style={{
        width: "50%",
        height: "8%",
        marginTop:"10%",
        backgroundColor: "#F05050",
        borderRadius: 20,
        justifyContent:"center",
        boxShadow: "0px 2px 7px rgba(0, 0, 0, 0.25)",
      }}
      activeOpacity={0.8} 
      onPress={handleSubmit(onSubmit)}>
        <Text style={{
            fontSize: 25,
            textAlign: "center",
            fontFamily: 'Montserrat-SemiBold',
            color: "white",
            textShadowColor: 'rgba(0, 0, 0, 0.30)',
            textShadowOffset: { width: 0, height: 0.1 }, 
            textShadowRadius: 4
        }}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
                marginTop:"3%"
            }}activeOpacity={0.8} onPress={() => router.push("/resetpwd")}>
            <Text style={{
              fontSize: 17,
              fontFamily: 'Montserrat-SemiBold',
              color: "#F05050",
              textAlign: 'center',
              textShadowColor: 'rgba(0, 0, 0, 0.30)',
              textShadowOffset: { width: 0, height: 0.1 }, 
              textShadowRadius: 4,
              }}>
            Forgot Password?
            </Text>
            </TouchableOpacity>
        <TouchableOpacity style={{
                marginTop:"1%"
            }}activeOpacity={0.8} onPress={() => router.back()}>
            <Text style={{
              fontSize: 16,
              fontFamily: 'Montserrat-SemiBold',
              color: "#F05050",
              textAlign: 'center',
              textShadowColor: 'rgba(0, 0, 0, 0.30)',
              textShadowOffset: { width: 0, height: 0.1 }, 
              textShadowRadius: 4,
              }}>
            Go Back
            </Text>
            </TouchableOpacity>

              
      </View>


    );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  error: { color: "red" },
  label: { fontSize: 20,
    color:"#575757", 
    marginTop:"10%",
    fontFamily:"Montserrat-Regular",
    textShadowColor: 'rgba(0, 0, 0, 0.30)',
    textShadowOffset: { width: 0, height: 0.1 }, 
    textShadowRadius: 2 
  },
  cardContainer: { 
    flexDirection: "row",
    gap:"5%", 
    width: "100%", 
    height:"100%",
     },
  card: {  
    padding: "2%", 
    backgroundColor: "white", 
    borderWidth:1,
    borderColor:"#9C9C9C",
    borderRadius: 15, 
    alignItems: "center",
    justifyContent: "center",
    width:"25%",
    height:"95%",
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.5)",
    overflow:"hidden"
  },
  selectedCard: { backgroundColor: "#FE8080" , boxShadow:"0px 1px 1px rgba(0, 0, 0, 0.1)",borderColor:"#F05050"},
  cardText: { 
    fontSize:12,
    fontFamily:"Montserrat-Regular",
    color:"black",
    textAlign:"center",
  },
  icon:{
    width:36,
    height:36
  },
  labelpressed:{
    color:"#F05050"
  }
});

export default SignIn;
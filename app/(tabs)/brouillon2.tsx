"use client"
import { AddAdmin } from "@/services/auth";
import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const admin = () => {
  const [mail,setmail]=useState("");
  const [password,setpassword]=useState("");
  const [fullname,setfullname]=useState("");
  const [phone,setphone]=useState("");

const handlesubmit=async()=>{
  if(mail==="" || password==="" || fullname==="" || phone===""){
    console.log("vide")
    return;
  }
  const formData = new FormData();
  formData.append("Email", mail);
  formData.append("Password", password);
  formData.append("Fullname", fullname);
  formData.append("Phonenumber", phone);
console.log(formData)
  try{
    const response = await AddAdmin(formData);
    console.log("response",response);
  }
  catch(error){
    console.log("erreur",error);
  }
}


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Admin</Text>
      <TextInput 
        style={{borderColor: '#aaa',
    borderWidth: 1,
    width: '80%',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',}}
        value={mail}
        onChangeText={setmail}
        />
      <TextInput
    style={{borderColor: '#aaa',
    borderWidth: 1,
    width: '80%',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',}}
        value={password}
        onChangeText={setpassword}
      />
      <TextInput
        style={{borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    width: '80%',
    padding: 10,
    backgroundColor: '#fff',}}
        value={fullname}
        onChangeText={setfullname}
      />
      <TextInput
style={{borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    width: '80%',
    padding: 10,
    backgroundColor: '#fff',}}
        value={phone}
        onChangeText={setphone}
      />

      <TouchableOpacity onPress={handlesubmit} style={{width:"50%",height:"20%",margin:"10%"}}>
        <Text style={{backgroundColor:"#F05050"}}>Submit</Text>
      </TouchableOpacity>

    </View>
  );
};
export default admin;

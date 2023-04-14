import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard, Platform} from 'react-native';
import { collection, doc,setDoc,addDoc, getFirestore} from "firebase/firestore"; 
import { db,authentication } from '../firebaseConfig';
import {Picker} from '@react-native-picker/picker';
import {createUserWithEmailAndPassword,getAuth } from 'firebase/auth';
import firestore  from '@react-native-firebase/firestore';


const roles =['','Citizen', 'Police'];

const RegistrationForm = () => {
  const [isSignedIn,setIsSignedIn]=useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]=useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError]= useState('');
  const [passwordError, setPasswordError]= useState('');
  const [roleError, setRoleError]= useState('');
  const [nameError, setNameError]= useState('');

 
  const handleSubmit = async () => {
    if (name.length ===0){
      setNameError('Name is required');
    }
    else if (!email.includes('@')){
      setEmailError('Invalid Email');
    }
    
    else if (password.length <6){
      setPasswordError('Password must be at least 6 characters');
    }
    else if (email.indexOf(' ')> 0){
      setPasswordError('Password cannot contain spaces')
    }
    else if (email.length ===0){
      setEmailError('Email is required')
    }
    else if (email.indexOf(' ')> 0){
      setEmailError('Email cannot contain spaces')
    }
    else if(password!==confirmPassword){
      setPasswordError('Password does not match')
    }
    else if (!role){
      setRoleError('Role is empty')
    }
    else{
      setNameError('');
      setPasswordError('');
      setEmailError('');
      setRoleError('');
      
    }
  

  try{
    const authentication = getAuth();
    const userCredentials= await createUserWithEmailAndPassword(authentication,email,password);
    const user =userCredentials.user;

    const db =getFirestore();
    const usersCollection = collection(db,'User');
    const userDoc = doc(usersCollection,user.uid)
    await setDoc(userDoc, {
      email,
      name,
      password,
      confirmPassword,
      role,
    });
    console.log("User registered with ID:");
  }catch(error){
    console.error('Error adding user:',error);
  }
  };
  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios'? 'padding':'null'} className="flex-1">
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View className="flex-1 justify-center bg-white">
    <Image
        className="w-72 h-32 mb-3 items-center justify-center mx-auto"
        source={require('./images/alertado.jpg')}
      
      />
    <Text className="text-4xl flex align-left justify-start ml-5 mb-5 font-bold">Register</Text>  
      <Text className="ml-5 mb-2 text-sm">Name</Text>
      <TextInput
          className="w-11/12 px-4 py-3 rounded-lg bg-gray-100 mx-auto mb-2"
          placeholder="Enter your Name"
          value={name}
          onChangeText={(name)=>{setName(name)}}
        />
        <Text className="mx-auto color-red-500">{nameError} </Text>
        <Text className="ml-5 mb-2 text-sm">Email</Text>
        <TextInput
        className="w-11/12 px-4 py-3 rounded-lg bg-gray-100 mx-auto mb-2"
          placeholder="Enter your Email"
          value={email}
          onChangeText={(email)=>{setEmail(email)}}
          
        />
        <Text className="mx-auto color-red-500">{emailError} </Text>
        <Text className="ml-5 mb-2 text-sm">Select a role</Text>
        <View className="justify-center w-11/12 h-12 py-3 rounded-lg bg-gray-100 mx-auto mb-2">
        
        <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        {roles.map((role)=>(
          <Picker.Item key={role} label={role} value={role}/>
        ))}
      </Picker>
      </View>
      <Text className="mx-auto color-red-500">{roleError} </Text>
        <Text className="ml-5 mb-2 text-sm">Password</Text>
        <TextInput
        className="w-11/12 px-4 py-3 rounded-lg bg-gray-100 mx-auto mb-2"
          placeholder="Enter your Password"
          value={password}
          onChangeText={(password)=>{setPassword(password)}}
          secureTextEntry={true}
        />
        <Text className="mx-auto color-red-500">{passwordError} </Text>
        <Text className="ml-5 mb-2 text-sm">Confirm Password</Text>
        <TextInput
        className="w-11/12 px-4 py-3 rounded-lg bg-gray-100 mx-auto mb-2"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={(confirmPassword)=>{setConfirmPassword(confirmPassword)}}
          secureTextEntry={true}
        />
        <TouchableOpacity
          className="w-11/12 mt-4 px-4 py-3 rounded-lg bg-red-700 items-center mx-auto"
          onPress={handleSubmit}
        >
          <Text className="text-white text-lg font-medium mx-auto">Register</Text>
        </TouchableOpacity>
      
     
      
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegistrationForm;

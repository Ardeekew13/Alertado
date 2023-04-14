import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard, Platform, Button} from 'react-native';
import { collection,query,where,doc, getDoc} from 'firebase/firestore';
import {signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { db,authentication } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/core';
import RegistrationForm from './RegistrationForm';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [role, setRole]=useState('');
  const[isSignedIn,setIsSignedIn]=useState(false);
  const navigation=useNavigation()
const handleLogin = async () => {
  try{
      const userCredential = await signInWithEmailAndPassword(authentication, email, password);
      const userId = userCredential.user.uid;

      const usersRef = collection(db,'User');
      const userDoc = await getDoc(doc(usersRef,userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
      const userRole = userDoc.data().role;
        if (userRole === "Citizen") {
          navigation.navigate('HomePage');
        } else if (userRole === 'Police') {
          navigation.navigate('SubPage');
        } else {
          setError('User not found');
        }
        
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('User not found');
      } else {
        setError('Incorrect email or password');
      }
      console.error(error);
    }
  };
const handleRegister = () => {
  navigation.navigate('RegistrationForm');
};

  const validateInputs = () => {
    // Check that email is valid
    const emailRegex = /^\S+@\S+\.\S+$/;
    const isEmailValid = emailRegex.test(email);
    if (!isEmailValid) {
      setError('Invalid email format');
    } else {
      setError(null);
    }
  };
  return (
    <KeyboardAvoidingView behavio={Platform.OS==='ios'? 'padding':'null'} className="flex-1">
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View className="flex-1 justify-center bg-white">
    <Image
        className="w-72 h-32 mb-3 items-center justify-center mx-auto"
        source={require('./images/alertado.jpg')}
      />
    <Text className="text-4xl flex align-left justify-start ml-5 mb-5 font-bold">Login</Text>  
        <Text className="ml-5 mb-2 text-sm">Email</Text>
        <TextInput
        className="w-11/12 px-4 py-3 rounded-lg bg-gray-100 mx-auto mb-2"
          placeholder="Enter your Email"
          onChangeText={(email)=>{setEmail(email)}}
          onBlur={validateInputs}
        />
        <Text className="ml-5 mb-2 text-sm">Password</Text>
        <TextInput
        className="w-11/12 px-4 py-3 rounded-lg bg-gray-100 mx-auto mb-2"
          placeholder="Enter your Password"
          onChangeText={(password)=>{setPassword(password)}}
          secureTextEntry={true}
          onBlur={validateInputs}
        />
        {error? <Text className="color-red-500 mx-auto mb-5 mt-2">{error}</Text>:null}
        <TouchableOpacity
          className="w-11/12 mt-4 px-4 py-3 rounded-lg bg-red-700 items-center mx-auto"
          onPress={handleLogin}
        >
          <Text className="text-white text-lg font-medium mx-auto">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRegister}>
        <Text className="items-center justify-center mx-auto mt-5 text-xl">Don't have an account?<Text className="text-[#0000FF]"> Register</Text></Text>
      </TouchableOpacity>
      
     
      
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default LoginForm;
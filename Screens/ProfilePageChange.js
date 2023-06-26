import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, TouchableOpacity,TextInput, Alert, Modal, ScrollView} from 'react-native';
import { collection, doc, onSnapshot, getFirestore,updateDoc } from '@firebase/firestore';
import { getAuth, signOut, onAuthStateChanged  } from '@firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/core';
import *  as ImagePicker from 'expo-image-picker';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { ref,getDownloadURL, uploadBytes,storageRef,getStorage ,uploadStrings} from 'firebase/storage';
import firebaseConfig from '../firebaseConfig';
import { AntDesign, Ionicons, FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons'; 
import { BlurView } from '@react-native-community/blur';


const storage = getStorage(firebaseConfig);
const auth = getAuth();
let currentUser = null;
onAuthStateChanged(auth, (user) => {
  currentUser = user;
});
const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [newFName, setNewFName] = useState('');
  const [newLName, setNewLName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [image, setImage] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [uploading,setUploading]=useState(false);
  const navigation=useNavigation()

  useEffect(() => {
    const currentUser = getAuth().currentUser;
    const db = getFirestore();
    const userRef = doc(db, 'User', currentUser.uid);

    const unsubscribe = onSnapshot(userRef, (doc) => {
      const data = doc.data();
      setUserData(data);
    });

    return unsubscribe;
  }, []);

  if (!userData) {
    return <Text>Loading...</Text>;
  }
  
  // Check if the user has a profile picture URL
  const hasProfilePicture = userData.profilePictureURL !== undefined && userData.profilePictureURL !== null;
  
  // If the user has a profile picture URL, display it; otherwise, display the default image
  const profilePicture = hasProfilePicture ? { uri: userData.profilePictureURL } : require('./images/user.jpg');
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4,3],
        quality: 1
    });
    const source = {uri: result.assets[0].uri}
    console.log(source)
    setImage(source)
}; 
const nameChange = async () => {
  try {
    const currentUser = getAuth().currentUser;
    const db = getFirestore();
    const userRef = doc(db, 'User', currentUser.uid);
    await updateDoc(userRef, { 
      name: newName, 
      status: "Pending",
    });
    setIsNameModalOpen(false);
  } catch (error) {
    console.error('Error updating name:', error);
  }
};
const phoneChange = async () => {
  try {
    const currentUser = getAuth().currentUser;
    const db = getFirestore();
    const userRef = doc(db, 'User', currentUser.uid);
    await updateDoc(userRef, { 
      phone: newPhone, 
      status: "Pending",
    });
    setIsPhoneModalOpen(false);
  } catch (error) {
    console.error('Error updating name:', error);
  }
}
  const emailChange = async () => {
    try {
      const currentUser = getAuth().currentUser;
      const db = getFirestore();
      const userRef = doc(db, 'User', currentUser.uid);
      await updateDoc(userRef, { 
        email: newEmail, 
        status: "Pending",
      });
      setIsEmailModalOpen(false);
    } catch (error) {
      console.error('Error updating name:', error);
    }
};
const addressChange = async () => {
  try {
    const currentUser = getAuth().currentUser;
    const db = getFirestore();
    const userRef = doc(db, 'User', currentUser.uid);
    await updateDoc(userRef, { 
      email: newEmail, 
      status: "Pending",
    });
    setIsAddressModalOpen(false);
  } catch (error) {
    console.error('Error updating name:', error);
  }
};
const passwordChange = async () => {
  try {
    const currentUser = getAuth().currentUser;
    const db = getFirestore();
    const userRef = doc(db, 'User', currentUser.uid);
    await updateDoc(userRef, { 
      email: newEmail, 
      status: "Pending",
    });
    setIsAddressModalOpen(false);
  } catch (error) {
    console.error('Error updating name:', error);
  }
};
const uploadImage = async () => {
  setUploading(true);
  const currentUser = getAuth().currentUser;
  const db = getFirestore();
  const response = await fetch(image.uri);
  const blob = await response.blob();
  const filename = currentUser.uid;
  const storageRef = ref(storage, 'profilePictures/${filename}id');

  
  try {
    await uploadBytes(storageRef, blob);
    Alert.alert('Photo uploaded!');

  } catch (e) {
    console.log(e);
  }
  
  setUploading(false);

  setImage(null);
}
const Signout =()=>{
const auth = getAuth();
signOut(auth).then(() => {
  navigation.navigate('LoginForm');
}).catch((error) => {
  // An error happened.
});
}
const handleVerify = () => {
  navigation.navigate('Citizen Verification');
};


/*<TouchableOpacity  className="w-11/12 mt-4 px-4 py-3 rounded-lg bg-red-700 items-center mx-auto" onPress={pickImage}>
<Text>Pick Image</Text>
</TouchableOpacity>*/ //Pick image

/*   <TouchableOpacity  className="w-11/12 mt-4 px-4 py-3 rounded-lg bg-red-700 items-center mx-auto" onPress={uploadImage}>
        <Text>Upload Image</Text>
      </TouchableOpacity>*/ //upload
return (
  <ScrollView className={`bg-white ${isNameModalOpen || isPhoneModalOpen || isAddressModalOpen || isPasswordModalOpen ||isEmailModalOpen  ? "opacity-30" : "opacity-100"} `}>
  <SafeAreaView> 
      
      <Text className="mx-auto font-bold text-xl mb-4 ">Personal Information</Text>
      <View className="mx-auto mb-2 ">
      <View className="flex-row">
      <View className="justify-center mr-2">
      <FontAwesome name="user" size={32} color="black" />
      </View>
      <View className="flex-col">
      <Text className=" text-sm text-stone-500">First Name</Text>
      <TextInput className=" text-lg " value={newFName || userData.Fname} onChangeText={setNewFName} editable={true}/>
      <View className="border-0.5 w-56 justify-center mx-auto"></View>
</View>
</View>
</View>
<View className="mx-auto mt-5 mb-2 ">
<View className="flex-row">
<View className="justify-center mr-2">
<Entypo name="user" size={30} color="black" />
</View>
<View className="flex-col">
<Text className=" text-sm text-stone-500">Last Name</Text>
<TextInput className=" text-lg " value={newLName || userData.Lname} onChangeText={setNewLName} editable={true}/>
<View className="border-0.5 w-56 justify-center mx-auto"></View>

</View>
</View>
</View>
      
      <View className="mx-auto mt-5 mb-2 ">
      <View className="flex-row">
      <View className="justify-center mr-2">
      <MaterialIcons name="email" size={30} color="black" />
      </View>
      <View className="flex-col">
      <Text className=" text-sm text-stone-500">Email</Text>
      <TextInput className=" text-lg " value={newEmail || userData.email} onChangeText={setNewEmail} editable={true}/>
      <View className="border-0.5 w-56 justify-center mx-auto"></View>

      </View>
      </View>
      </View>
      <View className="mx-auto mt-5 mb-2 ">
      <View className="flex-row">
      <View className="justify-center mr-2">
      <FontAwesome name="phone" size={30} color="black" />
      </View>
      <View className="flex-col justify-center">
      <Text className=" text-sm text-stone-500">Phone Number</Text>
      <Text className=" text-lg">{userData.phone}</Text>
    <View className="border-0.5 w-56 justify-center mx-auto"></View>

      </View>
      </View>
      </View>
      <View className="mx-auto mt-5">
      <View className="flex-row">
      <View className="justify-center mr-2 flex-col">
      <Ionicons name="location-sharp" size={30} color="black" />
      </View>
      <View className="flex-col justify-center">
      <Text className=" text-sm text-stone-500">Barangay</Text>
      <Text className=" text-lg ">{userData.address}</Text>
    <View className="border-0.5 w-56 justify-center mx-auto"></View>

      </View>
      </View>
      </View> 

  </SafeAreaView> 
  </ScrollView>
);
}
export default Profile;
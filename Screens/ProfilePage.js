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
import { AntDesign, Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons'; 
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
  const [newName, setNewName] = useState('');
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
    
    if (newPassword === newConfirmPassword) {
      await updateDoc(userRef, { 
        password: newPassword, 
      });
      setIsAddressModalOpen(false);
    } else {
      console.error('New password and new confirm password do not match');
      // Handle the error or display an error message to the user
    }
  } catch (error) {
    console.error('Error updating password', error);
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
const handleEdit = () => {
  navigation.navigate('Profile PageChange');
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
    <View className="flex">
    <View className="flex flex-row">
  
    <Ionicons name="chevron-back" size={27} color="black" />

    <Text className="font-semibold text-l justify-center items-center text-center mx-auto mb-4">My Profile</Text>
    <View className="mr-3">
    <TouchableOpacity onPress={handleEdit}>
    <AntDesign name="edit" size={27} color="black" />
    </TouchableOpacity>
    </View>
    </View>
    <View className="flex flex-row">
      
      {image && <Image className="flex mx-auto mt-5 rounded-full" source={{ uri: image.uri }} style={{ width: 80, height: 80 }} />}
      {!image && userData.profilePicUrl && <Image className="flex  mt-5 rounded-full" source={{ uri: userData.profilePicUrl }} style={{ width: 80, height: 80}} />}
      {!image && !userData.profilePicUrl && <Image className="flex justify-left ml-8 mt-5 rounded-full" source={{ uri: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }} style={{ width: 80, height: 80 }} />}
      
      <View className="flex ml-4 mt-4 mb-4">
        <Text className=" text-2xl font-semibold">{userData.Lname}, {userData.Fname}</Text>
        <Text className=" text-lg  text-red-500">{userData.status}</Text>
        <TouchableOpacity onPress={handleVerify}>
        <Text className=" text-sm font-semibold mt-2">Verify your Account</Text>
        </TouchableOpacity>
        </View>
      
      </View>
      
      <Text className="mx-auto font-bold text-xl mb-4 ">Personal Information</Text>
      <View className="mx-auto mb-2 ">
      <View className="flex-row">
      <View className="justify-center mr-2">
      <MaterialIcons name="email" size={30} color="black" />
      </View>
      <View className="flex-col">
      <Text className=" text-sm text-stone-500">Email</Text>
      <Text className=" text-lg ">{userData.email}</Text>
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
     
      <View className="flex justify- mx-auto mt-10 justify-center py-auto ">

          <TouchableOpacity className="bg-[#D01010] w-52 h-10 justify-center rounded-md mb-2"  onPress={() => setIsPasswordModalOpen(true)}>
          <Text className="mx-auto text-base font-semibold">Change Password</Text>
        </TouchableOpacity>
        <View className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center mx-auto ">
            <Modal 
            visible={isPasswordModalOpen}
            transparent={true}
            animationType='slide'>
            <View className="flex items-center justify-center my-auto w-96 ">
            <View className="bg-white rounded-lg p-4">
               <Text className="text-xl font-semibold mb-4">Enter your new Password</Text>
               <TextInput className="border-gray-300 border-solid border-2 p-2 rounded-md mb-4" placeholder='Enter your new password' value={newPassword} onChangeText={setNewPassword}/>
               <TextInput className="border-gray-300 border-solid border-2 p-2 rounded-md mb-4" placeholder='Confirm password' value={newConfirmPassword} onChangeText={setNewConfirmPassword}/>
                <TouchableOpacity className="bg-[#D01010] text-white py-2 px-4 rounded-md mx-2 mb-2" onPress={passwordChange}>
                 <Text className="font-semibold ">Save</Text>
                   </TouchableOpacity>
                       <TouchableOpacity className="bg-gray-500 text-white py-2 px-4 rounded-md mx-2" onPress={() => setIsPasswordModalOpen(false)}>
                            <Text className="font-semibold">Cancel</Text>
                              </TouchableOpacity>
                              </View>
                        </View>
                  </Modal>
                  </View>
        <TouchableOpacity className="bg-[#D01010] w-52 h-10 justify-center rounded-md mb-2" onPress={Signout}>
        <Text className="mx-auto text-base font-semibold">Sign Out</Text>
        </TouchableOpacity>
        </View>
    </View>
  </SafeAreaView> 
  </ScrollView>
);
}
export default Profile;
import React, { Component, useEffect, useState } from 'react';
import PrincipalPage from'./Screens/PrincipalPage';
import { View,Text,Image,Dimensions, SafeAreaView,TouchableOpacity,AsyncStorage, } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AnimatedSplash from "react-native-animated-splash-screen";


//       <PrincipalPage/>
const {width,height}=Dimensions.get("screen");
const Done=({...props})=>{return <TouchableOpacity {...props}><AntDesign name="check" size={30} style={{width:50,alignItems:'center'}} /></TouchableOpacity>}
const Next=({...props})=>{return <TouchableOpacity {...props}><AntDesign name="arrowright" size={30} style={{width:50,alignItems:'center'}} /></TouchableOpacity>}
const Skip=({...props})=>{return <TouchableOpacity {...props} style={{width:50,alignItems:'center'}} ><Text style={{fontSize:16}}>تخطي</Text></TouchableOpacity>}


 const  App=()=> {
  const [Donev,SetDonev]=useState(true);
  const [SkipPage,SetSkipPage]=useState(null);

  const _storeData = async () => {
        
    try {
      await AsyncStorage.setItem(
        "Done",
        "true"
      );
    } catch (error) {
      // Error saving data
    }
  };
  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('Done');
      if (value != null) {
        SetSkipPage(true);
      }
      else{
        SetSkipPage(false);
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  useEffect(()=>{_retrieveData()})
      if(SkipPage===null) return null;
      else if(SkipPage===true) return <PrincipalPage/>
            else return(
              <>
        {Donev ?
          <Onboarding 
          onSkip={()=>{SetDonev(false);_storeData();}}
          onDone={()=>{SetDonev(false);_storeData();}}
          DoneButtonComponent={Done}
          NextButtonComponent={Next}
          SkipButtonComponent={Skip} 
            pages={[
              {
                backgroundColor: '#407bff99',
                image: <Image source={require('./Screens/Image/img1.png')} style={{width:width*.8,height:width*.8,borderRadius:10,}}/>,
                title: 'مرحبا بك', 
                subtitle: 'هذا التطبيق موجه لإخوتنا الذين يعانون من مشاكل في التكلم  كل ما عليك فعله هو الظغط على الصور لتكوين الجمل التي سيتم قرائتها بواسطة التطبيق ',
              },
              {
                backgroundColor: '#d090fec4',
                image: <Image source={require('./Screens/Image/img2.png')} style={{width:width*.8,height:width*.8,borderRadius:10,}}/>,
                title: '',
                subtitle: 'يمكنك إضافة جمل و كلمات للتطبيق وربطها بصور خاصة بك لتسهيل عملية الحوار و المحادثة',
              },]} 
         />: <PrincipalPage/>
        }

      </>
            )
       
      }
const YourApp =()=>{
  const[isLoaded,SetisLoaded]=useState(false)
 
 setTimeout( ()=>{SetisLoaded(true)},3200)
   return (
      <AnimatedSplash
        isLoaded={isLoaded}
        logoImage={require("./Screens/Image/logo.png")}
        backgroundColor={"#fff"}
        logoHeight={200}
        logoWidth={200}
      >
        <App/>
      </AnimatedSplash>
    )
  
}

export default YourApp;
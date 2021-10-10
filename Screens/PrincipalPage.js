import React, { Component } from 'react';
import { View,Text,StyleSheet, Dimensions,BackHandler,Image,TouchableOpacity,Animated,SafeAreaView,ScrollView,AsyncStorage,ActivityIndicator,Alert  } from 'react-native';
import {Ar} from './Info';
import image from './Image';
import Tts from 'react-native-tts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Feather';
import { TextInput } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';


const {width,height}=Dimensions.get("screen");
const ATouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const ASafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

class PrincipalPage extends Component{

    constructor(){
        super();
        this.state={speak:[],arr:[],display:'flex',display2:'none',Category:"",List:[],Arim:Ar,addView:false,save:null,image:null,title:null,onload:false,displayadd:"none",bottombar:new Animated.Value(0),addinlist2:null,uplodView:new Animated.Value(-400)}

        Tts.getInitStatus().then(() => {
            Tts.voices().then(voices => {
                for(let i in voices){
              //  if(voices[i]["language"]=="ar" || voices[i]["language"].includes("ar-") ) console.log(voices[i]["id"])
            }
        });
            Tts.setDefaultLanguage('ar');
            //Tts.setDefaultVoice("ar-xa-x-are-local").catch((Error e)=>{ alert(e) });
        }).catch(()=>{ });
    }
    backAction=()=>{
        if(this.state.uplodView._value>-400){
            Animated.spring(this.state.uplodView,{toValue:-400,}).start();
            return true;
        }
        if(this.state.displayadd=='flex'){
            this.setState({displayadd:'none'});
            this.textInput.clear();
            this.setState({title:null});
            this.setState({image:null});
            Animated.spring(this.state.bottombar,{toValue:0,}).start();
            return true;
        }
        if(this.state.display=='none'){
            this.setState({display:'flex'});
            return true;
        }

    }
    _storeData = async (a,b) => {
        
        let js={a:{'image':b,data:{}}};
        try {
          await AsyncStorage.setItem(
            "SaveData",
            JSON.stringify(js)
          );
        } catch (error) {
          // Error saving data
        }
      };
      resotreData= async(a)=>{
        try {
            await AsyncStorage.setItem(
              "SaveData",
              JSON.stringify(a)
            );
          } catch (error) {
            // Error saving data
          }
      }
      _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('SaveData');
          console.log(value);
          if (value != null) {
           this.setState({save:JSON.parse(value)});
          }
          else{
            this.setState({save:null});
          }
        } catch (error) {
          // Error retrieving data
        }
      };
      componentDidMount(){
        this._retrieveData();
        this.backHandler=BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
          );
       
      }
      componentWillUnmount() {
        this.backHandler.remove();
    }
    TopList(a){
        let arr=this.state.arr;
        console.log(arr);
        if(arr!=null){
            let a=arr.map((m,i)=>
            <View key={i} style={{alignSelf:'center'}}>
                <Image source={m} style={Style.ImageListTop}/>
            </View>
            );
        return a;
        }
        return null;
    }
    Onpress1(m,l){
        this.setState({display:'none'});
        this.setState({Category:m});
        this.setState({List:l});
    }
    Onpress1v2(m,l){
        this.setState({display:'none'});
        this.setState({Category:m});
        this.setState({List:l});
        this.setState({addinlist2:true});
    }
    Onpress2(m,t){ 
        let a=this.state.arr;
        let s=this.state.speak;
        s.push(t);
        a.push(m);
        this.setState({arr:a});
        this.setState({speak:s});

    }
    Speak(){
        Tts.stop()
        let a="";
        let arr=this.state.speak;
        if(arr==null) return null; 
        for(let i in arr) a+=arr[i]+" ";
        Tts.speak(a);
    }
    delete(){ 
        let a=this.state.arr;
        let s=this.state.speak;
        a.pop();
        s.pop();        
        this.setState({arr:a});
        this.setState({speak:s});
    }
    deleteAll(){ 
        this.setState({arr:[]});
        this.setState({speak:[]});
    }
    List=Object.entries(Ar).map((m)=>
        <ATouchableOpacity key={m[0]} style={Style.containerList} activeOpacity={0.8}
        onPress={()=>{this.Onpress1(m[0],m[1])}}>
            <Image source={image[m[0]]} style={Style.ImageList}/>
            <Text style={Style.TextList}> {m[0]}</Text>
        </ATouchableOpacity>     
    );

ListSp(){
    let x=this.state.addinlist2;
    let Li=this.state.List;
    let a=null;
    let b=null;
    if(Li!=null && x==null) {
         a=Li.map((m,i)=>
        <ATouchableOpacity key={i} style={Style.containerList} activeOpacity={0.8}
        onPress={()=>{this.Onpress2(image[m],m);}}>
            <Image source={image[m]} style={Style.ImageList}/>
            <Text style={Style.TextList}> {m}</Text>
        </ATouchableOpacity>     
        );
    } 
    if(x==true){
        a=Li.map((m,i)=>
        <ATouchableOpacity key={i} style={Style.containerList} activeOpacity={0.8}
        onPress={()=>{this.Onpress2({uri:m[1]},m[0]);}}>
            <Image source={{uri:m[1]}} style={Style.ImageList}/>
            <Text style={Style.TextList}> {m[0]}</Text>
        </ATouchableOpacity>     
        );
    }
        
        b=<ATouchableOpacity  style={[Style.containerList,{alignItems:'center'}]} activeOpacity={0.8}
        onPress={()=>{this.insave(-90)}}>
            <View style={[Style.ImageList,{justifyContent:'center'}]}>
              <AntDesign name="plus" size={(width/7<100)?width/7:70} color="#666dff" style={{alignSelf:'center'}}/>
            </View>
        </ATouchableOpacity>
        
    if(x!=null) return <>{a}{b}</>;
            else return a;
}
Onsave(){
    this._retrieveData();
    let x=this.state.addinlist2;
    let img=this.state.image;
    let jso;
    if(x===null)jso=this.state.save;
    else jso=this.state.List;
    let jsl;
    if(jso==null) jsl=true;
    else if(title in jso) jsl=false;
        else jsl=true;
    let title=this.state.title;
    let cat=this.state.Category;
    console.log(jso);

    if(img!=null){
        if(title!=null){
                    if(jso===null) {
                    this.setState({onload:true})
                    this._storeData(title,img).then(()=>
                       {this.setState({onload:false});
                       this.setState({title:null});
                       this.setState({image:null});
                       this.insave(0);
                       this.textInput.clear();
                    }).catch(()=>{this.setState({onload:false});alert('error')})

                    }
                else{ 

                   if(x==null ){ 
                    if(!(title in jso)){
                        this.setState({onload:true})
                        jso[title]={'image':img,'data':{}}
                        this.setState({title:null});
                        this.resotreData(jso).then(()=>{this.setState({onload:false});
                        this.insave(0);
                        this.textInput.clear();
                        this.setState({image:null});
                         }).catch(()=>{this.setState({onload:false});alert('error')})
                        }
                        else alert('المرجو تغيير العنوان') 
                    }
                if(x===true){
                    let x=false;
                    for(let i in jso ) if(jso[i][0]===title){x=true;break;}

                   if(!x){ 
                    this.setState({onload:true});
                    let a=this.state.save;
                    a[cat]['data'][title]=img;
                    this.setState({title:null});
                    jso=a[cat]['data'];
                    this.resotreData(a).then(()=>{this.setState({onload:false}); 
                    this.insave(0); 
                    this.setState({image:null});
                    this.textInput.clear();
                    this.setState({List:Object.entries(jso)});
                }).catch(()=>{this.setState({onload:false})})}
                else alert('المرجو تغيير العنوان') ;
                }  
            
                }
                this._retrieveData();  
           
        }  
        else alert("المرجو إختيار عنوان مناسب");

    }
   else alert('المرجوا إختيار صورة');
}
insave(a){ 
    if(a==-90){
        Animated.timing(this.state.bottombar,{
            toValue:-90,
            duration:1
        }).start();
        this.setState({displayadd:'flex'});
    }
    else{
        this.setState({displayadd:'none'});
        Animated.spring(this.state.bottombar,{
            toValue:0,
        }).start();
    }
}
ListsaveData(){
    let svd=this.state.save;
    if(svd==null) return null;
    else {
       let List=Object.entries(svd).map((m)=>
        <ATouchableOpacity key={m[0]} style={Style.containerList} activeOpacity={0.8}
        onPress={()=>{this.Onpress1v2(m[0],Object.entries(m[1]['data']))}}>
            <Image source={{uri:m[1]['image']}} style={Style.ImageList}/>
            <Text style={Style.TextList}> {m[0]}</Text>
        </ATouchableOpacity>     
    );
    return List;
    }
}

    render(){
        return(
            <SafeAreaView style={{flex:1}}>
                <View style={[Style.container1,{alignItems:'center',paddingTop:80,display:this.state.displayadd}]}>
                <View style={{width:width,height:40,backgroundColor:'#666dff',justifyContent:'center',marginBottom:10,marginTop:0,position:'absolute',top:0,}}>
                                <TouchableOpacity style={{alignSelf:'center',position:'absolute',left:2}} onPress={()=>{this.setState({displayadd:"none"});this.textInput.clear();this.setState({title:null});this.setState({image:null});}}>
                                    <AntDesign name="arrowleft" size={32} color="#fff" />
                                </TouchableOpacity>
                                <Text style={{fontSize:20,alignSelf:'center',justifyContent:'center',color:'#fff',alignItems:'center',fontWeight:'700'}}>{
                                (this.state.display==='none')? 
                                    "إضافة عنصر جديد"
                                :
                                    "إضافة مجموعة جديدة"
                                }</Text>
                </View>
                    <View>
                        <ATouchableOpacity  style={[Style.containerList,{alignItems:'center',}]} activeOpacity={0.8}
                                    onPress={()=>{
                                        Animated.spring(this.state.uplodView,{
                                            toValue:0,
                                        }).start();
                                    }}>
                                        <View style={[Style.ImageList,{justifyContent:'center',alignItems:'center',}]}>
                                          {(this.state.image==null)?
                                          <AntDesign name="plus" size={(width/7<100)?width/7:70} color="#666dff" style={{alignSelf:'center'}}/>
                                          :
                                          <Image source={{uri:this.state.image}} style={Style.ImageList}/>

                                          }
                                        </View>
                            </ATouchableOpacity>  
                    </View>
                    <TextInput
                     style={{width:width*.90,borderColor:'black',height:50,borderColor:'#666dff',borderWidth:0.8,borderRadius:5,padding:5,marginBottom:40,marginTop:40}} 
                      placeholder='   وصف الصورة  ' onChangeText={(text)=>{this.setState({title:text})}} 
                      ref={input => { this.textInput = input }}
                      >

                    </TextInput>
                    <TouchableOpacity onPress={()=>{this.Onsave()}} style={{padding:10,backgroundColor:'#666dff',paddingLeft:20,paddingRight:20,marginTop:50}} activeOpacity={0.8}>
                        <Text style={{fontSize:18,fontWeight:'700',color:'white'}}>
                        حفظ
                        </Text>
                    </TouchableOpacity>
                    <Animated.View style={[Style.uploadView,{bottom:this.state.uplodView}]}>
                        <Text style={{marginTop:15,marginBottom:10,fontSize:22,fontWeight:'700',color:'black',alignSelf:'center'}}>تحميل صورة</Text>
                    <TouchableOpacity 
                    onPress={()=>{
                        ImagePicker.openCamera({
                            width: 300,
                            height: 400,
                            cropping: true,
                          }).then(image => {
                           this.setState({image:image.path});
                           Animated.spring(this.state.uplodView,{
                            toValue:-400,
                        }).start();
                          });
                    }}
                    style={Style.uplodTouch} activeOpacity={0.8}>
                        <Text style={{fontSize:18,fontWeight:'700',color:'white',}}>
                        إستخدام الكاميرا
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>{
                        ImagePicker.openPicker({
                            width: 300,
                            height: 400,
                            cropping: true,
                          }).then(image => {
                           this.setState({image:image.path});
                           Animated.spring(this.state.uplodView,{
                            toValue:-400,
                        }).start();
                          });
                    }}
                    style={Style.uplodTouch} activeOpacity={0.8}>
                        <Text style={{fontSize:18,fontWeight:'700',color:'white',}}>
                        إستخدام صورك
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>{
                        Animated.spring(this.state.uplodView,{
                            toValue:-400,
                        }).start();
                    }}
                    style={Style.uplodTouch} activeOpacity={0.8}>
                        <Text style={{fontSize:18,fontWeight:'700',color:'white',}}>
                        إلغاء
                         </Text>
                    </TouchableOpacity>
                    </Animated.View>
                                       
                    {/*onload*/}
                    <View style={this.state.onload ? this.state.onload:{display:'none'}}>
                    <ActivityIndicator size={60} color="#02088e" style={{width:100,height:100,alignSelf:'center'}}/> 
                    </View>
                </View>


                <View style={Style.container1}>
                    {/*Top List*/}
                <View style={{width:width,height:'18%',marginBottom:0.5,}}>
                    <ScrollView showsHorizontalScrollIndicator={false} style={{width:width,alignSelf:'center',borderBottomWidth:.9,borderColor:'#666dff',paddingTop:5,}}
                    horizontal={true} ref={(scroller) => {this.scroller = scroller}}>
                        <View style={{minWidth:width,flexDirection: 'row-reverse',}}>
                            {this.TopList()}
                        </View>
                    </ScrollView>
                </View>
                    {/*List 1*/}
                <View style={{width:width,alignContent:'center',}}>
                            <ScrollView style={{width:width,height:"78%",display:this.state.display,marginTop:15}}>
                                <View style={Style.containerImageList}> 
                                    {this.List} 
                                    {this.ListsaveData()} 
                                    <ATouchableOpacity  style={[Style.containerList,{alignItems:'center'}]} activeOpacity={0.8}
                                    onPress={()=>{this.insave(-90)}}>
                                        <View style={[Style.ImageList,{justifyContent:'center'}]}>
                                          <AntDesign name="plus" size={(width/7<100)?width/7:70} color="#666dff" style={{alignSelf:'center'}}/>
                                        </View>
                                    </ATouchableOpacity>                   
                                </View>
                            </ScrollView>
                </View>
                <View>
                    {/*List 2*/}
                    <View style={{width:width,height:"82%",}}>
                    
                    <ScrollView style={{width:width,height:"82%",}}>
                            <View style={[Style.containerImageList,{marginTop:55}]}>   
                                {this.ListSp()}
                            </View>
                    </ScrollView>
                    <View style={{width:width,height:40,backgroundColor:'#666dff',justifyContent:'center',marginBottom:10,marginTop:0,position:'absolute',top:0,}}>
                                <TouchableOpacity style={{alignSelf:'center',position:'absolute',left:2}} onPress={()=>{this.setState({addinlist2:null});this.setState({display:'flex'});}}>
                                    <AntDesign name="arrowleft" size={32} color="#fff" />
                                </TouchableOpacity>
                                <Text style={{fontSize:20,alignSelf:'center',justifyContent:'center',color:'#fff',alignItems:'center',fontWeight:'700'}}>{this.state.Category}</Text>
                            </View>
                    </View>
                </View>
                
                </View>
                <Animated.View style={[Style.buttomList,{bottom:this.state.bottombar}]}>
                    <TouchableOpacity style={[Style.Icon1,{borderTopRightRadius:60,}]} activeOpacity={.85} onPress={()=>{this.deleteAll()}}>
                        <Icon name="trash-2" size={30} color="#fff" style={{alignSelf:'center',}}/>
                    </TouchableOpacity>
                    <View style={{flex:1,alignSelf:'center',position:'relative',bottom:20,}}>
                        <TouchableOpacity style={Style.Icon2} activeOpacity={.85} onPress={()=>{this.Speak()}}>
                            <AntDesign name="caretright" size={45} color="#fff"style={{alignSelf:'center',}} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[Style.Icon1,{borderTopLeftRadius:60,}]}  activeOpacity={.85} onPress={()=>{this.delete()}}>
                        <Icon name="delete" size={30} color="#fff" style={{alignSelf:'center'}}/>
                    </TouchableOpacity>
                </Animated.View >
            </SafeAreaView>
        );
    }
}
export default PrincipalPage;

const Style= new StyleSheet.create({
    container1:{width:width,height:height,flexDirection: 'column'},
    containerList:{width:width/3.1,height:width/3.1+30,maxWidth:150,maxHeight:180,},
    ImageList:{width:width/3.5,height:width/3.5,maxWidth:130,maxHeight:130,borderRadius:15,borderWidth:.5,borderColor:"#666dff",margin:2},
    ImageListTop:{width:width/3.5,height:width/3.5,maxWidth:80,maxHeight:80,},
    TextList:{alignSelf:'center',fontSize:16,fontWeight:'700',color:'black',},
    Icon1:{width:'35%',height:50,justifyContent:'center',backgroundColor:'#666dff'},
    Icon2:{backgroundColor:'#666dff',width:95,height:68,justifyContent:'center',alignSelf:'center',borderRadius:70,zIndex:2},
    containerImageList:{width:width,flex: 1,flexDirection: 'row',flexWrap:'wrap',alignSelf:'center',paddingBottom:100,justifyContent:'center',},
    buttomList:{width:width,height:50,position:'absolute',backgroundColor:"#fff",flexDirection:'row',zIndex:1},
    onload:{width:width,height:height,backgroundColor:'#fff',opacity:0.7,position:'absolute',top:0,justifyContent:'center',},
    uplodTouch:{backgroundColor:'orange',justifyContent:'center',alignItems:'center',width:width-50,height:40,alignSelf:'center',marginTop:10,borderRadius:4,marginBottom:10,shadowOffset: {
        width: 6,
        height: 6,
    },
    shadowOpacity: 0.56,
    shadowRadius: 10,
    
    elevation: 2,},
    uploadView:{width:width,height:330,backgroundColor:'#fff',position:'absolute',borderRadius:40,shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 12,
    },
    shadowOpacity: 0.56,
    shadowRadius: 16,
    
    elevation: 26,}
}
); 
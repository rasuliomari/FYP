
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;

import { mapStyle } from '../components/global/mapStyle';
import { Colors, parameters } from '../components/global/styles';
import Constants from 'expo-constants';
const { buttons, grey, grey1, grey2, grey3, grey4, grey5, grey6, grey7, grey10, CardComment, cardbackground, statusbar, heaherText, lightgreen, blue, black, white, darkBlue, pagebackground } = Colors;
const statusBarHeight = Constants.statusBarHeight;

import { filterData, carsAround } from '../components/data';

const Welcome = ({ navigation }) => {

  // const { userData } = userDataHook();

  const [latlng, setLatlng] = useState({});

  const checkPermission = async () => {
    const hasPermission = await Location.requestForegroundPermissionsAsync();
    if (hasPermission.status !== 'granted') {
      const permission = await askPermission();
      return permission;
    }
    return true;
  };

  const askPermission = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    return permission.status === 'granted';
  };

  const getLocation = async () => {
    try {
      const { granted } = await Location.getForegroundPermissionsAsync();
      if (!granted) return;
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      setLatlng({ latitude, longitude });
    } catch (error) {
      console.log(error);
    }
  };

  const _map = useRef(1);

  useEffect(() => {
    checkPermission();
    getLocation();
    console.log(latlng);
  }, []);

  
  return (
    <>
      <View style={styles.container}>
        {/* <View style={styles.header}>
          <Icon
            type="material-community"
            name="menu"
            color={Colors.white}
            size={40}
            style={{ marginLeft: '2px' }}
            onPress={() => navigation.openDrawer()}
          />
        </View> */}
        <ScrollView bounces={false}>
          <View style={styles.home}>
            <Text style={styles.text1}>WELCOME TO aGIZA</Text>
            <View style={styles.view1}>
              <View style={styles.view8}>
                <Text style={styles.text2}>SEND AND RECEIVE YOUR PARCEL SAFELY WITH US</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={{ marginTop: 20, marginBottom: 20 }}>
                    <View style={styles.button1}><Link href="Details">
                      <Text style={styles.button1Text}>Send with aGIZA</Text> </Link>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft: 10 }}>
                    <View style={styles.button2}>
                      <Link href="Profile">
                      {/* <Link href="Driver"> */}
                        <Text style={styles.button2Text}>View Profile</Text>
                      </Link>
                    </View>
                  </TouchableOpacity>
                  
                  {/* <TouchableOpacity style={{ marginLeft: 10 }}>
                    <View style={styles.button2}>
                      <Link href="UserLocation">
                        <Text style={styles.button2Text}>Testing</Text>
                      </Link>
                    </View>
                  </TouchableOpacity> */}
                  
                </View>
              </View>
            </View>
          </View>
          <View>
            <FlatList
              numRows={4}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={filterData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.view2}>
                    <Image style={styles.image2} source={item.image} />
                  </View>
                  <View>
                    <Text style={styles.title}>{item.name}</Text>
                  </View>
                </View>
              )}
            />
          </View>
          <View style={styles.view3}>
            <Text style={styles.text3}> Where to?</Text>
            <View style={styles.view4}>
              <Icon type="material-community" name="clock-time-four" color={Colors.grey1} size={26} />
              <Text style={{ marginLeft: 5 }}>Now</Text>
              <Icon type="material-community" name="chevron-down" color={Colors.grey1} size={26} />
            </View>
          </View>
          <View style={styles.view5}>
            <View style={styles.view6}>
              <View style={styles.view7}>
                <Icon type="material-community" name="map-marker" color={Colors.black} size={22} />
              </View>
              <View>
                <Text style={{ fontSize: 18, color: Colors.black }}>Mliman City Mall</Text>
                <Text style={{ color: Colors.grey3 }}>Dar es Salaam</Text>
              </View>
            </View>
            <View>
              <Icon type="material-community" name="chevron-right" color={Colors.grey} size={26} />
            </View>
          </View>
          <View style={{ ...styles.view5, borderBottomWidth: 0 }}>
            <View style={styles.view6}>
              <View style={styles.view7}>
                <Icon type="material-community" name="map-marker" color={Colors.black} size={22} />
              </View>
              <View>
                <Text style={{ fontSize: 18, color: Colors.black }}>Bunju Mwisho</Text>
                <Text style={{ color: Colors.grey3 }}>Dar es Salaam</Text>
              </View>
            </View>
            <View>
              <Icon type="material-community" name="chevron-right" color={Colors.grey} size={26} />
            </View>
          </View>
          <Text style={styles.text4}>Around You</Text>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MapView
              ref={_map}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              customMapStyle={mapStyle}
              showsUserLocation={true}
              followsUserLocation={true}
              initialRegion={{ ...carsAround[0], latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
            />
          </View>
        </ScrollView>
        <StatusBar style="dark" backgroundColor="#2058c0" translucent={true} />
      </View>
    </>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    display: 'flex',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    backgroundColor: Colors.blue,
    paddingLeft: 10,
    paddingTop: 5,
    marginLeft: '2px',
  },
  image1: {
    height: 100,
    width: 100,
  },
  image2: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  home: {
    backgroundColor: Colors.blue,
    paddingLeft: 20,
  },
  text1: {
    color: Colors.white,
    fontSize: 21,
    paddingBottom: 20,
    paddingTop: 20,
  },
  text2: {
    color: Colors.white,
    fontSize: 16,
  },
  view1: {
    flexDirection: 'row',
    flex: 1,
    paddingTop: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  button1: {
    height: 40,
    width: 150,
    backgroundColor: Colors.black,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  }, 
  button2: {
    height: 40,
    width: 150,
    backgroundColor: Colors.black,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  button1Text: {
    color: Colors.white,
    fontSize: 17,
    marginTop: -2,
  },button2Text: {
    color: Colors.white,
    fontSize: 17,
    marginTop: -2,
  },
  card: {
    alignItems: 'center',
    margin: SCREEN_WIDTH / 22,
  },
  view2: {
    marginBottom: 5,
    borderRadius: 15,
    backgroundColor: Colors.grey6,
  },
  title: {
    color: Colors.black,
    fontSize: 16,
  },
  view3: {
    flexDirection: 'row',
    marginTop: 5,
    height: 50,
    backgroundColor: Colors.grey6,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
  text3: {
    marginLeft: 15,
    fontSize: 20,
    color: Colors.black,
  },
  view4: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
  },
  view5: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 25,
    justifyContent: 'space-between',
    marginHorizontal: 15,
    borderBottomColor: Colors.grey4,
    borderBottomWidth: 1,
    flex: 1,
  },
  view6: {
    alignItems: 'center',
    flex: 5,
    flexDirection: 'row',
  },
  view7: {
    backgroundColor: Colors.grey6,
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  map: {
    height: 150,
    marginVertical: 0,
    width: SCREEN_WIDTH * 0.92,
  },
  text4: {
    fontSize: 20,
    color: Colors.black,
    marginLeft: 20,
    marginBottom: 20,
  },
  view8: {
    flex: 4,
    marginTop: -25,
  },
  carsAround: {
    width: 28,
    height: 14,
  },
  location: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view9: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
  },
});




// import { View, Text, StyleSheet, Dimensions, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
// import React, { useState, useRef, useEffect } from 'react';
// import { Icon } from 'react-native-elements';
// import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
// import * as Location from 'expo-location';
// import { StatusBar } from 'expo-status-bar';
// import { Link } from 'expo-router';
// const SCREEN_WIDTH = Dimensions.get('window').width;
// const SCREEN_HEIGHT = Dimensions.get('window').height;

// import { mapStyle } from '../components/global/mapStyle';
// import { Colors, parameters } from '../components/global/styles';
// import Constants from 'expo-constants';
// const { buttons, grey, grey1, grey2, grey3, grey4, grey5, grey6, grey7, grey10, CardComment, cardbackground, statusbar, heaherText, lightgreen, blue, black, white, darkBlue, pagebackground } = Colors;
// const statusBarHeight = Constants.statusBarHeight;

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import CustomSwitch from './../components/CustomSwitch';

// import { filterData, carsAround } from '../components/data';

// const Welcome = ({ navigation }) => {
//   const [latlng, setLatlng] = useState({});

//   const checkPermission = async () => {
//     const hasPermission = await Location.requestForegroundPermissionsAsync();
//     if (hasPermission.status !== 'granted') {
//       const permission = await askPermission();
//       return permission;
//     }
//     return true;
//   };

//   const askPermission = async () => {
//     const permission = await Location.requestForegroundPermissionsAsync();
//     return permission.status === 'granted';
//   };

//   const getLocation = async () => {
//     try {
//       const { granted } = await Location.getForegroundPermissionsAsync();
//       if (!granted) return;
//       const {
//         coords: { latitude, longitude },
//       } = await Location.getCurrentPositionAsync();
//       setLatlng({ latitude, longitude });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const _map = useRef(1);

//   useEffect(() => {
//     checkPermission();
//     getLocation();
//     console.log(latlng);
//   }, []);

//   return (
//     <>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Icon
//             type="material-community"
//             name="menu"
//             color={Colors.white}
//             size={40}
//             style={{ marginLeft: '2px' }}
//             onPress={() => navigation.openDrawer()}
//           />
//         </View>
//         <ScrollView bounces={false}>
//           <View style={styles.home}>
//             <Text style={styles.text1}>WELCOME TO aGIZA</Text>
//             <View style={styles.view1}>
//               <View style={styles.view8}>
//                 <Text style={styles.text2}>SEND AND RECEIVE YOUR PARCEL SAFELY WITH US</Text>
//                 <View style={styles.buttonContainer}>
//                   <TouchableOpacity style={{ marginTop: 20, marginBottom: 20 }}>
//                     <View style={styles.button1}><Link href="Details">
//                       <Text style={styles.button1Text}>Send with aGIZA</Text> </Link>
//                     </View>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={{ marginLeft: 10 }}>
//                     <View style={styles.button2}>
//                       <Link href="Profile">
//                         <Text style={styles.button2Text}>View Profile</Text>
//                       </Link>
//                     </View>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </View>
//           <View>
//             <FlatList
//               numRows={4}
//               horizontal={true}
//               showsHorizontalScrollIndicator={false}
//               data={filterData}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <View style={styles.card}>
//                   <View style={styles.view2}>
//                     <Image style={styles.image2} source={item.image} />
//                   </View>
//                   <View>
//                     <Text style={styles.title}>{item.name}</Text>
//                   </View>
//                 </View>
//               )}
//             />
//           </View>
//           <View style={styles.view3}>
//             <Text style={styles.text3}> Where to?</Text>
//             <View style={styles.view4}>
//               <Icon type="material-community" name="clock-time-four" color={Colors.grey1} size={26} />
//               <Text style={{ marginLeft: 5 }}>Now</Text>
//               <Icon type="material-community" name="chevron-down" color={Colors.grey1} size={26} />
//             </View>
//           </View>
//           <View style={styles.view5}>
//             <View style={styles.view6}>
//               <View style={styles.view7}>
//                 <Icon type="material-community" name="map-marker" color={Colors.black} size={22} />
//               </View>
//               <View>
//                 <Text style={{ fontSize: 18, color: Colors.black }}>Mliman City Mall</Text>
//                 <Text style={{ color: Colors.grey3 }}>Dar es Salaam</Text>
//               </View>
//             </View>
//             <View>
//               <Icon type="material-community" name="chevron-right" color={Colors.grey} size={26} />
//             </View>
//           </View>
//           <View style={{ ...styles.view5, borderBottomWidth: 0 }}>
//             <View style={styles.view6}>
//               <View style={styles.view7}>
//                 <Icon type="material-community" name="map-marker" color={Colors.black} size={22} />
//               </View>
//               <View>
//                 <Text style={{ fontSize: 18, color: Colors.black }}>Bunju Mwisho</Text>
//                 <Text style={{ color: Colors.grey3 }}>Dar es Salaam</Text>
//               </View>
//             </View>
//             <View>
//               <Icon type="material-community" name="chevron-right" color={Colors.grey} size={26} />
//             </View>
//           </View>
//           <Text style={styles.text4}>Around You</Text>
//           <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//             <MapView
//               ref={_map}
//               provider={PROVIDER_GOOGLE}
//               style={styles.map}
//               customMapStyle={mapStyle}
//               showsUserLocation={true}
//               followsUserLocation={true}
//               initialRegion={{ ...carsAround[0], latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
//             />
//           </View>
//         </ScrollView>
//         <StatusBar style="dark" backgroundColor="#2058c0" translucent={true} />
//       </View>
//     </>
//   );
// };

// export default Welcome;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.white,
//     display: 'flex',
//   },
//   header: {
//     display: 'flex',
//     alignItems: 'flex-start',
//     backgroundColor: Colors.blue,
//     paddingLeft: 10,
//     paddingTop: 5,
//     marginLeft: '2px',
//   },
//   image1: {
//     height: 100,
//     width: 100,
//   },
//   image2: {
//     height: 60,
//     width: 60,
//     borderRadius: 30,
//   },
//   home: {
//     backgroundColor: Colors.blue,
//     paddingLeft: 20,
//   },
//   text1: {
//     color: Colors.white,
//     fontSize: 21,
//     paddingBottom: 20,
//     paddingTop: 20,
//   },
//   text2: {
//     color: Colors.white,
//     fontSize: 16,
//   },
//   view1: {
//     flexDirection: 'row',
//     flex: 1,
//     paddingTop: 30,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 20,
//     marginBottom: 20,
//   },
//   button1: {
//     height: 40,
//     width: 150,
//     backgroundColor: Colors.black,
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 0,
//   }, 
//   button2: {
//     height: 40,
//     width: 150,
//     backgroundColor: Colors.black,
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 0,
//   },
//   button1Text: {
//     color: Colors.white,
//     fontSize: 17,
//     marginTop: -2,
//   },button2Text: {
//     color: Colors.white,
//     fontSize: 17,
//     marginTop: -2,
//   },
//   card: {
//     alignItems: 'center',
//     margin: SCREEN_WIDTH / 22,
//   },
//   view2: {
//     marginBottom: 5,
//     borderRadius: 15,
//     backgroundColor: Colors.grey6,
//   },
//   title: {
//     color: Colors.black,
//     fontSize: 16,
//   },
//   view3: {
//     flexDirection: 'row',
//     marginTop: 5,
//     height: 50,
//     backgroundColor: Colors.grey6,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginHorizontal: 15,
//   },
//   text3: {
//     marginLeft: 15,
//     fontSize: 20,
//     color: Colors.black,
//   },
//   view4: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 15,
//     backgroundColor: 'white',
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//     borderRadius: 20,
//   },
//   view5: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     paddingVertical: 25,
//     justifyContent: 'space-between',
//     marginHorizontal: 15,
//     borderBottomColor: Colors.grey4,
//     borderBottomWidth: 1,
//     flex: 1,
//   },
//   view6: {
//     alignItems: 'center',
//     flex: 5,
//     flexDirection: 'row',
//   },
//   view7: {
//     backgroundColor: Colors.grey6,
//     height: 40,
//     width: 40,
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 20,
//   },
//   map: {
//     height: 150,
//     marginVertical: 0,
//     width: SCREEN_WIDTH * 0.92,
//   },
//   text4: {
//     fontSize: 20,
//     color: Colors.black,
//     marginLeft: 20,
//     marginBottom: 20,
//   },
//   view8: {
//     flex: 4,
//     marginTop: -25,
//   },
//   carsAround: {
//     width: 28,
//     height: 14,
//   },
//   location: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     backgroundColor: Colors.blue,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   view9: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: 'white',
//   },
// });


import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';

const DriverMap = () => {
    const route = useRoute();
    const { packageDetails, currentLocation } = route.params;
    const [location, setLocation] = useState(currentLocation);
    const [driverRoute, setDriverRoute] = useState([]);
    const mapRef = useRef(null);

    useEffect(() => {
        const getRoute = async () => {
            try {
                const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&destination=${packageDetails.pickuplocation}&key=${GOOGLE_API_KEY}`);
                const json = await response.json();
                const points = json.routes[0].overview_polyline.points;
                const steps = decode(points);

                setDriverRoute(steps);
            } catch (error) {
                Alert.alert('Error', 'Unable to get route');
            }
        };

        getRoute();
    }, []);

    const decode = (t, e = 5) => {
        let d = [],
            n, o, u, l = 0,
            r = 0,
            h = 0,
            i = 0,
            a = 0;
        while (l < t.length) {
            n = 1;
            o = 0;
            while (true) {
                u = t.charCodeAt(l++) - 63 - 1;
                o += u << i;
                i += 5;
                if (u < 0x1f) break;
            }
            r += (o & 1 ? ~(o >> 1) : o >> 1);
            n = 1;
            o = 0;
            i = 0;
            while (true) {
                u = t.charCodeAt(l++) - 63 - 1;
                o += u << i;
                i += 5;
                if (u < 0x1f) break;
            }
            h += (o & 1 ? ~(o >> 1) : o >> 1);
            d.push([r / e, h / e]);
        }
        return d.map(point => {
            return {
                latitude: point[0],
                longitude: point[1]
            };
        });
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: currentLocation.coords.latitude,
                        longitude: currentLocation.coords.longitude,
                    }}
                    title="Driver Location"
                />
                <Marker
                    coordinate={{
                        latitude: packageDetails.pickuplocation.lat,
                        longitude: packageDetails.pickuplocation.lng,
                    }}
                    title="Pickup Location"
                />
                <Marker
                    coordinate={{
                        latitude: packageDetails.deliverylocation.lat,
                        longitude: packageDetails.deliverylocation.lng,
                    }}
                    title="Delivery Location"
                />
                <Polyline
                    coordinates={driverRoute}
                    strokeColor="#000"
                    strokeWidth={6}
                />
            </MapView>
            <View style={styles.detailsContainer}>
                <Text>Recipient Name: {packageDetails.fullName}</Text>
                <Text>Phone Number: {packageDetails.PhoneNumber}</Text>
                <Text>Pickup Location: {packageDetails.pickuplocation}</Text>
                <Text>Delivery Location: {packageDetails.deliverylocation}</Text>
                <Text>Ride Type: {packageDetails.rideType}</Text>
                <Text>Cost: {packageDetails.cost} TZS</Text>
            </View>
        </View>
    );
};

const { height } = Dimensions.get('window');
const mapHeight = height / 1.5;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        height: mapHeight,
    },
    detailsContainer: {
        padding: 20,
    },
});

export default DriverMap;




// import React, { useRef, useState, useEffect } from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// import MapViewDirections from "react-native-maps-directions";
// import ImagePath from "./../constant/ImagePath";
// import { getCurrentLocation, locationPermission } from "./../helper/helperFunction";
// import { useRouter } from 'expo-router';

// const DriverMap = () => {
//   const [state, setState] = useState({
//     pickupCords: {
//       latitude: -6.8226625,
//       longitude: 39.30244649999999,
//     },
//     dropoffCords: null,
//   });

//   const { pickupCords, dropoffCords } = state;

//   const mapRef = useRef(null);
//   const router = useRouter(); // Initialize the router

//   useEffect(() => {
//     const getLiveLocation = async () => {
//       const locPermissionDenied = await locationPermission();
//       if (!locPermissionDenied) {
//         const { latitude, longitude } = await getCurrentLocation();
//         setState((prevState) => ({
//           ...prevState,
//           pickupCords: {
//             latitude,
//             longitude,
//           },
//         }));
//       }
//     };

//     getLiveLocation();
//   }, []);

//   const fetchValues = (data) => {
//     setState((prevState) => ({
//       ...prevState,
//       dropoffCords: {
//         latitude: data.dropoffCords.latitude,
//         longitude: data.dropoffCords.longitude,
//       },
//     }));
//     console.log("Data===>", data);
//   };

//   const onPressLocation = () => {
//     router.push('/Destination');
//   };

//   return (
//     <View style={styles.container}>
//       <View style={{ flex: 1 }}>
//         <MapView
//           provider={PROVIDER_GOOGLE}
//           style={StyleSheet.absoluteFill}
//           initialRegion={{
//             ...pickupCords,
//             latitudeDelta: 0.0922,
//             longitudeDelta: 0.0421,
//           }}
//           ref={mapRef}
//         >
//           <Marker 
//             coordinate={pickupCords} 
//             pinColor="green" 
//             image={ImagePath.icCurLoc}
//           />
//           {dropoffCords && (
//             <Marker 
//               coordinate={dropoffCords} 
//               pinColor="red" 
//               image={ImagePath.icGreenMarker}
//             />
//           )}
//           {dropoffCords && (
//             <MapViewDirections 
//               origin={pickupCords}
//               destination={dropoffCords}
//               apikey='AIzaSyD6DVLho-QJOqaxGKZ9pDQLYuDkvxlTyuw'
//               strokeWidth={3}
//               strokeColor="hotpink"
//               onReady={result => {
//                 if (mapRef.current) {
//                   mapRef.current.fitToCoordinates(result.coordinates, {
//                     edgePadding: {
//                       right: 30,
//                       left: 30,
//                       top: 100,
//                       bottom: 300,
//                     },
//                     animated: true,
//                   });
//                   console.log(`Distance: ${result.distance} km`);
//                   console.log(`Duration: ${result.duration} min.`);
//                 } else {
//                   console.log('MapView reference is not available');
//                 }
//               }}
//               onError={(errorMessage) => {
//                 console.log('GOT AN ERROR', errorMessage);
//               }}
//             />
//           )}
//         </MapView>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   bottomCard: {
//     backgroundColor: 'white',
//     width: '100%',
//     padding: 30,
//     borderTopEndRadius: 24,
//     borderTopStartRadius: 24,
//   },
//   inputStyle: {
//     backgroundColor: 'white',
//     borderRadius: 4,
//     borderWidth: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 50,
//     marginTop: 16
//   },
// });

// export default DriverMap;

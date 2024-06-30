import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyD6DVLho-QJOqaxGKZ9pDQLYuDkvxlTyuw';

const ClientMap = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [location, setLocation] = useState(null);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [cost, setCost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rideType, setRideType] = useState(null);

    const { pickuplocation, fullName, deliverylocation, PhoneNumber, Detail, Inside } = route.params;

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            await calculateDistance(pickuplocation, deliverylocation);
        })();
    }, []);

    const getCoordinates = async (locationName) => {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${locationName}&key=${GOOGLE_API_KEY}`
        );

        if (response.data.status === 'OK') {
            const { lat, lng } = response.data.results[0].geometry.location;
            return { lat, lng };
        } else {
            throw new Error('Unable to get location');
        }
    };

    const calculateDistance = async (pickup, delivery) => {
        try {
            const pickupCoords = await getCoordinates(pickup);
            const deliveryCoords = await getCoordinates(delivery);

            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${pickupCoords.lat},${pickupCoords.lng}&destinations=${deliveryCoords.lat},${deliveryCoords.lng}&key=${GOOGLE_API_KEY}`
            );

            if (response.data.status === 'OK') {
                const element = response.data.rows[0].elements[0];
                const distanceText = element.distance.text;
                const distanceValue = parseFloat(distanceText.replace(' km', ''));

                setDistance(distanceText);
                setDuration(element.duration.text);
            } else {
                Alert.alert('Error', 'Unable to calculate distance');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRideSelection = async (rideType) => {
        setRideType(rideType);
        let cost = 0;
        if (rideType === 'bodaboda') {
            cost = parseFloat(distance.replace(' km', '')) * 2000;
        } else if (rideType === 'kirikuu') {
            cost = parseFloat(distance.replace(' km', '')) * 4000;
        }
        setCost(cost);
    
        // Send data to the database
        try {
            await axios.post('http://192.168.62.127:4000/api/packages', {
                pickuplocation: pickuplocation,
                deliverylocation: deliverylocation,
                fullName: fullName,
                PhoneNumber: PhoneNumber,
                Detail: Detail,
                Inside: Inside,
                rideType: rideType,
                cost: cost
            });
    
            // Navigate to the driver page
            navigation.navigate('Comfirm', {
                pickuplocation,
                fullName,
                deliverylocation,
                PhoneNumber,
                Detail,
                Inside,
                rideType: rideType,
                cost: cost,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to create package');
        }
    };
    

    // const handleRideSelection = async (type) => {
    //     setRideType(type);
    //     let costValue = 0;
    //     if (type === 'bodaboda') {
    //         costValue = parseFloat(distance.replace(' km', '')) * 2000;
    //     } else if (type === 'kirikuu') {
    //         costValue = parseFloat(distance.replace(' km', '')) * 4000;
    //     }
    //     setCost(costValue);

    //     // Send data to the database
    //     await axios.post('http://192.168.62.127:4000/api/packages', {
    //         pickuplocation,
    //         fullName,
    //         deliverylocation,
    //         PhoneNumber,
    //         Detail,
    //         Inside,
    //         rideType: type,
    //         cost: costValue,
    //     });

    //     // Navigate to the driver page
    //     navigation.navigate('DriverPage', {
    //         pickuplocation,
    //         fullName,
    //         deliverylocation,
    //         PhoneNumber,
    //         Detail,
    //         Inside,
    //         rideType: type,
    //         cost: costValue,
    //     });
    // };

    if (!location) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }}
                    title="Driver Location"
                />
            </MapView>
            <View style={styles.detailsContainer}>
                <Text>Pickup Location: {pickuplocation}</Text>
                <Text>Full Name: {fullName}</Text>
                <Text>Delivery Location: {deliverylocation}</Text>
                <Text>Phone Number: {PhoneNumber}</Text>
                <Text>Parcel Description: {Detail}</Text>
                <Text>Parcel Contents: {Inside}</Text>
                {loading ? (
                    <Text>Calculating distance...</Text>
                ) : (
                    <>
                        <Text>Distance: {distance}</Text>
                        <Text>Duration: {duration}</Text>
                        <Text>Cost: {cost ? `${cost} Tsh` : 'Select a ride type'}</Text>
                    </>
                )}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => handleRideSelection('bodaboda')}>
                        <Text style={styles.buttonText}>Bodaboda</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleRideSelection('kirikuu')}>
                        <Text style={styles.buttonText}>Kirikuu</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    detailsContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#f0ad4e',
        padding: 10,
        borderRadius: 5,
        width: '40%',
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ClientMap;




// import React, { useRef, useState, useEffect } from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// import MapViewDirections from "react-native-maps-directions";
// import ImagePath from "./../constant/ImagePath";
// import { getCurrentLocation, locationPermission } from "./../helper/helperFunction";
// import { useRouter } from 'expo-router';

// const ClientMap = () => {
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
//       <View style={styles.bottomCard}>
//         <Text>Where are you going..?</Text>
//         <TouchableOpacity style={styles.inputStyle} onPress={onPressLocation}>
//           <Text>Choose your location</Text>
//         </TouchableOpacity>
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

// export default ClientMap;

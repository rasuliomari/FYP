import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Alert, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import currentLocationIcon from './../assets/images/bike.png'; // Import your custom marker image

const GOOGLE_API_KEY = 'AIzaSyD6DVLho-QJOqaxGKZ9pDQLYuDkvxlTyuw';

const DriverMap = () => {
    const route = useRoute();
    const { packageDetails, currentLocation } = route.params;
    const [pickupCoords, setPickupCoords] = useState(null);
    const [deliveryCoords, setDeliveryCoords] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pickupRoute, setPickupRoute] = useState([]);
    const [deliveryRoute, setDeliveryRoute] = useState([]);

    useEffect(() => {
        const geocodeLocation = async (location) => {
            try {
                const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${GOOGLE_API_KEY}`);
                if (response.data.status === 'OK') {
                    const { lat, lng } = response.data.results[0].geometry.location;
                    return { latitude: lat, longitude: lng };
                } else {
                    Alert.alert('Error', 'Unable to geocode location');
                    return null;
                }
            } catch (error) {
                Alert.alert('Error', error.message);
                return null;
            }
        };

        const fetchLocations = async () => {
            const pickupLocation = await geocodeLocation(packageDetails.pickuplocation);
            const deliveryLocation = await geocodeLocation(packageDetails.deliverylocation);
            if (pickupLocation && deliveryLocation) {
                setPickupCoords(pickupLocation);
                setDeliveryCoords(deliveryLocation);
                setIsLoading(false);

                // Fetch routes
                fetchRoute(currentLocation.coords, pickupLocation, setPickupRoute);
                fetchRoute(currentLocation.coords, deliveryLocation, setDeliveryRoute);
            }
        };

        fetchLocations();
    }, []);

    const fetchRoute = async (origin, destination, setRoute) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_API_KEY}`);
            if (response.data.status === 'OK') {
                const points = response.data.routes[0].overview_polyline.points;
                const steps = decode(points);
                setRoute(steps);
            } else {
                Alert.alert('Error', 'Unable to fetch route');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

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

    if (isLoading || !pickupCoords || !deliveryCoords) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // Calculate all coordinates to fit into the map's visible area
    const allCoordinates = [
        currentLocation.coords,
        pickupCoords,
        deliveryCoords,
    ];

    // Calculate map's region to fit all coordinates
    const mapRegion = {
        latitude: (currentLocation.coords.latitude + pickupCoords.latitude + deliveryCoords.latitude) / 3,
        longitude: (currentLocation.coords.longitude + pickupCoords.longitude + deliveryCoords.longitude) / 3,
        latitudeDelta: Math.abs(currentLocation.coords.latitude - pickupCoords.latitude) * 2.5,
        longitudeDelta: Math.abs(currentLocation.coords.longitude - pickupCoords.longitude) * 2.5,
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={mapRegion}
                ref={(ref) => { this.map = ref; }}
                onLayout={() => {
                    this.map.fitToCoordinates(allCoordinates, {
                        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                        animated: true,
                    });
                }}
            >
                {/* Custom image marker for current location */}
                <Marker
                    coordinate={currentLocation.coords}
                    title="Driver Location"
                    anchor={{ x: 0.5, y: 0.5 }}
                >
                    <Image source={currentLocationIcon} style={{ width: 32, height: 32 }} />
                </Marker>
                {/* Default markers for pickup and delivery locations */}
                <Marker
                    coordinate={pickupCoords}
                    title="Pickup Location"
                />
                <Marker
                    coordinate={deliveryCoords}
                    title="Delivery Location"
                />
                {/* Polylines for routes */}
                <Polyline
                    coordinates={pickupRoute}
                    strokeColor="red"
                    strokeWidth={6}
                />
                <Polyline
                    coordinates={deliveryRoute}
                    strokeColor="red"
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
const mapHeight = height / 1.2;

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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DriverMap;






// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Alert, Image } from 'react-native';
// import MapView, { Marker, Polyline } from 'react-native-maps';
// import { useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import currentLocationIcon from './../assets/images/bike.png'; // Import your custom marker image

// const GOOGLE_API_KEY = 'AIzaSyD6DVLho-QJOqaxGKZ9pDQLYuDkvxlTyuw';

// const DriverMap = () => {
//     const route = useRoute();
//     const { packageDetails, currentLocation } = route.params;
//     const [pickupCoords, setPickupCoords] = useState(null);
//     const [deliveryCoords, setDeliveryCoords] = useState(null);
//     const [driverRoute, setDriverRoute] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [distanceToPickup, setDistanceToPickup] = useState(0);
//     const [distanceToDelivery, setDistanceToDelivery] = useState(0);

//     useEffect(() => {
//         const geocodeLocation = async (location) => {
//             try {
//                 const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${GOOGLE_API_KEY}`);
//                 if (response.data.status === 'OK') {
//                     const { lat, lng } = response.data.results[0].geometry.location;
//                     return { latitude: lat, longitude: lng };
//                 } else {
//                     Alert.alert('Error', 'Unable to geocode location');
//                     return null;
//                 }
//             } catch (error) {
//                 Alert.alert('Error', error.message);
//                 return null;
//             }
//         };

//         const fetchLocations = async () => {
//             const pickupLocation = await geocodeLocation(packageDetails.pickuplocation);
//             const deliveryLocation = await geocodeLocation(packageDetails.deliverylocation);
//             if (pickupLocation && deliveryLocation) {
//                 setPickupCoords(pickupLocation);
//                 setDeliveryCoords(deliveryLocation);

//                 const getRoute = async () => {
//                     try {
//                         const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&destination=${deliveryLocation.latitude},${deliveryLocation.longitude}&waypoints=${pickupLocation.latitude},${pickupLocation.longitude}&key=${GOOGLE_API_KEY}`);
//                         if (response.data.status === 'OK') {
//                             const points = response.data.routes[0].overview_polyline.points;
//                             const steps = decode(points);
//                             setDriverRoute(steps);

//                             // Calculate distances
//                             const distanceToPickup = calculateDistance(currentLocation.coords.latitude, currentLocation.coords.longitude, pickupLocation.latitude, pickupLocation.longitude);
//                             const distanceToDelivery = calculateDistance(currentLocation.coords.latitude, currentLocation.coords.longitude, deliveryLocation.latitude, deliveryLocation.longitude);
//                             setDistanceToPickup(distanceToPickup);
//                             setDistanceToDelivery(distanceToDelivery);
//                         } else {
//                             Alert.alert('Error', 'Unable to get route');
//                         }
//                     } catch (error) {
//                         Alert.alert('Error', error.message);
//                     } finally {
//                         setIsLoading(false); // Set loading to false after fetching route
//                     }
//                 };

//                 getRoute();
//             }
//         };

//         fetchLocations();
//     }, []);

//     // Function to calculate distance using Haversine formula
//     const calculateDistance = (lat1, lon1, lat2, lon2) => {
//         const R = 6371; // Radius of the earth in km
//         const dLat = deg2rad(lat2 - lat1);
//         const dLon = deg2rad(lon2 - lon1);
//         const a =
//             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         const d = R * c; // Distance in km
//         return d * 1000; // Convert to meters
//     };

//     const deg2rad = (deg) => {
//         return deg * (Math.PI / 180);
//     };

//     const decode = (t, e = 5) => {
//         let d = [],
//             n, o, u, l = 0,
//             r = 0,
//             h = 0,
//             i = 0,
//             a = 0;
//         while (l < t.length) {
//             n = 1;
//             o = 0;
//             while (true) {
//                 u = t.charCodeAt(l++) - 63 - 1;
//                 o += u << i;
//                 i += 5;
//                 if (u < 0x1f) break;
//             }
//             r += (o & 1 ? ~(o >> 1) : o >> 1);
//             n = 1;
//             o = 0;
//             i = 0;
//             while (true) {
//                 u = t.charCodeAt(l++) - 63 - 1;
//                 o += u << i;
//                 i += 5;
//                 if (u < 0x1f) break;
//             }
//             h += (o & 1 ? ~(o >> 1) : o >> 1);
//             d.push([r / e, h / e]);
//         }
//         return d.map(point => {
//             return {
//                 latitude: point[0],
//                 longitude: point[1]
//             };
//         });
//     };

//     if (isLoading || !pickupCoords || !deliveryCoords) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#0000ff" />
//             </View>
//         );
//     }

//     // Calculate all coordinates to fit into the map's visible area
//     const allCoordinates = [
//         currentLocation.coords,
//         pickupCoords,
//         deliveryCoords,
//     ];

//     // Calculate map's region to fit all coordinates
//     const mapRegion = {
//         latitude: (currentLocation.coords.latitude + pickupCoords.latitude + deliveryCoords.latitude) / 3,
//         longitude: (currentLocation.coords.longitude + pickupCoords.longitude + deliveryCoords.longitude) / 3,
//         latitudeDelta: Math.abs(currentLocation.coords.latitude - pickupCoords.latitude) * 2.5,
//         longitudeDelta: Math.abs(currentLocation.coords.longitude - pickupCoords.longitude) * 2.5,
//     };

//     return (
//         <View style={styles.container}>
//             <MapView
//                 style={styles.map}
//                 initialRegion={mapRegion}
//                 ref={(ref) => { this.map = ref; }}
//                 onLayout={() => {
//                     this.map.fitToCoordinates(allCoordinates, {
//                         edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
//                         animated: true,
//                     });
//                 }}
//             >
//                 {/* Custom image marker for current location */}
//                 <Marker
//                     coordinate={currentLocation.coords}
//                     title="Driver Location"
//                     anchor={{ x: 0.5, y: 0.5 }}
//                 >
//                     <Image source={currentLocationIcon} style={{ width: 32, height: 32 }} />
//                 </Marker>
//                 {/* Default markers for pickup and delivery locations */}
//                 <Marker
//                     coordinate={pickupCoords}
//                     title="Pickup Location"
//                 />
//                 <Marker
//                     coordinate={deliveryCoords}
//                     title="Delivery Location"
//                 />
//                 {/* Polyline for driver route */}
//                 <Polyline
//                     coordinates={driverRoute}
//                     strokeColor="red" // Red color for the route
//                     strokeWidth={6}
//                 />
//             </MapView>
//             <View style={styles.detailsContainer}>
//                 <Text>Recipient Name: {packageDetails.fullName}</Text>
//                 <Text>Phone Number: {packageDetails.PhoneNumber}</Text>
//                 <Text>Pickup Location: {packageDetails.pickuplocation}</Text>
//                 <Text>Distance to Pickup: {distanceToPickup.toFixed(2)} meters</Text>
//                 <Text>Delivery Location: {packageDetails.deliverylocation}</Text>
//                 <Text>Distance to Delivery: {distanceToDelivery.toFixed(2)} meters</Text>
//                 <Text>Ride Type: {packageDetails.rideType}</Text>
//                 <Text>Cost: {packageDetails.cost} TZS</Text>
//             </View>
//         </View>
//     );
// };

// const { height } = Dimensions.get('window');
// const mapHeight = height / 1.2;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     map: {
//         height: mapHeight,
//     },
//     detailsContainer: {
//         padding: 20,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

// export default DriverMap;


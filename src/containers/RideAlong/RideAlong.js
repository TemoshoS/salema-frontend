import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import 'react-native-get-random-values';

// Pulse component for the blue pulsing effect
const Pulse = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 2.5,
            duration: 1500,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [scaleAnim, opacityAnim]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
      }}
    />
  );
};

export default function RideAlong() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isChoosingSource, setIsChoosingSource] = useState(false);
  const [isChoosingDestination, setIsChoosingDestination] = useState(false);
  const [routeCoords, setRouteCoords] = useState([]);
  const [travelMode, setTravelMode] = useState('driving');
  const [userPickedSource, setUserPickedSource] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [distanceText, setDistanceText] = useState('');
  const [durationText, setDurationText] = useState('');

  const mapRef = useRef(null);
  const apiKey = 'AIzaSyDbvMXhIzbnnN8x7kRe1eL2XASvPNNUSDk';

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const currentLoc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setLocation(currentLoc);
        setRegion(currentLoc);
        setLoading(false);
      },
      (error) => {
        Alert.alert('Location Error', error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert('Permission Denied', 'Location access is required.');
          setLoading(false);
        }
      } else {
        getCurrentLocation();
      }
    };
    requestPermission();
  }, []);

  useEffect(() => {
    if (location && !userPickedSource) {
      setSource({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
  }, [location, userPickedSource]);

  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  const getRouteDirections = async () => {
    if (!source || !destination) return;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${source.latitude},${source.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${travelMode}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.routes.length) {
        const route = response.data.routes[0];
        const points = decodePolyline(route.overview_polyline.points);
        const leg = route.legs[0];
        setDistanceText(leg.distance.text);
        setDurationText(leg.duration.text);
        setRouteCoords(points);

        mapRef.current?.fitToCoordinates(points, {
          edgePadding: { top: 70, bottom: 130, left: 70, right: 70 },
          animated: true,
        });
      } else {
        Alert.alert('No route found');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error fetching directions');
    }
  };
  useEffect(() => {
    console.log('Source:', source);
    console.log('Destination:', destination);
    console.log('Route Coordinates:', routeCoords);
  }, [source, destination, routeCoords]);

  useEffect(() => {
    if (source && destination) {
      getRouteDirections();
    } else {
      setRouteCoords([]);
      setDistanceText('');
      setDurationText('');
    }
  }, [source, destination, travelMode]);

  const handleMapPress = (e) => {
    const coordinate = e.nativeEvent.coordinate;
    setRegion({
      ...coordinate,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    if (isChoosingSource) {
      setSource(coordinate);
      setUserPickedSource(true);
      setIsChoosingSource(false);
    } else if (isChoosingDestination) {
      setDestination(coordinate);
      setIsChoosingDestination(false);
    }
  };

  const showCoordinates = () => {
    if (source && destination) {
      const dist = getDistance(source, destination) / 1000;
      Alert.alert(
        'Route Info',
        `Source: ${source.latitude}, ${source.longitude}\nDestination: ${destination.latitude}, ${destination.longitude}\nDistance: ${dist.toFixed(2)} km`
      );
    }
  };

  const removeSource = () => {
    setSource(null);
    setUserPickedSource(false);
    setRouteCoords([]);
    setDistanceText('');
    setDurationText('');
  };

  const removeDestination = () => {
    setDestination(null);
    setRouteCoords([]);
    setDistanceText('');
    setDurationText('');
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: '#f2f7fa' }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {!loading ? (
            <>
              {/* Search Inputs */}
              <View style={[styles.searchContainer, { top: 15 }]}>
                <GooglePlacesAutocomplete
                  placeholder="Search Source"
                  fetchDetails
                  onPress={(data, details = null) => {
                    if (details?.geometry?.location) {
                      const loc = details.geometry.location;
                      const coord = { latitude: loc.lat, longitude: loc.lng };
                      setSource(coord);
                      setUserPickedSource(true);
                      setRegion({ ...coord, latitudeDelta: 0.01, longitudeDelta: 0.01 });
                      mapRef.current?.animateToRegion({ ...coord, latitudeDelta: 0.01, longitudeDelta: 0.01 });
                    }
                  }}
                  query={{ key: apiKey, language: 'en' }}
                  textInputProps={{
                    placeholderTextColor: '#555',
                    style: [autoCompleteStyles.textInput, { color: '#222' }],
                  }}
                  enablePoweredByContainer={false}
                  styles={autoCompleteStyles}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </View>

              <View style={[styles.searchContainer, { top: 80 }]}>
                <GooglePlacesAutocomplete
  placeholder="Search Destination"
  fetchDetails
  onPress={(data, details = null) => {
    console.log('Destination Details:', details?.geometry?.location);
    if (details?.geometry?.location) {
      const loc = details.geometry.location;
      const coord = { latitude: loc.lat, longitude: loc.lng };
      setDestination(coord);
      setRegion({ ...coord, latitudeDelta: 0.01, longitudeDelta: 0.01 });
      mapRef.current?.animateToRegion({ ...coord, latitudeDelta: 0.01, longitudeDelta: 0.01 });
    }
  }}
  query={{ key: apiKey, language: 'en' }}
  textInputProps={{
    placeholderTextColor: '#555',
    style: [autoCompleteStyles.textInput, { color: '#222' }],
  }}
  enablePoweredByContainer={false}
  styles={autoCompleteStyles}
  onFocus={() => setIsSearchFocused(true)}
  onBlur={() => setIsSearchFocused(false)}
/>
              </View>

              {/* Map */}
              <MapView
                ref={mapRef}
                
                style={styles.map}
                region={region}
                showsUserLocation
                onPress={handleMapPress}
                pointerEvents={isSearchFocused ? 'none' : 'auto'}
                customMapStyle={customMapStyle}
              >
                {source && (
                  <Marker coordinate={source} title="Source">
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Pulse />
                      <View
                        style={{
                          height: 14,
                          width: 14,
                          borderRadius: 7,
                          backgroundColor: '#007AFF',
                          borderColor: '#fff',
                          borderWidth: 2,
                          position: 'absolute',
                        }}
                      />
                    </View>
                  </Marker>
                )}

                {destination && <Marker coordinate={destination} title="Destination" pinColor="#FF0000" />}
                {routeCoords.length > 0 && (
                  <Polyline coordinates={routeCoords} strokeWidth={5} strokeColor="#007AFF" />
                )}
              </MapView>

              {/* Route info card */}
              {(distanceText || durationText) && (
                <View style={styles.routeInfoCard}>
                  <Text style={styles.routeInfoTitle}>Route Info</Text>
                  <Text style={styles.routeInfoText}>Distance: {distanceText || '-'}</Text>
                  <Text style={styles.routeInfoText}>Duration: {durationText || '-'}</Text>
                </View>
              )}

              {/* Controls */}
              <View style={styles.buttonContainer}>
                <View style={styles.buttonGroup}>
                  {source ? (
                    <TouchableOpacity style={styles.btnRemove} onPress={removeSource}>
                      <Text style={styles.btnRemoveText}>Remove Source</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.btnSelect, isChoosingSource && styles.btnActive]}
                      onPress={() => setIsChoosingSource(true)}
                    >
                      <Text style={[styles.btnSelectText, isChoosingSource && styles.btnActiveText]}>
                        {isChoosingSource ? 'Tap Map for Source' : 'Choose Source'}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {destination ? (
                    <TouchableOpacity style={styles.btnRemove} onPress={removeDestination}>
                      <Text style={styles.btnRemoveText}>Remove Destination</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.btnSelect, isChoosingDestination && styles.btnActive]}
                      onPress={() => setIsChoosingDestination(true)}
                    >
                      <Text style={[styles.btnSelectText, isChoosingDestination && styles.btnActiveText]}>
                        {isChoosingDestination ? 'Tap Map for Destination' : 'Choose Destination'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.modeButtonsContainer}>
                  {['driving', 'walking', 'bicycling', 'transit'].map((mode) => (
                    <TouchableOpacity
                      key={mode}
                      style={[styles.modeBtn, travelMode === mode && styles.modeBtnActive]}
                      onPress={() => setTravelMode(mode)}
                    >
                      <Text style={[styles.modeBtnText, travelMode === mode && styles.modeBtnTextActive]}>
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.showCoordsBtn} onPress={showCoordinates}>
                  <Text style={styles.showCoordsBtnText}>Show Coordinates</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <ActivityIndicator size="large" color="#007AFF" />
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}



const SEARCH_INPUT_WIDTH = '80%';

const autoCompleteStyles = {
  container: {
    flex: 0,
    position: 'absolute',
    width: SEARCH_INPUT_WIDTH,
    alignSelf: 'center',
    zIndex: 999,
  },
  textInput: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
  },
  listView: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 5,
    zIndex: 999,
  },
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: 'absolute',
    width: SEARCH_INPUT_WIDTH,
    alignSelf: 'center',
    zIndex: 999,
  },
  routeInfoCard: {
    position: 'absolute',
    top: 140,
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    shadowColor: '#007AFF',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 10,
    zIndex: 998,
    minWidth: 240,
    alignItems: 'center',
  },
  routeInfoTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 6,
    color: '#007AFF',
  },
  routeInfoText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -5 },
    shadowRadius: 10,
    elevation: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  btnSelect: {
    flex: 1,
    backgroundColor: '#e0e5ec',
    marginHorizontal: 8,
    paddingVertical: 14,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#aaa',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 6,
  },
  btnActive: {
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowRadius: 12,
  },
  btnSelectText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  btnActiveText: {
    color: '#fff',
    fontWeight: '700',
  },
  btnRemove: {
    flex: 1,
    backgroundColor: '#FF3B30',
    marginHorizontal: 8,
    paddingVertical: 14,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 8,
  },
  btnRemoveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  modeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  modeBtn: {
    backgroundColor: '#e0e5ec',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginHorizontal: 5,
    shadowColor: '#aaa',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  modeBtnActive: {
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowRadius: 10,
  },
  modeBtnText: {
    fontWeight: '600',
    color: '#555',
    fontSize: 14,
  },
  modeBtnTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  showCoordsBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 25,
    marginHorizontal: 60,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  showCoordsBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});

const customMapStyle = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#b0c4de' }],
  },
];

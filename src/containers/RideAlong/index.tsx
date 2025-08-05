import React, { useEffect, useState, useRef } from 'react';
import {
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
  StyleSheet,
} from 'react-native';
import { styles, autoCompleteStyles, customMapStyle } from './styles';
import MapView, { Marker, Polyline, Region, LatLng, MapPressEvent } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import 'react-native-get-random-values';

const API_KEY = 'AIzaSyDbvMXhIzbnnN8x7kRe1eL2XASvPNNUSDk';

const RideAlong: React.FC = () => {
  const [location, setLocation] = useState<Region | undefined>(undefined);
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<LatLng | undefined>(undefined);
  const [destination, setDestination] = useState<LatLng | undefined>(undefined);
  const [isChoosingSource, setIsChoosingSource] = useState(false);
  const [isChoosingDestination, setIsChoosingDestination] = useState(false);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [travelMode, setTravelMode] = useState<'driving' | 'walking' | 'bicycling' | 'transit'>('driving');
  const [userPickedSource, setUserPickedSource] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [distanceText, setDistanceText] = useState('');
  const [durationText, setDurationText] = useState('');

  const mapRef = useRef<MapView | null>(null);

  // Request permission and get current location
  useEffect(() => {
    const requestPermissionAndGetLocation = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Location access is required.');
          setLoading(false);
          return;
        }
      }
      Geolocation.getCurrentPosition(
        (pos) => {
          const currentLoc: Region = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
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
    requestPermissionAndGetLocation();
  }, []);

  // Set source to current location by default unless user picks manually
  useEffect(() => {
    if (location && !userPickedSource) {
      setSource({ latitude: location.latitude, longitude: location.longitude });
    }
  }, [location, userPickedSource]);

  // Decode polyline helper (Google Directions API)
  const decodePolyline = (encoded: string): LatLng[] => {
    let points: LatLng[] = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
      let b: number, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

  // Fetch route from Google Directions API
  const getRouteDirections = async () => {
    if (!source || !destination) return;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${source.latitude},${source.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${travelMode}&key=${API_KEY}`;

    try {
      const response = await axios.get(url);
      if (response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const points = decodePolyline(route.overview_polyline.points);
        const leg = route.legs[0];
        setDistanceText(leg.distance.text);
        setDurationText(leg.duration.text);
        setRouteCoords(points);

        // Fit map to route
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

  // Trigger route fetch whenever source, destination or travelMode changes
  useEffect(() => {
    if (source && destination) {
      getRouteDirections();
    } else {
      setRouteCoords([]);
      setDistanceText('');
      setDurationText('');
    }
  }, [source, destination, travelMode]);

  // Map press handler for choosing source/destination on map
  const handleMapPress = (e: MapPressEvent) => {
    const coordinate = e.nativeEvent.coordinate;
    const newRegion: Region = {
      ...coordinate,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(newRegion);

    if (isChoosingSource) {
      setSource(coordinate);
      setUserPickedSource(true);
      setIsChoosingSource(false);
    } else if (isChoosingDestination) {
      setDestination(coordinate);
      setIsChoosingDestination(false);
    }
  };

  // Show route coordinates and distance alert
  const showCoordinates = () => {
    if (source && destination) {
      const dist = getDistance(source, destination) / 1000;
      Alert.alert(
        'Route Info',
        `Source: ${source.latitude.toFixed(6)}, ${source.longitude.toFixed(6)}\n` +
        `Destination: ${destination.latitude.toFixed(6)}, ${destination.longitude.toFixed(6)}\n` +
        `Distance: ${dist.toFixed(2)} km`
      );
    }
  };

  // Remove source and reset related state
  const removeSource = () => {
    setSource(undefined);
    setUserPickedSource(false);
    setRouteCoords([]);
    setDistanceText('');
    setDurationText('');
  };

  // Remove destination and reset related state
  const removeDestination = () => {
    setDestination(undefined);
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
              {/* Source Search Input */}
              <View style={[styles.searchContainer, { top: 15 }]}>
                <GooglePlacesAutocomplete
                  placeholder="Search Source"
                  fetchDetails
                  onPress={(data, details = null) => {
                    const loc = details?.geometry?.location;
                    if (loc) {
                      const coord = { latitude: loc.lat, longitude: loc.lng };
                      const newRegion: Region = { ...coord, latitudeDelta: 0.01, longitudeDelta: 0.01 };
                      setSource(coord);
                      setUserPickedSource(true);
                      setRegion(newRegion);
                      mapRef.current?.animateToRegion(newRegion);
                    }
                  }}
                  query={{ key: API_KEY, language: 'en' }}
                  textInputProps={{
                    placeholderTextColor: '#555',
                    style: autoCompleteStyles.textInput,
                    onFocus: () => setIsSearchFocused(true),
                    onBlur: () => setIsSearchFocused(false),
                  }}
                  enablePoweredByContainer={false}
                  styles={autoCompleteStyles}
                />
              </View>

              {/* Destination Search Input */}
              <View style={[styles.searchContainer, { top: 80 }]}>
                <GooglePlacesAutocomplete
                  placeholder="Search Destination"
                  fetchDetails
                  onPress={(data, details = null) => {
                    const loc = details?.geometry?.location;
                    if (loc) {
                      const coord = { latitude: loc.lat, longitude: loc.lng };
                      const newRegion: Region = { ...coord, latitudeDelta: 0.01, longitudeDelta: 0.01 };
                      setDestination(coord);
                      setRegion(newRegion);
                      mapRef.current?.animateToRegion(newRegion);
                    }
                  }}
                  query={{ key: API_KEY, language: 'en' }}
                  textInputProps={{
                    placeholderTextColor: '#555',
                    style: autoCompleteStyles.textInput,
                    onFocus: () => setIsSearchFocused(true),
                    onBlur: () => setIsSearchFocused(false),
                  }}
                  enablePoweredByContainer={false}
                  styles={autoCompleteStyles}
                />
              </View>

              {/* Map */}
              <MapView
                ref={mapRef}
                style={styles.map}
                region={region}
                showsUserLocation={true}
                onPress={handleMapPress}
                pointerEvents={isSearchFocused ? 'none' : 'auto'}
                customMapStyle={customMapStyle}
              >
                {source && source.latitude !== undefined && source.longitude !== undefined && (
                  <Marker coordinate={source} title="Source" pinColor="#FF5A5F" />
                )}
                {destination && destination.latitude !== undefined && destination.longitude !== undefined && (
                  <Marker coordinate={destination} title="Destination" pinColor="#00A699" />
                )}
                {routeCoords.length > 0 && (
                  <Polyline coordinates={routeCoords} strokeWidth={5} strokeColor="#007AFF" />
                )}
              </MapView>

              {/* Route Info Card */}
              {(distanceText || durationText) && (
                <View style={styles.routeInfoCard}>
                  <Text style={styles.routeInfoTitle}>Route Info</Text>
                  <Text style={styles.routeInfoText}>Distance: {distanceText || '-'}</Text>
                  <Text style={styles.routeInfoText}>Duration: {durationText || '-'}</Text>
                </View>
              )}

              {/* Buttons */}
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
                  {(['driving', 'walking', 'bicycling', 'transit'] as const).map((mode) => (
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
};

export default RideAlong;
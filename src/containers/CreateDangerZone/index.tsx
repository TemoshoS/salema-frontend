import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MapView, { Marker, Region , Circle} from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axiosInstance from '../../utils/axiosInstance';
import Header from '../../components/Header';
import { GOOGLE_API_KEY } from '@env';

const CreateDangerZone: React.FC = () => {
  const [location, setLocation] = useState<Region | null>(null);
  const [locationName, setLocationName] = useState<string>(''); // start empty
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const mapRef = useRef<MapView | null>(null);
  const autocompleteRef = useRef<any>(null);

  // Get place name from coordinates
  const getPlaceNameFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      const json = await res.json();
      if (json.results && json.results.length > 0) {
        return json.results[0].formatted_address;
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    }
    return 'Unknown Location';
  };

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
        async pos => {
          const currentLoc: Region = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setLocation(currentLoc);

          // Get location name from coords
          const placeName = await getPlaceNameFromCoords(
            pos.coords.latitude,
            pos.coords.longitude
          );
          setLocationName(placeName);

          setLoading(false);
        },
        error => {
          Alert.alert('Location Error', error.message);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    };

    requestPermissionAndGetLocation();
  }, []);

  // When user selects a place from autocomplete
  const onPlaceSelected = (data: any, details: any = null) => {
    if (details?.geometry?.location) {
      const loc = details.geometry.location;
      const newRegion: Region = {
        latitude: loc.lat,
        longitude: loc.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setLocation(newRegion);
      setLocationName(data.description); // set real name
      mapRef.current?.animateToRegion(newRegion, 1000);
      Keyboard.dismiss();
    }
  };

  const saveDangerZone = async () => {
    if (!location) {
      Alert.alert('Location not found', 'Cannot save danger zone without location.');
      return;
    }

    if (!locationName || locationName.trim() === '') {
      Alert.alert('Missing Name', 'Please select or confirm a location name before saving.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: locationName,
        type: 'Circle',
        center: {
          type: 'Point',
          coordinates: [location.latitude, location.longitude],
        },
        radius: 5000,
      };

      const response = await axiosInstance.post('/danger-zone/v1/save', payload);

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Danger zone saved successfully.');
      } else {
        Alert.alert('Error', 'Failed to save danger zone.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while saving the danger zone.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading current location...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Header title={'Map'} />

          {/* Map */}
          <View style={{ flex: 1 }}>
          <MapView
  provider={PROVIDER_GOOGLE}
  ref={mapRef}
  style={styles.map}
  region={location || undefined}
  showsUserLocation
  pointerEvents={isSearchFocused ? 'none' : 'auto'}
  onRegionChangeComplete={region => setLocation(region)}
>
  {location && (
    <>
      <Marker
        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
        title={locationName || 'Selected Location'}
        pinColor="red"
      />
      <Circle
        center={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        radius={5000} // 5 km
        strokeColor="rgba(255,90,95,0.8)"
        fillColor="rgba(255,90,95,0.2)"
      />
    </>
  )}
</MapView>



            {/* Google Places Autocomplete Search */}
            <View style={styles.searchContainer}>
              <GooglePlacesAutocomplete
                ref={autocompleteRef}
                placeholder="Search place"
                fetchDetails
                onPress={onPlaceSelected}
                query={{
                  key: GOOGLE_API_KEY,
                  language: 'en',
                }}
                textInputProps={{
                  onFocus: () => setIsSearchFocused(true),
                  onBlur: () => setIsSearchFocused(false),
                  placeholderTextColor: '#555',
                  autoCapitalize: 'none',
                }}
                enablePoweredByContainer={false}
                styles={{
                  textInputContainer: { backgroundColor: 'white', borderRadius: 5 },
                  textInput: { height: 44, color: '#000' },
                  listView: { backgroundColor: 'white' },
                }}
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveDangerZone}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Danger Zone Here'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f7fa' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    position: 'absolute',
    top: 15,
    width: '90%',
    alignSelf: 'center',
    zIndex: 1000,
  },
  map: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#FF5A5F',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateDangerZone;

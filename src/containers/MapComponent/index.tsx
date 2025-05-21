import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import CommonButton from '../../components/CommonButton';
import {MARKER} from '../../constants/assets';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';

const MapComponent = () => {
  const [region, setRegion] = useState({
    latitude: 37.78825, // Initial latitude
    longitude: -122.4324, // Initial longitude
    latitudeDelta: 0.0922, // Zoom level
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef(null);
  const navigation = useNavigation();
  // Function to handle map dragging
  const onRegionChangeComplete = region => {
    setRegion(region); // Update the map's region state
  };

  return (
    <View style={styles.mainContainer}>
      <Header title="Select Location" />
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={onRegionChangeComplete}
          onMapReady={() => console.log('Map is ready!')}>
          {/* <Marker
            draggable
            coordinate={{
              latitude: 37.7283,
              longitude: -122.3826,
            }}
            // onDragEnd={e => alert(JSON.stringify(e.nativeEvent.coordinate))}
            title={'Test Marker'}
            description={'This is a description of the marker'}
          /> */}
        </MapView>

        {/* Marker positioned at the center */}
        <View style={styles.markerFixed}>
          <Image source={MARKER} style={{width: 40, height: 40}} />
        </View>

        {/* Display selected location */}
        <View style={styles.bottomContainer}>
          <Text style={styles.locationText}>
            Selected Location: {region.latitude.toFixed(4)},{' '}
            {region.longitude.toFixed(4)}
          </Text>
        </View>
      </View>
      <CommonButton
        text="Save Location"
        onPress={() => {
          navigation.navigate('CreateRequest', {
            location: {
              latitude: region.latitude.toFixed(4),
              longitude: region.longitude.toFixed(4),
            },
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    height: '50%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerFixed: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20, // Offset to align with the center
    marginTop: -40, // Offset to align with the center
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 10,
  },
});

export default MapComponent;

import Geolocation from 'react-native-geolocation-service';
import {useState, useEffect} from 'react';
import haversine from 'haversine-distance'; // For calculating distance between coordinates
import {useAppDispatch} from '../redux/store';
import {checkDangerZone} from '../redux/dangerZoneSlice';
import {PermissionsAndroid, Platform} from 'react-native';
import { requestLocationPermission } from './location';

interface LocationType {
  latitude: number;
  longitude: number;
}
const BackgroundGeoLocation = () => {
  const [lastPosition, setLastPosition] = useState<LocationType | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const startWatching = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.error('Location permission not granted');
        return;
      }
  
      const watchId = Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const newPosition: LocationType = {latitude, longitude};
  
          if (lastPosition) {
            const distance = haversine(lastPosition, newPosition);
            if (distance >= 100) {
              dispatch(checkDangerZone(newPosition));
              setLastPosition(newPosition);
            }
          } else {
            setLastPosition(newPosition);
          }
        },
        error => console.error(error),
        {enableHighAccuracy: true, distanceFilter: 10},
      );
  
      // Cleanup
      return () => Geolocation.clearWatch(watchId);
    };
  
    startWatching();
  }, [lastPosition]);
  

  return null; // This component doesn’t need to render anything
};

export default BackgroundGeoLocation;

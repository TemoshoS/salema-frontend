import Geolocation from '@react-native-community/geolocation';
import {useState, useEffect} from 'react';
import haversine from 'haversine-distance'; // For calculating distance between coordinates
import {useAppDispatch} from '../redux/store';
import {checkDangerZone} from '../redux/dangerZoneSlice';
interface LocationType {
  latitude: number;
  longitude: number;
}
const BackgroundGeoLocation = () => {
  const [lastPosition, setLastPosition] = useState<LocationType | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Request permission (make sure permissions are handled)
    const watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const newPosition: LocationType = {latitude, longitude};

        if (lastPosition) {
          const distance = haversine(lastPosition, newPosition); // Calculate distance in meters
          if (distance >= 100) {
            // Call your API here
            // console.log('Moved 100 meters, calling API');
            dispatch(checkDangerZone(newPosition));

            setLastPosition(newPosition); // Update last position
          }
        } else {
          setLastPosition(newPosition); // Set initial position
        }
      },
      error => console.error(error),
      {enableHighAccuracy: true, distanceFilter: 10}, // Set distanceFilter to limit frequency of updates
    );

    // Clean up when the component unmounts
    return () => Geolocation.clearWatch(watchId);
  }, [lastPosition]);

  return null; // This component doesn’t need to render anything
};

export default BackgroundGeoLocation;

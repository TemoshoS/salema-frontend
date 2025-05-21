import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonButton from '../../components/CommonButton';
import Header from '../../components/Header';
import styles from './styles';
import DateTimePickerComponent from '../../components/DateTimePicker';
import {useNavigation} from '@react-navigation/native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../types';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {createServiceRequest, resetPage} from '../../redux/serviceRequestSlice';
import {fetchSecurityCompanyByID} from '../../redux/securityCompanySlice';

type CreateRequestRouteProp = RouteProp<RootStackParamList, 'CreateRequest'>;

interface CreateRequestProps {
  route: CreateRequestRouteProp;
}

const CreateRequest: React.FC<CreateRequestProps> = ({route}) => {
  const dispatch = useAppDispatch();

  const securityCompanyInfo = useAppSelector(
    state => state.securityCompany.securityCompanyDetails,
  );

  const isSuccess = useAppSelector(state => state.serviceRequest.success);
  const requestedServices = securityCompanyInfo?.servicesOffered;

  const [selectedRequest, setSelectedRequest] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const navigation = useNavigation();
  const [priority, setPriority] = useState<string>('');
  const location = route.params?.location;
  const companyId = route.params.companyId;
  const options = ['Low', 'Medium', 'High'];

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate('Home');
      dispatch(resetPage());
      Alert.alert('', 'Request Created Successfully');
    }
  }, [isSuccess]);

  const createRequest = () => {
    if (selectedRequest.length === 0) {
      Alert.alert('', 'Please select a Service');
      return;
    }

    dispatch(
      createServiceRequest({
        securityCompany: securityCompanyInfo?._id,
        requestedServices: selectedRequest,
        requestedDateTime: selectedDate,
        priority: priority.toLowerCase(),
        location: {
          latitude: location?.latitude,
          longitude: location?.longitude,
        },
        body: 'Need good security guards',
      }),
    );
  };

  useEffect(() => {
    dispatch(fetchSecurityCompanyByID(companyId));
  }, []);

  const renderItem = ({item}: {item: string}) => (
    <TouchableOpacity
      onPress={() => {
        if (!selectedRequest.includes(item)) {
          setSelectedRequest([...selectedRequest, item]);
        } else {
          setSelectedRequest(
            selectedRequest.filter(reqItem => reqItem !== item),
          );
        }
      }}
      style={[
        selectedRequest.includes(item)
          ? styles.itemRowSelected
          : styles.itemRow,
      ]}>
      <Text
        style={
          selectedRequest.includes(item) ? styles.textSelected : styles.text
        }>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <View>
        <Header title="Create Request" />
        {securityCompanyInfo ? (
          <>
            <View style={styles.container}>
              <Text style={styles.serviceText}>Select Requested Service</Text>
              <FlatList
                data={requestedServices}
                renderItem={renderItem}
                keyExtractor={item => item}
                numColumns={2} // Sets the number of columns in the grid
                columnWrapperStyle={styles.row} // Adds spacing between rows
              />
              <Text style={styles.serviceText}>Select Date of Request</Text>

              <DateTimePickerComponent
                onDateChanged={date => {
                  setSelectedDate(date);
                }}
              />

              <Text style={styles.serviceText}>Select Priority</Text>
              <View style={{flexDirection: 'row'}}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.radioContainer}
                    onPress={() => setPriority(option)}>
                    <View style={styles.radioCircle}>
                      {priority === option && (
                        <View style={styles.selectedRb} />
                      )}
                    </View>
                    <Text style={styles.radioText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Text style={styles.locationText}>
              Location:
              {location
                ? ' ' + location.latitude + ',' + location.longitude
                : ''}
            </Text>
            <CommonButton
              text={location ? 'Change Location' : 'Set Location'}
              onPress={() => navigation.navigate('MapComponent')}
            />
          </>
        ) : (
          <ActivityIndicator />
        )}
      </View>
      <CommonButton text="Create Request" onPress={createRequest} />
    </View>
  );
};
export default CreateRequest;

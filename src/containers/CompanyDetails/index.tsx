import {RouteProp, useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {RootStackParamList} from '../../types';
import Header from '../../components/Header';
import styles from './styles';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  declineSecurityCompany,
  deleteSecurityCompany,
  updateDeclineStatus,
  updateVerifyStatus,
  verifySecurityCompany,
} from '../../redux/securityCompanySlice';

type NavigationRouteProps = RouteProp<RootStackParamList, 'CompanyDetails'>;

interface NavigationProps {
  route: NavigationRouteProps;
}

const CompanyDetails: React.FC<NavigationProps> = ({route}) => {
  const {
    _id,
    companyName,
    address,
    contactPerson,
    phone,
    servicesOffered,
    branches,
    officers,
    verificationStatus,
    isVerified,
  } = route.params;
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const verifiedStatus = useAppSelector(
    state => state.securityCompany.isVerified,
  );
  const declinedStatus = useAppSelector(
    state => state.securityCompany.isDeclined,
  );

  useEffect(() => {
    if (verifiedStatus) {
      navigation.goBack();
      dispatch(updateVerifyStatus(false));
      Alert.alert('', 'Company Verified Successfully');
    }
    if (declinedStatus) {
      navigation.goBack();
      dispatch(updateDeclineStatus(false));
      Alert.alert('', 'Company declined Successfully');
    }
  }, [verifiedStatus, declinedStatus]);

  const onDeletePressed = () => {
    Alert.alert('Delete', 'Are you sure you want to verify this company?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        onPress: () => dispatch(deleteSecurityCompany(_id)),
        style: 'destructive',
      },
    ]);
  };
  const onVerifyPressed = () => {
    Alert.alert('Verify', 'Are you sure you want to verify this company?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Verify',
        onPress: () => dispatch(verifySecurityCompany(_id)),
        style: 'destructive',
      },
    ]);
  };

  const onDeclinePress = () => {
    Alert.alert('Verify', 'Are you sure you want to decline this company?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Decline',
        onPress: () => dispatch(declineSecurityCompany(_id)),
        style: 'destructive',
      },
    ]);
  };

  console.log('verificationStatus', verificationStatus);
  return (
    <View>
      <Header title="Company Details" />
      <View style={{marginTop: 10, backgroundColor: 'white', margin: 16, padding: 16, borderRadius: 12, elevation: 3}}>
        <View style={styles.row}>
          <Text style={styles.headerText}>Company Name : </Text>
          <Text style={styles.text}>{companyName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.headerText}>Address : </Text>
          <Text style={styles.text}>{address}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.headerText}>Contact Person: </Text>
          <Text style={styles.text}>{contactPerson}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.headerText}>Phone : </Text>
          <Text style={styles.text}>{phone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.headerText}>Services Offered : </Text>
          <Text numberOfLines={2} style={[styles.text, {}]}>
            {servicesOffered.join(', ')}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.headerText}>Branches : </Text>
          <Text style={styles.text}>{branches.join(', ')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.headerText}>Officers : </Text>
          <Text style={styles.text}>
            {officers.map(officer => officer.email).join(', ')}
          </Text>
        </View>
        <View style={styles.buttonRow}>
          {verificationStatus === 'unverified' ? (
            <TouchableOpacity
              onPress={onVerifyPressed}
              style={styles.verifyButton}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          ) : null}
          {verificationStatus === 'unverified' ? (
            <TouchableOpacity
              onPress={onDeclinePress}
              style={styles.declineButton}>
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={onDeletePressed}
            style={styles.deleteButton}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.buttonText}>Deactivate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default CompanyDetails;

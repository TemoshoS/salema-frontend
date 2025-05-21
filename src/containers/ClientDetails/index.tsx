import {RouteProp, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {RootStackParamList} from '../../types';
import Header from '../../components/Header';
import styles from './styles';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {deleteSecurityCompany} from '../../redux/securityCompanySlice';
import {
  getClients,
  resetUpdateClientSuccess,
  updateClient,
} from '../../redux/clientSlice';

type NavigationRouteProps = RouteProp<RootStackParamList, 'ClientDetails'>;

interface NavigationProps {
  route: NavigationRouteProps;
}

const ClientDetails: React.FC<NavigationProps> = ({route}) => {
  const {
    _id,
    firstName,
    address,
    contact,
    surname,
    emergencyContacts,
    securityCompaniesUsed,
  } = route.params;
  const dispatch = useAppDispatch();

  const [editMode, setEditMode] = useState(false);
  const [firstNameed, setFirstName] = useState(firstName);
  const [surnameed, setSurname] = useState(surname);
  const [addressed, setAddress] = useState(address);
  const [contacted, setContact] = useState(contact);

  const success = useAppSelector(state => state.client.updateSuccess);

  useEffect(() => {
    if (success) {
      setEditMode(false);
      dispatch(resetUpdateClientSuccess());
      dispatch(getClients());
    }
  }, [success]);

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
  const onEditPress = () => {
    setEditMode(true);
  };

  const onUpdatePress = () => {
    dispatch(
      updateClient({
        firstName: firstNameed,
        surname: surnameed,
        contact: contacted,
        address: addressed,
        id: _id,
      }),
    );
  };

  const onCancelPress = () => {
    setFirstName(firstName);
    setSurname(surname);
    setAddress(address);
    setContact(contact);
    setEditMode(false);
  };
  return (
    <View>
      <Header title="Client Details" />
      <View style={{marginTop: 10}}>
        <View style={styles.row}>
          <Text style={styles.headerText}>Name : </Text>
          <TextInput
            style={styles.text}
            value={firstNameed}
            editable={editMode}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.headerText}>Surname : </Text>
          <TextInput
            style={styles.text}
            value={surnameed}
            editable={editMode}
            onChangeText={setSurname}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.headerText}>Address : </Text>
          <TextInput
            style={styles.text}
            value={addressed}
            editable={editMode}
            onChangeText={setAddress}
          />
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.headerText}>Contact : </Text>
        <TextInput
          style={styles.text}
          value={contacted}
          editable={editMode}
          inputMode="numeric"
          keyboardType="number-pad"
          onChangeText={setContact}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.headerText}>Emergency Contacts : </Text>
        <Text style={styles.text}>{emergencyContacts.join(', ')}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.headerText}>Security Companies Used : </Text>
        <Text numberOfLines={2} style={[styles.text, {}]}>
          {securityCompaniesUsed.join(', ')}
        </Text>
      </View>

      {editMode ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={onUpdatePress} style={styles.verifyButton}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onCancelPress} style={styles.deleteButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={onEditPress} style={styles.verifyButton}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDeletePressed}
            style={styles.deleteButton}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.deactivateButton}>
        <Text style={styles.buttonText}>Deactivate</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ClientDetails;

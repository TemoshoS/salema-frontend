import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import styles from './styles';
import {
  resetPage,
  updateServiceRequests,
  updateServiceRequestsByOfficer,
} from '../../redux/serviceRequestSlice';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {getOfficers} from '../../redux/officerSlice';
import {OfficerType} from '../../types';
import {RoleStrings} from '../../constants/constants';

type UpdateRequestProps = {
  serviceReqID: string;
  modalVisible: boolean;
  onClosePressed: () => void;
  onSuccess: () => void;
};

const UpdateStatus: React.FC<UpdateRequestProps> = ({
  serviceReqID,
  modalVisible,
  onClosePressed,
  onSuccess,
}) => {
  const [status, setStatus] = useState<
    'Approved' | 'Rejected' | 'In-Progress' | 'Pending'
  >('Approved');
  const [selectedOfficers, setSelectedOfficers] = useState<OfficerType[]>([]);
  const [comments, setComments] = useState<string>('');
  const {officers} = useAppSelector(state => state.officers);
  const {success} = useAppSelector(state => state.serviceRequest);
  const role = useAppSelector(state => state.auth.userDetails?.role);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (role !== RoleStrings.SO) {
      dispatch(getOfficers());
    }
  }, []);
  useEffect(() => {
    if (success) {
      dispatch(resetPage());
      onSuccess();
    }
  }, [success]);

  const toggleOfficerSelection = (officer: OfficerType) => {
    if (selectedOfficers.some(o => o._id === officer._id)) {
      setSelectedOfficers(selectedOfficers.filter(o => o._id !== officer._id));
    } else {
      setSelectedOfficers([...selectedOfficers, officer]);
    }
  };

  const handleStatusChange = (
    newStatus: 'Approved' | 'Rejected' | 'In-Progress' | 'Pending',
  ) => {
    setStatus(newStatus);
  };

  const handleSave = () => {
    // Handle save action here
    if (selectedOfficers.length === 0 && role !== RoleStrings.SO) {
      Alert.alert('', 'Please select a security officer');
      return;
    }
    if (role !== RoleStrings.SO) {
      dispatch(
        updateServiceRequests({
          serviceRequestId: serviceReqID,
          status: status.toLowerCase(),
          assignedOfficers: selectedOfficers.map(item => item._id),
          body: comments,
        }),
      );
    } else {
      dispatch(
        updateServiceRequestsByOfficer({
          serviceRequestId: serviceReqID,
          status: status.toLowerCase(),
        }),
      );
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => onClosePressed()}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text style={styles.title}>Update Status</Text>
              <TouchableOpacity onPress={() => onClosePressed()}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
            {/* Status Options */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'Approved' && styles.selectedButton,
                ]}
                onPress={() => handleStatusChange('Approved')}>
                <Text
                  style={[
                    styles.buttonText,
                    status === 'Approved' && styles.buttonTextSelected,
                  ]}>
                  Approved
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'Rejected' && styles.selectedButton,
                ]}
                onPress={() => handleStatusChange('Rejected')}>
                <Text
                  style={[
                    styles.buttonText,
                    status === 'Rejected' && styles.buttonTextSelected,
                  ]}>
                  Rejected
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'Pending' && styles.selectedButton,
                ]}
                onPress={() => handleStatusChange('Pending')}>
                <Text
                  style={[
                    styles.buttonText,
                    status === 'Pending' && styles.buttonTextSelected,
                  ]}>
                  Pending
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'In-Progress' && styles.selectedButton,
                ]}
                onPress={() => handleStatusChange('In-Progress')}>
                <Text
                  style={[
                    styles.buttonText,
                    status === 'In-Progress' && styles.buttonTextSelected,
                  ]}>
                  In-Progress
                </Text>
              </TouchableOpacity>
            </View>
            {role !== RoleStrings.SO ? (
              <>
                <Text style={styles.sectionTitle}>Select Officers:</Text>
                <FlatList
                  data={officers}
                  keyExtractor={item => item._id.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={[
                        styles.officerItem,
                        selectedOfficers.some(o => o._id === item._id) &&
                          styles.selectedOfficer,
                      ]}
                      onPress={() => toggleOfficerSelection(item)}>
                      <Text
                        style={[
                          styles.officerText,
                          selectedOfficers.some(o => o._id === item._id) &&
                            styles.officerTextSelected,
                        ]}>
                        {item.profile.firstName + ' ' + item.profile.lastName}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            ) : null}
            {role !== RoleStrings.SO ? (
              <>
                {/* Comments Section */}
                <Text style={styles.sectionTitle}>Comments:</Text>
                <TextInput
                  style={styles.commentsInput}
                  placeholder="Enter additional comments"
                  multiline={true}
                  value={comments}
                  onChangeText={setComments}
                />
              </>
            ) : null}

            {/* Save Button */}
            <View style={styles.saveButtonContainer}>
              <Button title="Save" onPress={handleSave} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UpdateStatus;

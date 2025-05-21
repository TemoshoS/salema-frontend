import React, {useState, useEffect} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import CommonButton from '../../components/CommonButton';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import {RouteProp} from '@react-navigation/native';
import {OfficerProfileType, RootStackParamList} from '../../types';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {getOfficerProfile} from '../../redux/officerSlice';
import styles from './styles';
import FormTextInput from '../../components/FormTextInput';
import MultipleInput from '../../components/MultipleInput';
import {PLEASE_FILL_ALL_THE_FIELDS} from '../../constants/constants';

type OfficerProfileRouteProp = RouteProp<RootStackParamList, 'OfficerProfile'>;

interface OfficerProfileProps {
  route: OfficerProfileRouteProp;
}

const OfficerProfile: React.FC<OfficerProfileProps> = () => {
  const [officer, setOfficer] = useState<OfficerProfileType>({
    firstName: '',
    lastName: '',
    psiraNumber: '',
    phone: '',
    availabilityStatus: 'available',
    skills: [],
    experienceYears: '',
    grade: 'Select a grade',
  });

  const [isDropDownOpen, setDropDownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [isEditEnabled, setEditEnabled] = useState(false);
  const {officerProfile} = useAppSelector(state => state.officers);

  const navigation = useNavigation();
  const grades = ['A', 'B', 'C', 'D', 'E'];
  console.log('getOfficerProfile', officerProfile);
  useEffect(() => {
    dispatch(getOfficerProfile());
  }, []);

  useEffect(() => {
    setOfficer({
      firstName: officerProfile.firstName,
      lastName: officerProfile.lastName,
      psiraNumber: officerProfile.psiraNumber,
      phone: officerProfile.phone,
      availabilityStatus: officerProfile.availabilityStatus,
      skills: officerProfile.skills,
      experienceYears: officerProfile.experienceYears,
      grade: officerProfile.grade,
    });
  }, [officerProfile]);

  // useEffect(() => {
  //   if (isSuccess) {
  //     navigation.goBack();
  //     dispatch(resetPage());
  //     Alert.alert('', 'Officer Added Successfully');
  //   }
  // }, [isSuccess]);

  const addOfficerPressed = () => {
    const {
      firstName,
      lastName,
      psiraNumber,
      phone,
      skills,
      experienceYears,
      grade,
    } = officer;
    if (
      (firstName === '' ||
        lastName === '' ||
        psiraNumber === '' ||
        phone === '' ||
        skills.length === 0,
      grade !== 'Select a grade',
      experienceYears === '')
    ) {
      Alert.alert('', PLEASE_FILL_ALL_THE_FIELDS);
      return;
    }

    // dispatch(addOfficer(officer));
  };

  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        <View>
          <Header
            title="Profile"
            isEditEnabled={isEditEnabled}
            onEditPressed={() => setEditEnabled(val => !val)}
          />

          <View style={styles.container}>
            <FormTextInput
              label="First Name"
              value={officer.firstName}
              editable={isEditEnabled}
              onTextChanged={text => setOfficer({...officer, firstName: text})}
            />
            <FormTextInput
              label="Last Name"
              value={officer.lastName}
              editable={isEditEnabled}
              onTextChanged={text => setOfficer({...officer, lastName: text})}
            />
            <FormTextInput
              label="PSIRA Number"
              value={officer.psiraNumber}
              isNumeric
              editable={isEditEnabled}
              onTextChanged={text =>
                setOfficer({...officer, psiraNumber: text})
              }
            />
            <FormTextInput
              label="Phone"
              isNumeric
              editable={isEditEnabled}
              value={officer.phone}
              onTextChanged={text => setOfficer({...officer, phone: text})}
            />

            <Text style={styles.label}>Select a Grade:</Text>
            <TouchableOpacity
              disabled={!isEditEnabled}
              onPress={() => setDropDownOpen(val => !val)}
              style={styles.dropDown}>
              <Text style={styles.gradeText}>{officer.grade}</Text>
            </TouchableOpacity>
            {isDropDownOpen
              ? grades.map(item => (
                  <TouchableOpacity
                    disabled={!isEditEnabled}
                    onPress={() => {
                      setOfficer({...officer, grade: item});
                      setDropDownOpen(false);
                    }}
                    style={{
                      borderWidth: 1,
                      borderColor: '#d3d3d3',
                      padding: 12,
                      borderRadius: 5,
                      marginHorizontal: 10,
                      marginBottom: 1,
                    }}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))
              : null}

            <MultipleInput
              title="Enter a skill"
              buttonText="Add Skill"
              datas={officer.skills}
              editable={isEditEnabled}
              setDatas={skillData =>
                setOfficer({...officer, skills: skillData})
              }
            />
            <FormTextInput
              label="Experience"
              value={officer.experienceYears.toString()}
              editable={isEditEnabled}
              isNumeric
              onTextChanged={text =>
                setOfficer({...officer, experienceYears: text})
              }
            />
          </View>
        </View>
        {isEditEnabled ? (
          <CommonButton text="Update Profile" onPress={addOfficerPressed} />
        ) : null}
      </View>
    </ScrollView>
  );
};
export default OfficerProfile;

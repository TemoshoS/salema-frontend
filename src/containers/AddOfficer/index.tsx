import React, {useState, useEffect} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import CommonButton from '../../components/CommonButton';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import {RouteProp} from '@react-navigation/native';
import {Officer, RootStackParamList} from '../../types';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {addOfficer, resetPage} from '../../redux/officerSlice';
import styles from './styles';
import FormTextInput from '../../components/FormTextInput';
import MultipleInput from '../../components/MultipleInput';
import {validateEmail} from '../../utils/helper';
import {PLEASE_FILL_ALL_THE_FIELDS} from '../../constants/constants';

type AddOfficerRouteProp = RouteProp<RootStackParamList, 'AddOfficer'>;

interface AddOfficerProps {
  route: AddOfficerRouteProp;
}
const AddOfficer: React.FC<AddOfficerProps> = ({route}) => {
  const [officer, setOfficer] = useState<Officer>({
    firstName: '',
    lastName: '',
    psiraNumber: '',
    phone: '',
    availabilityStatus: 'available',
    skills: [],
    experienceYears: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: 'Select a grade',
  });
  // const [selectedGrade, setSelectedGrade] = useState<string>('Select a grade');
  const [isDropDownOpen, setDropDownOpen] = useState(false);
  const dispatch = useAppDispatch();

  const isSuccess = useAppSelector(state => state.officers.success);

  const navigation = useNavigation();
  const grades = ['A', 'B', 'C', 'D', 'E'];
  useEffect(() => {
    if (isSuccess) {
      navigation.goBack();
      dispatch(resetPage());
      Alert.alert('', 'Officer Added Successfully');
    }
  }, [isSuccess]);

  const addOfficerPressed = () => {
    const {
      firstName,
      lastName,
      psiraNumber,
      phone,
      skills,
      experienceYears,
      password,
      confirmPassword,
      email,
      grade,
    } = officer;
    if (
      (firstName === '' ||
        lastName === '' ||
        psiraNumber === '' ||
        password === '' ||
        confirmPassword === '' ||
        email === '' ||
        phone === '' ||
        skills.length === 0,
      grade !== 'Select a grade',
      experienceYears === '')
    ) {
      Alert.alert('', PLEASE_FILL_ALL_THE_FIELDS);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('', 'The password and confirmation password do not match.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Please enter a valid email address');
      return;
    }

    dispatch(addOfficer(officer));
  };

  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        <View>
          <Header title="Add Officer" />

          <View style={styles.container}>
            <FormTextInput
              label="First Name"
              value={officer.firstName}
              onTextChanged={text => setOfficer({...officer, firstName: text})}
            />
            <FormTextInput
              label="Last Name"
              value={officer.lastName}
              onTextChanged={text => setOfficer({...officer, lastName: text})}
            />
            <FormTextInput
              label="PSIRA Number"
              value={officer.psiraNumber}
              isNumeric
              onTextChanged={text =>
                setOfficer({...officer, psiraNumber: text})
              }
            />
            <FormTextInput
              label="Phone"
              isNumeric
              value={officer.phone}
              onTextChanged={text => setOfficer({...officer, phone: text})}
            />

            <Text style={styles.label}>Select a Grade:</Text>
            <TouchableOpacity
              onPress={() => setDropDownOpen(val => !val)}
              style={styles.dropDown}>
              <Text style={styles.gradeText}>{officer.grade}</Text>
            </TouchableOpacity>
            {isDropDownOpen
              ? grades.map(item => (
                  <TouchableOpacity
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
              setDatas={skillData =>
                setOfficer({...officer, skills: skillData})
              }
            />
            <FormTextInput
              label="Experience"
              value={officer.experienceYears}
              isNumeric
              onTextChanged={text =>
                setOfficer({...officer, experienceYears: text})
              }
            />
            <FormTextInput
              label="Email"
              value={officer.email}
              onTextChanged={text => setOfficer({...officer, email: text})}
            />
            <FormTextInput
              label="Password"
              value={officer.password}
              isPassword
              onTextChanged={text => setOfficer({...officer, password: text})}
            />
            <FormTextInput
              label="Confirm Password"
              value={officer.confirmPassword}
              isPassword
              onTextChanged={text =>
                setOfficer({...officer, confirmPassword: text})
              }
            />
          </View>
        </View>
        <CommonButton text="Add Officer" onPress={addOfficerPressed} />
      </View>
    </ScrollView>
  );
};
export default AddOfficer;

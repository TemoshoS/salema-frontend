import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, View} from 'react-native';
import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import CommonButton from '../../components/CommonButton';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {resetPage, securityCompanyRegister} from '../../redux/authSlice';
import MultipleInput from '../../components/MultipleInput';
import {PLEASE_FILL_ALL_THE_FIELDS} from '../../constants/constants';

interface RegisterData {
  companyName: string;
  contactPerson: string;
  phone: string;
  psiraNumber: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
  branches: string[];
  securityServices: string[];
}

export default function SecurityCompanyRegister() {
  const [registerForm, setRegisterForm] = useState<RegisterData>({
    companyName: '',
    contactPerson: '',
    phone: '',
    psiraNumber: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    branches: [],
    securityServices: [],
  });

  const dispatch = useAppDispatch();
  const {error} = useAppSelector(state => state.auth);
  useEffect(() => {
    if (error) {
      Alert.alert('', error.message);
      dispatch(resetPage());
    }
  }, [error]);

  const onSignupPressed = () => {
    const {
      companyName,
      contactPerson,
      phone,
      psiraNumber,
      email,
      address,
      password,
      confirmPassword,
      branches,
      securityServices,
    } = registerForm;

    if (
      companyName === '' ||
      contactPerson === '' ||
      password === '' ||
      confirmPassword === '' ||
      phone === '' ||
      psiraNumber === '' ||
      email === '' ||
      address === '' ||
      branches.length === 0 ||
      securityServices.length === 0
    ) {
      Alert.alert('', PLEASE_FILL_ALL_THE_FIELDS);
      return;
    } else if (password !== confirmPassword) {
      Alert.alert('', 'The password and confirmation password do not match.');
      return;
    } else {
      dispatch(
        securityCompanyRegister({
          companyName,
          contactPerson,
          phone,
          psiraNumber,
          email,
          address,
          password,
          branches,
          securityServices,
        }),
      );
    }
  };
  return (
    <View>
      <Header />
      <ScrollView style={{marginBottom: 80}}>
        <>
          <FormTextInput
            label="Company Name"
            value={registerForm.companyName}
            onTextChanged={text =>
              setRegisterForm({...registerForm, companyName: text})
            }
          />
          <FormTextInput
            label="Contact Person"
            value={registerForm.contactPerson}
            onTextChanged={text =>
              setRegisterForm({...registerForm, contactPerson: text})
            }
          />
          <FormTextInput
            label="Password"
            value={registerForm.password}
            isPassword
            onTextChanged={text =>
              setRegisterForm({...registerForm, password: text})
            }
          />
          <FormTextInput
            label="Confirm Password"
            value={registerForm.confirmPassword}
            isPassword
            onTextChanged={text =>
              setRegisterForm({...registerForm, confirmPassword: text})
            }
          />
          <FormTextInput
            label="Email"
            value={registerForm.email}
            onTextChanged={text =>
              setRegisterForm({...registerForm, email: text})
            }
          />
          <FormTextInput
            label="Address"
            value={registerForm.address}
            onTextChanged={text =>
              setRegisterForm({...registerForm, address: text})
            }
          />
          <FormTextInput
            label="Contact"
            value={registerForm.phone}
            isNumeric
            onTextChanged={text =>
              setRegisterForm({...registerForm, phone: text})
            }
          />
          <FormTextInput
            label="PSIRA Number"
            value={registerForm.psiraNumber}
            isNumeric
            onTextChanged={text =>
              setRegisterForm({...registerForm, psiraNumber: text})
            }
          />
          <MultipleInput
            title="Add Branches"
            buttonText="Add Branch"
            datas={registerForm.branches}
            setDatas={data =>
              setRegisterForm({...registerForm, branches: data})
            }
          />
          <MultipleInput
            title="Add Security Services"
            buttonText="Add Security Service"
            datas={registerForm.securityServices}
            setDatas={data =>
              setRegisterForm({...registerForm, securityServices: data})
            }
          />
          <CommonButton needTopSpace text="Sign Up" onPress={onSignupPressed} />
        </>
      </ScrollView>
    </View>
  );
}

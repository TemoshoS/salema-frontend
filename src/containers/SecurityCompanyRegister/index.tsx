import React, { useEffect, useState } from "react";
import { Alert, ScrollView, View, StyleSheet, PermissionsAndroid, Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";

import FormTextInput from "../../components/FormTextInput";
import Header from "../../components/Header";
import CommonButton from "../../components/CommonButton";
import MultipleInput from "../../components/MultipleInput";
import PhoneNumberField from "../../components/PhoneNumber/PhoneInput";

import { useAppDispatch, useAppSelector } from "../../redux/store";
import { resetPage, securityCompanyRegister } from "../../redux/authSlice";
import { PLEASE_FILL_ALL_THE_FIELDS } from "../../constants/constants";

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
    companyName: "",
    contactPerson: "",
    phone: "",
    psiraNumber: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    branches: [],
    securityServices: [],
  });

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      Alert.alert("", error.message);
      dispatch(resetPage());
    }
  }, [error]);

  // Request location permission (Android/iOS)
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "We need access to your location to register your company",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS handled in Info.plist
  };

  // Get current location
  useEffect(() => {
    (async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      Geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (error) => {
          Alert.alert("Error", "Failed to get location: " + error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    })();
  }, []);

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
      companyName === "" ||
      contactPerson === "" ||
      password === "" ||
      confirmPassword === "" ||
      phone === "" ||
      psiraNumber === "" ||
      email === "" ||
      address === "" ||
      branches.length === 0 ||
      securityServices.length === 0
    ) {
      Alert.alert("", PLEASE_FILL_ALL_THE_FIELDS);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("", "The password and confirmation password do not match.");
      return;
    }

    if (phone.length < 10) {
      Alert.alert("", "Please enter a valid phone number.");
      return;
    }

    if (!location) {
      Alert.alert("", "Location not available. Please allow location access.");
      return;
    }

    // Dispatch registration with location
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
        latitude: location.latitude,
        longitude: location.longitude,
      })
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Security Company Registration" />
      <ScrollView style={{ marginBottom: 80, paddingHorizontal: 16 }}>
        <FormTextInput
          label="Company Name"
          value={registerForm.companyName}
          onTextChanged={(text) => setRegisterForm({ ...registerForm, companyName: text })}
        />
        <FormTextInput
          label="Contact Person"
          value={registerForm.contactPerson}
          onTextChanged={(text) => setRegisterForm({ ...registerForm, contactPerson: text })}
        />
        <FormTextInput
          label="Password"
          value={registerForm.password}
          isPassword
          onTextChanged={(text) => setRegisterForm({ ...registerForm, password: text })}
        />
        <FormTextInput
          label="Confirm Password"
          value={registerForm.confirmPassword}
          isPassword
          onTextChanged={(text) => setRegisterForm({ ...registerForm, confirmPassword: text })}
        />
        <FormTextInput
          label="Email"
          value={registerForm.email}
          onTextChanged={(text) => setRegisterForm({ ...registerForm, email: text })}
        />
        <FormTextInput
          label="Address"
          value={registerForm.address}
          onTextChanged={(text) => setRegisterForm({ ...registerForm, address: text })}
        />
        <PhoneNumberField
          label="Phone Number"
          value={registerForm.phone}
          onChange={(text) => setRegisterForm({ ...registerForm, phone: text })}
        />
        <FormTextInput
          label="PSIRA Number"
          value={registerForm.psiraNumber}
          isNumeric
          onTextChanged={(text) => setRegisterForm({ ...registerForm, psiraNumber: text })}
        />
        <MultipleInput
          title="Add Branches"
          buttonText="Add Branch"
          datas={registerForm.branches}
          setDatas={(data) => setRegisterForm({ ...registerForm, branches: data })}
        />
        <MultipleInput
          title="Add Security Services"
          buttonText="Add Security Service"
          datas={registerForm.securityServices}
          setDatas={(data) => setRegisterForm({ ...registerForm, securityServices: data })}
        />
        <CommonButton needTopSpace text="Sign Up" onPress={onSignupPressed} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  phoneContainer: { width: "100%", height: 50, marginVertical: 10 },
  textContainer: { paddingVertical: 0, backgroundColor: "white" },
});

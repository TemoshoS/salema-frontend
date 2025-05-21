import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../containers/Home';
import {RootStackParamList} from '../types';
import Profile from '../containers/Profile';
import CreateRequest from '../containers/CreateRequest';
import MapComponent from '../containers/MapComponent';
import RequestList from '../containers/RequestList';
import MissingPersonEntry from '../containers/MissingPerson';
import SideModalNavigation from '../components/SideModalNavigation';
import DangerZonePopup from '../containers/DangerZonePopup';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {toggleDangerZonePopup} from '../redux/dangerZoneSlice';
import VoiceCommand from '../containers/VoiceCommand';
import EmergencyContacts from '../containers/EmergencyContacts';
import CallEmergencyService from '../containers/CallEmergencyService';
import Ecommerce from '../containers/Ecommerce';
import SelectSecurityCompany from '../containers/SelectSecurityCompany';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  const showDangerZone = useAppSelector(
    state => state.dangerZone.showDangerZonePopup,
  );
  const dispatch = useAppDispatch();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="RequestList">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="CreateRequest" component={CreateRequest} />
        <Stack.Screen name="MapComponent" component={MapComponent} />
        <Stack.Screen name="RequestList" component={RequestList} />
        <Stack.Screen name="VoiceCommand" component={VoiceCommand} />
        <Stack.Screen name="Ecommerce" component={Ecommerce} />
        <Stack.Screen
          name="MissingPersonEntry"
          component={MissingPersonEntry}
        />
        <Stack.Screen name="EmergencyContacts" component={EmergencyContacts} />
        <Stack.Screen
          name="CallEmergencyService"
          component={CallEmergencyService}
        />
        <Stack.Screen
          name="SelectSecurityCompany"
          component={SelectSecurityCompany}
        />
      </Stack.Navigator>
      <SideModalNavigation />
      {showDangerZone && (
        <DangerZonePopup
          message="You are entering a danger zone. Please proceed with caution."
          severity="high"
          onDismiss={() => dispatch(toggleDangerZonePopup(false))}
        />
      )}
    </NavigationContainer>
  );
};
export default AppNavigation;

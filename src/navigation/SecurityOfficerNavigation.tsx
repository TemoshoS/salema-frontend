import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import ClientList from '../containers/ClientList';
import SecurityCompanyList from '../containers/SecurityCompany';
import CompanyDetails from '../containers/CompanyDetails';
import RequestList from '../containers/RequestList';
import RequestDetails from '../containers/RequestDetails';
import SideModalNavigation from '../components/SideModalNavigation';
import DangerZoneList from '../containers/DangerZoneList';
import Ecommerce from '../containers/Ecommerce';
import OfficerProfile from '../containers/OfficerProfile';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function SecurityOfficerNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="RequestList">
        <Stack.Screen name="ClientList" component={ClientList} />
        <Stack.Screen
          name="SecurityCompanyList"
          component={SecurityCompanyList}
        />
        <Stack.Screen name="CompanyDetails" component={CompanyDetails} />
        <Stack.Screen name="RequestList" component={RequestList} />
        <Stack.Screen name="OfficerProfile" component={OfficerProfile} />
        <Stack.Screen name="RequestDetails" component={RequestDetails} />
        <Stack.Screen name="DangerZoneList" component={DangerZoneList} />
        <Stack.Screen name="Ecommerce" component={Ecommerce} />
      </Stack.Navigator>
      <SideModalNavigation />
    </NavigationContainer>
  );
}

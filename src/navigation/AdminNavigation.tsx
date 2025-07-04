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
import ClientDetails from '../containers/ClientDetails';
import DangerZoneList from '../containers/DangerZoneList';
import CreateDangerZone from '../containers/CreateDangerZone';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AdminStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="RequestList">
        <Stack.Screen name="ClientList" component={ClientList} />
        <Stack.Screen name="ClientDetails" component={ClientDetails} />
        <Stack.Screen
          name="SecurityCompanyList"
          component={SecurityCompanyList}
        />
        <Stack.Screen name="CompanyDetails" component={CompanyDetails} />
        <Stack.Screen name="RequestList" component={RequestList} />
        <Stack.Screen name="RequestDetails" component={RequestDetails} />
        <Stack.Screen name="DangerZoneList" component={DangerZoneList} />
        <Stack.Screen name="CreateDangerZones" component={CreateDangerZone}/>

      </Stack.Navigator>
      <SideModalNavigation />
    </NavigationContainer>
  );
}

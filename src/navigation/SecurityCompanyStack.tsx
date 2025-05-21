import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import OfficerList from '../containers/OfficerList';
import AddOfficer from '../containers/AddOfficer';
import RequestList from '../containers/RequestList';
import RequestDetails from '../containers/RequestDetails';
import SideModalNavigation from '../components/SideModalNavigation';
import Ecommerce from '../containers/Ecommerce';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function SecurityCompanyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="RequestList">
        <Stack.Screen name="RequestList" component={RequestList} />
        <Stack.Screen name="RequestDetails" component={RequestDetails} />
        <Stack.Screen name="OfficerList" component={OfficerList} />
        <Stack.Screen name="AddOfficer" component={AddOfficer} />
        
      </Stack.Navigator>
      <SideModalNavigation />
    </NavigationContainer>
  );
}

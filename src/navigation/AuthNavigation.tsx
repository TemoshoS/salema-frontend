import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../containers/Login';
import {RootStackParamList} from '../types';
import Register from '../containers/Register';
import AuthHome from '../containers/AuthHome';
import SecurityCompanyRegister from '../containers/SecurityCompanyRegister';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="AuthHome">
        <Stack.Screen name="AuthHome" component={AuthHome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen
          name="SecurityCompanyRegister"
          component={SecurityCompanyRegister}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AuthNavigation;

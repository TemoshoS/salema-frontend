import {NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../types';
import {RoleStrings} from '../../constants/constants';

type NavigationOption = {
  title: string;
  onPress: () => void;
};

type RootNavigationProp = NavigationProp<RootStackParamList>;

export const getNavigationOptions = (
  role: string | undefined,
  navigation: RootNavigationProp,
) => {
  const adminNavigationOptions: NavigationOption[] = [
    {title: 'Requests', onPress: () => navigation.navigate('RequestList')},
    {
      title: 'Security Companies',
      onPress: () => navigation.navigate('SecurityCompanyList'),
    },
    {title: 'Clients', onPress: () => navigation.navigate('ClientList')},
    {
      title: 'Danger Zones',
      onPress: () => navigation.navigate('DangerZoneList'),
    },
  ];

  const securityCompanyNavigationOptions: NavigationOption[] = [
    {title: 'Requests', onPress: () => navigation.navigate('RequestList')},
    {
      title: 'Officers',
      onPress: () => navigation.navigate('OfficerList'),
    },
    {title: 'Add Officers', onPress: () => navigation.navigate('AddOfficer')},
  ];

  const clientNavigationOptions: NavigationOption[] = [
    {title: 'Home', onPress: () => navigation.navigate('Home')},
    {title: 'Profile', onPress: () => navigation.navigate('Profile')},
    {
      title: 'Create Request',
      onPress: () => navigation.navigate('SelectSecurityCompany'),
    },
    {
      title: 'Add Missing Person',
      onPress: () => navigation.navigate('MissingPersonEntry'),
    },
    {
      title: 'Add Voice Command',
      onPress: () => navigation.navigate('VoiceCommand'),
    },
    {
      title: 'Emergency Contacts',
      onPress: () => navigation.navigate('EmergencyContacts'),
    },
    {
      title: 'E-commerce',
      onPress: () => navigation.navigate('Ecommerce'),
    },
    {
      title: 'Support',
      onPress: () => {},
    },
    {
      title: 'FAQ',
      onPress: () => {},
    },
  ];

  const officerNavigationOptions: NavigationOption[] = [
    {title: 'Requests', onPress: () => navigation.navigate('RequestList')},
    {
      title: 'Profile',
      onPress: () => navigation.navigate('OfficerProfile'),
    },
    {
      title: 'Danger Zones',
      onPress: () => navigation.navigate('DangerZoneList'),
    },
    {
      title: 'Active',
      onPress: () => {},
    },
  ];
  switch (role) {
    case RoleStrings.AD:
      return adminNavigationOptions;
    case RoleStrings.GU:
      return clientNavigationOptions;
    case RoleStrings.MG:
      return securityCompanyNavigationOptions;
    case RoleStrings.SO:
      return officerNavigationOptions;
    default:
  }
  return securityCompanyNavigationOptions;
};

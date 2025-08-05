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
    {
      title: 'Create Danger Zones',
      onPress: () => navigation.navigate('CreateDangerZones')
    }
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
   
    {title: 'Profile', onPress: () => navigation.navigate('Profile')},
    {title: 'Chat With Us', onPress: () => navigation.navigate('ChatBot')},
    {title: 'Ride Along', onPress: () => navigation.navigate('RideAlong')},
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
      title: 'Subscription',
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

interface locationProp {
  latitude: number;
  longitude: number;
}

export type RootStackParamList = {
  AuthHome: undefined;
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  CreateRequest: {location?: locationProp; companyId?: string | undefined};
  MapComponent: undefined;
  RequestList: undefined;
  MissingPersonEntry: undefined;
  ClientList: undefined;
  SecurityCompanyList: undefined;
  CompanyDetails: {
    _id: string;
    companyName: string;
    address: string;
    psiraNumber: string;
    contactPerson: string;
    phone: string;
    servicesOffered: string[];
    branches: string[];
    officers: [];
    verificationStatus: string;
    isVerified: boolean;
  };
  RequestDetails: RequestType;
  OfficerList: undefined;
  AddOfficer: undefined;
  DangerZoneList: undefined;
  VoiceCommand: undefined;
  SecurityCompanyRegister: undefined;
  EmergencyContacts: undefined;
  CallEmergencyService: undefined;
  Ecommerce: undefined;
  ClientDetails: {
    _id: string;
    firstName: string;
    address: string;
    contact: string;
    surname: string;
    emergencyContacts: string[];
    securityCompaniesUsed: string[];
  };
  SelectSecurityCompany: undefined;
  OfficerProfile: undefined;
};

export interface ClientType {
  emergencyContacts: string[];
  _id: string;
  firstName: string;
  surname: string;
  contact: string;
  address: string;
  securityCompaniesUsed: string[];
  createdAt: string;
}

export interface EmergencyContactsType {
  _id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  voiceCommandText: string;
  client: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface Officer {
  firstName: string;
  lastName: string;
  psiraNumber: string;
  phone: string;
  availabilityStatus: string;
  skills: string[];
  experienceYears: string;
  email: string;
  password: string;
  confirmPassword: string;
  grade: string;
}
export interface OfficerProfileType {
  firstName: string;
  lastName: string;
  psiraNumber: string;
  phone: string;
  availabilityStatus: string;
  skills: string[];
  experienceYears: string;
  grade: string;
}
export interface OfficerType {
  _id: string;
  email: string;
  role: string;
  permissions: string;
  profile: {
    _id: string;
    firstName: string;
    lastName: string;
    psiraNumber: string;
    phone: string;
    availabilityStatus: string;
    skills: string[];
    experienceYears: number;
  };
  isActive: boolean;
  remarks: string;
  isDeleted: boolean;
}
export interface EventsType {
  _id: string;
  eventTitle: string;
  eventBody: string;
  comments: CommentType[];
  status: string;
}

export interface RequestType {
  _id: string;
  assignedOfficers: [
    {
      _id: string;
      email: string;
      isActive: boolean;
      isDeleted: boolean;
      permissions: string;
      profile: {
        _id: string;
        availabilityStatus: string;
        experienceYears: 2;
        firstName: string;
        lastName: string;
        phone: string;
        psiraNumber: string;
        skills: string[];
      };
      remarks: '';
      role: 'SO';
    },
  ];
  body: string;
  client: string;
  createdAt: string;
  events: [];
  isDeleted: false;
  location: {coordinates: {latitude: number; longitude: number}};
  paymentId: null;
  priority: string;
  requestNumber: string;
  requestStatus: string;
  requestedDateTime: string;
  requestedServices: string[];
  securityCompany: {
    _id: string;
    email: string;
    profile: {
      _id: string;
      address: string;
      branches: string[];
      companyName: string;
      contactPerson: string;
      phone: string;
      psiraNumber: string;
      servicesOffered: string[];
    };
    updatedAt: string;
  };
}
export interface DangerZoneData {
  center: {
    type: 'Point';
    coordinates: [number, number];
  };
  _id: string;
  name: string;
  type: 'Circle' | string;
  radius: number;
  createdBy: string;
  isDeleted: boolean;
  __v: number;
}

export interface VoiceCommandsType {
  _id: string;
  emergencyContact: {
    _id: string;
    email: string;
    name: string;
    phone: string;
    relationship: string;
    voiceCommandText: string;
  };
  text: string;
  type: string;
}

export interface CommentType {
  _id: string;
  comment: string;
  createdAt: string;
  isDeleted: boolean;
  profile: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  role: string;
  updatedAt: string;
  user: string;
}

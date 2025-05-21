import {RoleStrings} from '../constants/constants';
import {
  ADMIN_SERVICE_REQUEST_ENDPOINT,
  CLIENT_SERVICE_REQUEST_ENDPOINT,
  COMPANY_SERVICE_REQUEST_ENDPOINT,
  OFFICER_SERVICE_REQUEST_ENDPOINT,
} from '../constants/urls';
import {store} from '../redux/store';

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getEndPoint = () => {
  const {auth} = store.getState();
  const role = auth.userDetails?.role;
  switch (role) {
    case RoleStrings.AD:
      return ADMIN_SERVICE_REQUEST_ENDPOINT;
    case RoleStrings.GU:
      return CLIENT_SERVICE_REQUEST_ENDPOINT;
    case RoleStrings.MG:
      return COMPANY_SERVICE_REQUEST_ENDPOINT;
    case RoleStrings.SO:
      return OFFICER_SERVICE_REQUEST_ENDPOINT;
    default:
      return ADMIN_SERVICE_REQUEST_ENDPOINT;
  }
};

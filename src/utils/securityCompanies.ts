import { store } from '../redux/store';

type SecurityCompany = { companyName: string; phone: string };
type ApiResponse = { status: string; phones: SecurityCompany[] };

export const getSecurityCompanyPhones = async (): Promise<string[]> => {
  try {
    const { auth } = store.getState();
    const token = auth?.accessToken;

    const response = await fetch('https://salema-backend1.onrender.com/security-company/v1/phones', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data: ApiResponse = await response.json();
    const validCompanies = (data.phones || []).filter(
      (company) => company.phone?.trim()
    );

    return Array.from(new Set(validCompanies.map((company) => company.phone.trim())));
  } catch (error) {
    console.error('Error fetching security companies:', error);
    return [];
  }
};

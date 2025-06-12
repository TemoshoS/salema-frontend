import axiosInstance from '../utils/axiosInstance';

export const sendSms = async (phoneNumber: string, message: string) => {
  if (!phoneNumber || phoneNumber.trim() === '') {
    console.warn('⚠️ Skipping SMS: Invalid phone number');
    return;
  }

  try {
    const response = await axiosInstance.post('/send-sms', {
      to: phoneNumber.trim(),
      message,
    });

    const data = response.data;
    if (data.success) {
      console.log(`✅ SMS sent to ${phoneNumber}`);
    } else {
      console.log(`❌ Failed to send SMS to ${phoneNumber}:`, data.error);
    }
  } catch (error: any) {
    console.error(`❌ Error sending SMS to ${phoneNumber}:`, error.response?.data || error.message);
  }
};

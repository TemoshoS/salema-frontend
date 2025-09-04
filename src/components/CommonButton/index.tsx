import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from './styles';
interface CommonButtonProps {
  text: string;
  onPress: () => void;
  needTopSpace?: boolean;
  disabled?: boolean; 
}
const CommonButton: React.FC<CommonButtonProps> = ({
  onPress,
  needTopSpace,
  text,
  disabled = false, 
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        needTopSpace ? { marginTop: 40 } : null,
        disabled ? { opacity: 0.6 } : null,
      ]}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};
export default CommonButton;

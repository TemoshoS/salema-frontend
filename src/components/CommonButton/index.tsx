import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from './styles';
interface CommonButtonProps {
  text: string;
  onPress: () => void;
  needTopSpace?: boolean;
}
const CommonButton: React.FC<CommonButtonProps> = ({
  onPress,
  needTopSpace,
  text,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, needTopSpace ? {marginTop: 40} : '']}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};
export default CommonButton;

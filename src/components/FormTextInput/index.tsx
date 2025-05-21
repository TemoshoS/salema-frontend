import React from 'react';
import {Text, View, TextInput} from 'react-native';
import styles from './styles';
interface TextInputProps {
  label: string;
  value: string | undefined;
  isPassword?: boolean;
  isHalfWidth?: boolean;
  isNumeric?: boolean;
  editable?: boolean;
  onTextChanged: (text: string) => void;
}
const FormTextInput: React.FC<TextInputProps> = ({
  label,
  value,
  isPassword,
  isHalfWidth,
  isNumeric = false,
  editable = true,
  onTextChanged,
}) => {
  return (
    <View style={[isHalfWidth ? {width: '50%'} : '', styles.container]}>
      <Text style={styles.labelText}>{label}</Text>
      <TextInput
        style={[styles.textInput]}
        secureTextEntry={isPassword}
        numberOfLines={1}
        editable={editable}
        keyboardType={isNumeric ? 'number-pad' : 'default'}
        value={value}
        onChangeText={onTextChanged}
      />
    </View>
  );
};
export default FormTextInput;

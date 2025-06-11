import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';

interface FormTextInputProps extends TextInputProps {
  label: string;
  isHalfWidth?: boolean;
  isPassword?: boolean;
  isNumeric?: boolean;
  onTextChanged: (text: string) => void;
}

const FormTextInput: React.FC<FormTextInputProps> = ({
  label,
  value,
  isPassword = false,
  isHalfWidth = false,
  isNumeric = false,
  editable = true,
  onTextChanged,
  ...rest
}) => {
  const [secure, setSecure] = useState(true);

  const toggleSecure = () => {
    setSecure(prev => !prev);
  };

  return (
    <View style={[styles.container, isHalfWidth && {width: '50%'}]}>
      <Text style={styles.labelText}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.textInput, isPassword && {paddingRight: 40}]}
          secureTextEntry={isPassword ? secure : false}
          numberOfLines={1}
          editable={editable}
          keyboardType={rest.keyboardType || (isNumeric ? 'number-pad' : 'default')}
          value={value}
          onChangeText={onTextChanged}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={toggleSecure} style={styles.iconWrapper}>
            <Icon name={secure ? 'eye-off' : 'eye'} size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormTextInput;

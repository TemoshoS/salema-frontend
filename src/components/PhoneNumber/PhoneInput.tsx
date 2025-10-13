import React, { useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { BLACK} from "../../constants/colors"; 
import { ROBOTO } from "../../constants/fonts";

interface Props {
  label: string;
  value: string;
  onChange: (phone: string) => void;
}

export default function PhoneNumberField({ label, value, onChange }: Props) {
  const phoneInput = useRef<PhoneInput>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>{label}</Text>
      <View style={styles.inputWrapper}>
        <PhoneInput
          ref={phoneInput}
          defaultCode="ZA"
          layout="first"
          value={value}
          onChangeFormattedText={(text) => onChange(text)}
          containerStyle={styles.phoneContainer}
          textContainerStyle={styles.textContainer}
          textInputStyle={styles.textInput}
          codeTextStyle={styles.textInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { margin: 10 },
  labelText: {
    color: BLACK,
    fontFamily: ROBOTO,
    fontSize: 16,
    marginBottom: 5,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  phoneContainer: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  textContainer: {
    paddingVertical: 0,
    backgroundColor: "transparent",
    borderRadius: 5,
  },
  textInput: {
    fontSize: 18,
    color: BLACK,
    padding: 10,
  },
});

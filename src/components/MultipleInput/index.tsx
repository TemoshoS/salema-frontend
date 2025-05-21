import React, {useState} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import styles from './styles';
import FormTextInput from '../FormTextInput';

interface MultiInputProps {
  title: string;
  buttonText: string;
  datas: string[];
  editable?: boolean;
  setDatas: (data: string[]) => void;
}

const MultipleInput: React.FC<MultiInputProps> = ({
  title,
  buttonText,
  datas,
  editable = false,
  setDatas,
}) => {
  const [data, setData] = useState<string>(''); // Single skill input

  const addSkill = () => {
    if (data.trim() !== '') {
      setDatas([...datas, data]); // Add skill to array
      setData(''); // Clear input field after adding
    }
  };

  const deleteData = (item: string) => {
    setDatas(datas.filter(skill => item != skill));
  };

  return (
    <View style={styles.container}>
      <FormTextInput
        label={title}
        value={data}
        editable={editable}
        onTextChanged={setData}
      />
      <TouchableOpacity
        disabled={!editable}
        style={styles.addSkillButton}
        onPress={addSkill}>
        <Text style={styles.addSkillText}>{buttonText}</Text>
      </TouchableOpacity>

      <FlatList
        data={datas}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.itemRow}>
            <Text style={styles.skillItem}>{item}</Text>
            <TouchableOpacity onPress={() => deleteData(item)}>
              <Text style={styles.skillItem}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default MultipleInput;

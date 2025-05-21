import React from 'react';
import {Text, View} from 'react-native';
import styles from './styles';

interface EmptyContainerProps {
  title: string;
}

const EmptyContainer: React.FC<EmptyContainerProps> = ({title}) => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{title}</Text>
    </View>
  );
};
export default EmptyContainer;

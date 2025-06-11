import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import { styles } from './styles';


const Ecommerce = () => {
  return (
    <View style={styles.container}>
      <Header title="E-commerce" />
      <View style={styles.content}>
        <Text style={styles.text}>🚧 This feature is still under development.</Text>
      </View>
    </View>
  );
};

export default Ecommerce;




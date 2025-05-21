import React from 'react';
import {Image, Text, View} from 'react-native';
import styles from './styles';
import {LOGO} from '../../constants/assets';

export default function LogoBanner() {
  return (
    <View style={styles.logo}>
      <Image
        source={LOGO}
        style={{width: '50%', height: '50%', resizeMode: 'center'}}
      />
    </View>
  );
}

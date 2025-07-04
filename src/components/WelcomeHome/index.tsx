import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from './styles';
import { NO, UNDRAW } from '../../constants/assets';

interface WelcomeHomeProps {
  mainIcon: any;  
}

const WelcomeHome: React.FC<WelcomeHomeProps> = ({ mainIcon }) => {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Image source={NO} style={{ width: 150, height: 150, marginBottom: -40 }} />
        <Text style={[styles.message, { paddingTop: 0, marginTop: 0, lineHeight: 16 }]}>
          Your safety just a shake away
        </Text>
      </View>

      <Image source={mainIcon} style={styles.salemaIcon} />
      <Text style={styles.heading}>"Shake to Alert"</Text>
      <Text style={styles.message}>
        In an emergency, every seconds counts, just give your phone a quick shake to send out an alert to your chosen contacts
      </Text>
      <Image source={UNDRAW} style={styles.salemaUndraw} />
    </View>
  );
};

export default WelcomeHome;

import React, {useEffect, useState} from 'react';
import {
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Switch,
  View,
  Image,
} from 'react-native';
import styles from './styles';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {toggleDrawer} from '../../redux/authSlice';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {getNavigationOptions} from './helper';
import {roles} from '../../constants/constants';

type SecurityCompanyListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SecurityCompanyList'
>;

const SideModalNavigation: React.FC = () => {
  const navigation = useNavigation<SecurityCompanyListNavigationProp>();
  const isDrawerOpen = useAppSelector(state => state.auth.isDrawerOpen);
  const role = useAppSelector(state => state.auth.userDetails?.role);
  const dispatch = useAppDispatch();
  const slideAnim = useState(new Animated.Value(-250))[0]; // Slide animation value

  const navigationOptions = getNavigationOptions(role, navigation);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    if (isDrawerOpen) {
      openModal();
    }
  }, [isDrawerOpen]);

  const openModal = () => {
    dispatch(toggleDrawer(true));
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: -250,
      duration: 300,
      useNativeDriver: false,
    }).start(() => dispatch(toggleDrawer(false)));
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isDrawerOpen}
      onRequestClose={closeModal}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.overlay}
        onPress={closeModal}
      />

      <Animated.View style={[styles.modalContent, {left: slideAnim}]}>
        <Text style={styles.modalTitle}>Menu {roles[role]}</Text>

        {navigationOptions.map((option, index) =>
          option.title == 'Active' ? (
            <View key={index} style={styles.radiocontainer}>
              <Text style={styles.radioText}>Active</Text>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          ) : (
            <TouchableOpacity
              key={index}
              style={styles.navigationButton}
              onPress={() => {
                option.onPress();
                closeModal();
              }}>
              <Text style={styles.navigationButtonText}>{option.title}</Text>
            </TouchableOpacity>
          ),
        )}
      </Animated.View>
    </Modal>
  );
};

export default SideModalNavigation;

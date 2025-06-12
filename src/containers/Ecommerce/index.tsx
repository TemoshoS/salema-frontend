import React from 'react';
import { Button, View } from 'react-native';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../../redux/store'; // adjust path to your store
import { triggerEmergencySms } from '../../utils/emergency';

// Create a typed selector hook
const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function PanicTest() {
  const userName = useTypedSelector(state => state.auth.userDetails?.name || 'Unknown User');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Trigger Panic SMS"
        onPress={() => triggerEmergencySms(userName)}
      />
    </View>
  );
}

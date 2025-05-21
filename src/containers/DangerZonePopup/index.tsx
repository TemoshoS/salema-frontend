import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

// Define the props interface for the alert banner
interface DangerZoneProps {
  message: string; // The message to display
  severity: 'low' | 'medium' | 'high'; // Severity level affects styling
  onDismiss?: () => void; // Optional callback to close the alert
}

// Main AlertBanner component
const DangerZonePopup: React.FC<DangerZoneProps> = ({
  message,
  severity,
  onDismiss,
}) => {
  // Dynamically adjust styles based on severity level
  const bannerStyle = [styles.banner, styles[severity]];

  return (
    <View style={bannerStyle}>
      <Text style={styles.message}>{message}</Text>

      {onDismiss && (
        <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
          <Text style={styles.dismissText}>Dismiss</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Styles for the banner and its elements
const styles = StyleSheet.create({
  banner: {
    padding: 16,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  dismissButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  dismissText: {
    color: '#333333',
    fontWeight: 'bold',
  },
  // Severity-based background colors
  low: {
    backgroundColor: '#FFA500', // Orange
  },
  medium: {
    backgroundColor: '#FF4500', // Dark Orange
  },
  high: {
    backgroundColor: '#FF0000', // Red
  },
});

export default DangerZonePopup;

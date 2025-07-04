import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

const fakeSubscriptions = [
  {
    productId: 'basic_plan',
    title: 'Basic Plan',
    description: 'Access limited features',
    price: 'R29.99 / month',
  },
  {
    productId: 'premium_plan',
    title: 'Premium Plan',
    description: 'Access all features with priority support',
    price: 'R59.99 / month',
  },
];

const SubscriptionScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    Alert.alert('Subscription', `You selected: ${planId}`);
    // You can save this to localStorage/AsyncStorage or backend
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        Choose a Subscription
      </Text>

      {fakeSubscriptions.map((plan) => (
        <View key={plan.productId} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18 }}>{plan.title}</Text>
          <Text>{plan.description}</Text>
          <Text style={{ fontWeight: 'bold' }}>{plan.price}</Text>
          <TouchableOpacity
            onPress={() => handleSubscribe(plan.productId)}
            style={{
              backgroundColor:
                selectedPlan === plan.productId ? '#198754' : '#20C997',
              padding: 10,
              marginTop: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>
              {selectedPlan === plan.productId ? 'Selected' : 'Subscribe'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default SubscriptionScreen;

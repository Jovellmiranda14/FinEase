import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ firstName, lastName }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Welcome to FinEase</Text>
      <Text style={{ marginTop: 10 }}>Hello, {firstName} {lastName}!</Text>
    </View>
  );
};

export default HomeScreen;

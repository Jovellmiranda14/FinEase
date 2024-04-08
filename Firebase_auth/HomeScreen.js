import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ user, handleAuthentication }) => {
  const logoutUser = async () => {
    try {
      await handleAuthentication(null, null);
      console.log('User logged out successfully!');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
        
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Welcome to FinEase</Text>
      </View>
  );
};

export default HomeScreen;

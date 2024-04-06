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
        <ImageBackground source={require('./BI.png')} style={styles.background}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Welcome</Text>
      <Text>{user.email}</Text>
      <Button title="Logout" onPress={() => handleAuthentication('', '')} color="#e74c3c" />
      </ImageBackground>
    </View>
  );
};

export default HomeScreen;

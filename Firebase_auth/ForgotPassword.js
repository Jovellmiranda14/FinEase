import React, { useState } from 'react';
import { Text, TextInput, Button, View, TouchableOpacity } from 'react-native';
import { getAuth, sendPasswordResetEmail } from '@firebase/auth';

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error.message);
      setResetMessage('Error sending password reset email. Please try again.');
    }
  };

  return (
    <View>
      <Text>Forgot Password</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <Button
        title="Reset Password"
        onPress={handleResetPassword}
        color="#3498db"
      />
      {resetMessage ? <Text>{resetMessage}</Text> : null}
      <Text>Back to Login Page?</Text>
      <TouchableOpacity onPress={onBackToLogin}>
        <Text>Login Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;

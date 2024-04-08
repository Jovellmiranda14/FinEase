import React, { useState } from 'react';
import { Text, TextInput, Button, View, TouchableOpacity } from 'react-native';
import { getAuth, sendPasswordResetEmail,fetchSignInMethodsForEmail } from '@firebase/auth';

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const auth = getAuth();

  const handleResetPassword = async () => {
    try {
      // Check if the email is registered
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        // Email is not registered
        setResetMessage('This email is not registered. Please enter a valid email.');
        return;
      }

      // Email is registered, send the reset email
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error.message);
      setResetMessage('Failed to send password reset email. Please try again.');
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
      <Text> </Text>
      <Text>Back to Login Page?</Text>
      <TouchableOpacity onPress={onBackToLogin}>
        <Text>Login Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;

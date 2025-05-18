import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, ImageBackground } from 'react-native';
import { getAuth, sendPasswordResetEmail, fetchSignInMethodsForEmail } from '@firebase/auth';
import styles from '../CSS/ForgotPasswordStyles';

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const auth = getAuth();

  const handleResetPassword = async () => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        setResetMessage('This email is not registered. Please enter a valid email.');
        return;
      }

      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset email sent. Please check your inbox.');

      setTimeout(() => {
        setResetMessage('');
      }, 60000);
    } catch (error) {
      setResetMessage('Failed to send password reset email. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('./assets/BI.png')} style={styles.backgroundImage}>
        <View style={styles.content}>
          <Text style={styles.title}>Forgot Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <CustomButton title="Reset Password" onPress={handleResetPassword} />
          {resetMessage ? <Text style={styles.resetMessage}>{resetMessage}</Text> : null}
          <Text style={styles.loginText}>Back to Login Page?</Text>
          <TouchableOpacity onPress={onBackToLogin}>
            <Text style={styles.loginLink}>Login Now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default ForgotPassword;

import React, { useState } from "react";
import {
  Text,
  TextInput,
  Button,
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
} from "react-native";
import ForgotPassword from "./ForgotPassword";
import SignUpForm from "./SignUpForm";
import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import styles from "../CSS/LoginFormStyles";
import hide_password from "./assets/hide_password.png";
import unhide_password from "./assets/unhide_password.png";

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);
const MAX_LOGIN_ATTEMPTS = 3;

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [hidePassword, setHidePassword] = useState(true);
  const auth = getAuth();
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
    } catch (error) {
      setErrorMessage("Invalid email or password.");
      setLoginAttempts(loginAttempts + 1);
      setPassword(""); // Reset password field
      if (loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
        setShowForgotPassword(true); // Redirect to forgot password screen after max attempts
      }
    }
  };

  const handleRegisterNow = () => {
    setShowSignUpForm(true);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };
  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  return (
    <View style={styles.container}>
      {showSignUpForm ? (
        <SignUpForm onBackToLogin={() => setShowSignUpForm(false)} />
      ) : showForgotPassword ? (
        <ForgotPassword onBackToLogin={handleBackToLogin} />
      ) : (
        <ImageBackground
          source={require("./assets/BI.png")}
          style={styles.backgroundImage}
        >
          <View style={styles.content}>
            <TextInput
              style={styles.emailInput}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={hidePassword}
            />
            <TouchableWithoutFeedback onPress={togglePasswordVisibility}>
              <Image
                source={hidePassword ? hide_password : unhide_password}
                style={styles.toggleIcon}
              />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password</Text>
            </TouchableWithoutFeedback>

            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}

            <CustomButton title="Login" onPress={handleLogin} />

            <TouchableOpacity onPress={handleRegisterNow}>
              <Text style={styles.registerNow}>No Account? Register Now!</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}
    </View>
  );
};
export default LoginForm;

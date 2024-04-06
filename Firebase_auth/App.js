import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDGfl7xaCepBqjcWEl0KM_EpJ4UCkw0r-Y",
  authDomain: "fir-react-a8bde.firebaseapp.com",
  projectId: "fir-react-a8bde",
  storageBucket: "fir-react-a8bde.appspot.com",
  messagingSenderId: "648258568034",
  appId: "1:648258568034:web:51d757ce7b6d50f5b0763b",
  measurementId: "G-Z53QJ36W5G"
};

const app = initializeApp(firebaseConfig);

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication, errorMessage }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Get Started with</Text>
      <Text style={styles.Brand}>FinEase</Text>
      <Text style={styles.title}>{isLogin ? '' : 'Register Now'}</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      <View style={styles.buttonContainer}>
        <Button title={isLogin ? 'Login' : 'Register Now'} onPress={handleAuthentication} color="#3498db" />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Register Now' : 'Already have an account? Login'}
        </Text>
      </View>
    </View>
  );
}

const AuthenticatedScreen = ({ user, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    </View>
  );
};

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async () => {
    // Clear previous error message
    setErrorMessage(null);

    try {
      if (!email || !password) {
        // Check if email or password is empty
        setErrorMessage('Please enter both email and password.');
        return;
      }
  
      if (user) {
        // If user is already authenticated, log out
        console.log('User logged out successfully!');
        await signOut(auth);
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Sign in
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
        } else {
          // Sign up
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
        }
      }
    } catch (error) {
      // Set the new error message
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('User not found. Please check your email or sign up.');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Email is already in use. Please use a different email or sign in.');
      } else if (error.code === 'auth/invalid-credential') {
        setErrorMessage('Invalid credentials. Please check your email and password.');
      } else {
        setErrorMessage('Authentication error: ' + error.message); // Generic error message
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
      ) : (
        <AuthScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          handleAuthentication={handleAuthentication}
          errorMessage={errorMessage}
        />
      )}
    </ScrollView>
  );
}

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Perform login logic here
    console.log('Email:', email);
    console.log('Password:', password);
    // You can send data to your backend for authentication
  };

  const handleForgotPassword = () => {
    // Implement your logic for handling forgot password here
    console.log('Forgot Password clicked');
  };

  return (
    // <ImageBackground source={require('./BI.png')} style={styles.background}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Username or Number"
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
      </View>
    // </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    width: 300,
    borderRadius: 25,
    borderWidth: 1,
    marginBottom: 10,
    marginLeft: 28,
    paddingHorizontal: 8,
    backgroundColor: '#D9D9D9',
  },
  button: {
    width: 200,
    backgroundColor: 'transparent',
    borderColor: '#D9D9D9',
    borderRadius: 25,
    borderWidth: 2,
    marginTop: 50,
    marginLeft: 70,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#D9D9D9',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#D9D9D9',
    textAlign: 'right',
    fontSize: 12,
    marginRight:43,
    textDecorationLine: 'underline',
    
  },
  authContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  Brand: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  toggleText: {
    color: '#3498db',
    textDecorationLine: 'underline',
  },
});

export default App;

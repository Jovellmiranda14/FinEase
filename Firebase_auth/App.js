import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet  } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import HomeScreen from './HomeScreen';
import ForgotPassword from './ForgotPassword';
import { getDatabase, ref, onValue } from '@firebase/database';


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
const database = getDatabase(app);

const AuthScreen = ({ isLogin }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {isLogin ? <LoginForm /> : <SignUpForm /> }
    </View>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        const fullnameRef = ref(database, `users/${user.uid}/fullname`);
        onValue(fullnameRef, (snapshot) => {
          const fullname = snapshot.val();
          const [first, last] = fullname.split(' ');
          setFirstName(first);
          setLastName(last);
        });
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async (email, password) => {
    try {
      // Authentication logic
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
      {user ? (
        <HomeScreen firstName={firstName} lastName={lastName} handleAuthentication={handleAuthentication} />
      ) : (
        <AuthScreen isLogin={isLogin} />
      )}
    </ScrollView>
  );
};

export default App;
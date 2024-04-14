import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet  } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import LoginForm from './LoginForm';
import Userprofile from './Userprofile';
import SignUpForm from './SignUpForm';
import HomeScreen from './HomeScreen';
import ForgotPassword from './ForgotPassword';
import { getDatabase, ref, onValue } from '@firebase/database';
import RecordsScreen from './RecordsScreen';
import TaskCalendarScreen from './TaskCalendarScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
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
          if (fullname) {
            const [firstName, last] = fullname.split(' ');
            setFirstName(firstName);
            setLastName(lastName);
          }
        });
      }
    });
    return () => unsubscribe();
  }, [auth]);
  
  const handleAuthentication = async (email, password) => {
    try {
      if (email === '' && password === '') {
        // If both email and password are empty, it means logout
        console.log('User logged out successfully!');
        await signOut(auth);
        return; // Exit the function after logout
      }
      if (!email || !password) {
        throw new Error('Please enter both email and password.');
      }
  
      if (user) {
        console.log('User logged out successfully!');
        await signOut(auth);
      } else {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
<NavigationContainer>
<Stack.Navigator initialRouteName={user ? "Home" : "Auth"}>
  {user ? (
    <>
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {() => <HomeScreen firstName={firstName} lastName={lastName} />}
      </Stack.Screen>
      <Stack.Screen name="Records" component={RecordsScreen} />
      <Stack.Screen name="TaskCalendar" component={TaskCalendarScreen} />
      <Stack.Screen name="Profile" component={Userprofile} />
    </>
  ) : (
    <Stack.Screen name="Auth" options={{ headerShown: false }}>
      {() => <AuthScreen isLogin={true} />}
    </Stack.Screen>
  )}
</Stack.Navigator>
</NavigationContainer>
  );
};

export default App;
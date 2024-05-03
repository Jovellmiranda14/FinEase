import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet  } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import { getDatabase, ref, onValue } from '@firebase/database';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginForm from './LoginForm';
import Userprofile from './Userprofile';
import SignUpForm from './SignUpForm';
import HomeScreen from './HomeScreen';
import ForgotPassword from './ForgotPassword';
import RecordsScreen from './RecordsScreen';
import TaskCalendarScreen from './TaskCalendarScreen';
import GoalSetting from './GoalSetting';
import Onlinebanking from './Onlinebanking';
import Investment from './Investment';
import Rewards from './Rewards';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


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
const auth = getAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
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
  

  // Function to fetch user data when authentication state changes
  const fetchUserData = (user) => {
    setUser(user);
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          // Extract and set user data
          const { firstName, lastName } = userData;
          setFirstName(firstName);
          setLastName(lastName);
        }
      });
    }
  };
  
  // Subscribe to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, fetchUserData);
    return () => unsubscribe();
  }, [auth]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Auth"}>
        {user ? (
          <>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {() => <HomeScreen firstName={firstName} lastName={lastName} />}
            </Stack.Screen>
            <Stack.Screen name="Records" component={RecordsScreen}options={{ headerShown: false }} />
            <Stack.Screen name="TaskCalendar" component={TaskCalendarScreen} />
            <Stack.Screen name="Profile" component={Userprofile}options={{ headerShown: false }}/>
            <Stack.Screen name="Goal Setting" component={GoalSetting} />
            <Stack.Screen name="Online Banking" component={Onlinebanking} />
            <Stack.Screen name="Investment" component={Investment} />
            <Stack.Screen name="Rewards" component={Rewards}/>
          </>
        ) : (
          <Stack.Screen name="Auth" options={{ headerShown: false }}>
            {() => <TaskCalendarScreen />} 
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
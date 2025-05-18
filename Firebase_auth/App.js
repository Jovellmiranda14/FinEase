import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { initializeApp } from '@firebase/app';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { getDatabase, ref, onValue } from '@firebase/database';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import firebaseConfig from './firebaseConfig';

// Forms & Screens
import LoginForm from './Forms/LoginForm';
import SignUpForm from './Forms/SignUpForm';
import ForgotPassword from './Forms/ForgotPassword';
import HomeScreen from './screens/HomeScreen';
import Userprofile from './screens/Userprofile';
import RecordsScreen from './screens/RecordsScreen';
import TaskCalendarScreen from './screens/TaskCalendarScreen';
import GoalSetting from './screens/GoalSetting';
import Onlinebanking from './screens/Onlinebanking';
import Investment from './screens/Investment';
// import Rewards from './screens/Rewards'; // Uncomment if needed

// Firebase Initialization
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const Stack = createStackNavigator();

const AuthScreen = ({ isLogin }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    {isLogin ? <LoginForm /> : <SignUpForm />}
  </View>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = ref(database, `users/${currentUser.uid}`);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Auth'}>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              options={{ headerShown: false }}
              children={() => <HomeScreen firstName={firstName} lastName={lastName} />}
            />
            <Stack.Screen name="Records" component={RecordsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="TaskCalendar" component={TaskCalendarScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Userprofile} options={{ headerShown: false }} />
            {/* <Stack.Screen name="Goal Setting" component={GoalSetting} options={{ headerShown: false }} /> */}
            <Stack.Screen name="Online Banking" component={Onlinebanking} options={{ headerShown: false }} />
            <Stack.Screen name="Investment" component={Investment} options={{ headerShown: false }} />
            {/* <Stack.Screen name="Rewards" component={Rewards} options={{ headerShown: false }} /> */}
          </>
        ) : (
          <Stack.Screen
            name="Auth"
            options={{ headerShown: false }}
            children={() => <AuthScreen isLogin={true} />}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

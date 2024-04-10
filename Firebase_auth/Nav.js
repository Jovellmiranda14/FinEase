import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';

const Nav = ({ firstName, lastName }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleSidebar}>
        <Text>☰</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.sidebarText}>{firstName} {lastName}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to FinEase</Text>
        <Text style={styles.greeting}>Hello, {firstName} {lastName}!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Set background color here
  },
  hamburger: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  hamburgerText: {
    color: 'black', // Changed the color to black
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 200,
    backgroundColor: 'pink',
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  sidebarText: {
    color: 'white',
    fontSize: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20, // Adjust this value if needed
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  greeting: {
    marginTop: 10,
  },
});

export default Nav;

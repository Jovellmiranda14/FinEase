import React, { useState, useEffect, useRef  } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Modal, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { getDatabase, ref, onValue } from '@firebase/database';
import { getDownloadURL, ref as storageRef, getStorage } from "firebase/storage";

const RecordsScreen = ({ navigation }) => {
  const [money, setMoney] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date()); // Initialize with current date
  const [category, setCategory] = useState('Income');
  const [records, setRecords] = useState([]);
  const [recordId, setRecordId] = useState(0); // Unique identifier for records
  const [totalMoney, setTotalMoney] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [user, setUser] = useState(null);


  // Function to format date as complete words (e.g., "January 1, 2023")
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleMoneyChange = (text) => {
    if (!text.trim()) {
      setMoney('0');
    } else {
      setMoney(text);
    }
  };

  const handleSourceChange = (text) => {
    setSource(text);
  };

  const handleSubmit = () => {
    let moneyValue = parseFloat(money);
    if (isNaN(moneyValue) || money.trim() === '') {
      moneyValue = 0.00;
    }

    const newRecord = {
      id: recordId, // Assign a unique ID to each record
      money: moneyValue, // Convert money to float
      source: source,
      date: date.toDateString(),
      category: category,
    };

    setRecords([...records, newRecord]);
    setRecordId(recordId + 1); // Increment record ID

    if (category === 'Income') {
      setTotalMoney(totalMoney + moneyValue);
      setTotalSaved(totalSaved + moneyValue);
    } else {
      setTotalMoney(totalMoney - moneyValue);
      setTotalSpent(totalSpent + moneyValue);
    }

    const currentDate = new Date();
    setDate(currentDate);

    setMoney('');
    setSource('');
  };

  const handleDelete = (id, money, category) => {
    const updatedRecords = records.filter(record => record.id !== id);
    setRecords(updatedRecords);

    if (category === 'Income') {
      setTotalMoney(totalMoney - money);
      setTotalSaved(totalSaved - money);
    } else {
      setTotalMoney(totalMoney + money);
      setTotalSpent(totalSpent - money);
    }
  };

  useEffect(() => {
    // Calculate initial total money based on records
    const initialTotal = records.reduce((acc, record) => {
      if (record.category === 'Income') {
        return acc + record.money;
      } else {
        return acc - record.money;
      }
    }, 0);
    setTotalMoney(initialTotal);

    // Initially display all records
    setFilteredRecords(records);
  }, [records]);

  const filterRecords = (filterType) => {
    if (filterType === 'All') {
      // If filter type is 'All', set filteredRecords to display all transactions
      setFilteredRecords(records);
    } else {
      // If filter type is 'Income' or 'Spent', filter records based on category
      const filtered = records.filter(record => record.category === filterType);
      setFilteredRecords(filtered);
    }
  };

  const database = getDatabase();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            const { firstName, lastName } = userData;
            setFirstName(firstName);
            setLastName(lastName);
          }
        });
        // Fetch profile picture URL when user is logged in
        fetchUserProfile(user.uid, setProfilePicture);
      } else {
        // Clear profile picture URL when user is logged out
        setProfilePicture(null);
      }
    });
    return () => unsubscribe();
  }, [database]);

  const handleAuthentication = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not logged in.');
      }

      console.log('User logged out successfully!');
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleSidebar = () => {
    if (isSidebarOpen) {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsSidebarOpen(false));
    } else {
      setIsSidebarOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const fetchUserProfile = async (uid, setProfilePicture) => {
    try {
      const storage = getStorage();
      const profilePictureRef = storageRef(storage, `profile-pictures/${uid}/profile-picture.jpg`);
      const url = await getDownloadURL(profilePictureRef);
      setProfilePicture(url);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      setProfilePicture(null); // Reset profile picture if fetch fails
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text></Text>
        <Text></Text>
        <Text></Text>
        <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarButton}>
          <Text style={styles.sidebarButtonText}>≡</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>Logo</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.userIcon} />
          ) : (
            <Image source={require('./assets/user-icon.png')} style={styles.userIcon} />
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Total Amount Spent:</Text>
      <Text>${totalSpent.toFixed(2)}</Text>
      <Text style={styles.title}>Total Amount Saved:</Text> 
      <Text>${totalSaved.toFixed(2)}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={money}
        onChangeText={handleMoneyChange}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Source"
        value={source}
        onChangeText={handleSourceChange}
      />
      <Text style={styles.title}>Date: {formatDate(date)}</Text>
      <View style={styles.categoryContainer}>
        <Text style={styles.title}>Transaction Type:</Text>
        <Button
          title={category === 'Income' ? 'Income' : 'Spent'}
          onPress={() => setCategory(category === 'Income' ? 'Spent' : 'Income')}
        />
      </View>

      <Button title="Submit" onPress={handleSubmit} />


      <Text style={styles.title}>Transaction Details:</Text>
      <View style={styles.categoryContainer}>
        <Button
          title="All"
          onPress={() => filterRecords('All')}
        />
        <Button
          title="Income"
          onPress={() => filterRecords('Income')}
        />
        <Button
          title="Spent"
          onPress={() => filterRecords('Spent')}
        />
      </View>

      <ScrollView  style={styles.recordsContainer}>
        {filteredRecords.slice(0).reverse().map(record => (
          <View key={record.id} style={styles.recordItem}>
            <Text>{record.category} Transaction</Text>
            <Text>Amount:${record.money.toFixed(2)}</Text>
            <Text>Source: {record.source}</Text>
            <Text>Date: {formatDate(record.date)}</Text>
            <TouchableOpacity onPress={() => handleDelete(record.id, record.money, record.category)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
{/* --------------------------------------------Sidebar-------------------------------------------- */}
      <Modal
        animationType="none"
        transparent={true}
        visible={isSidebarOpen}
        onRequestClose={toggleSidebar}
      >
        <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
            <Text style={styles.closeButton}>≤</Text>
          </TouchableOpacity>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.userIcon} />
          ) : (
            <Image source={require('./assets/user-icon.png')} style={styles.userIcon} />
          )}
          <Text style={styles.sidebarItem}>{firstName} {lastName}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} >
            <Text>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Records')} >
            <Text>TaskCalendar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('TaskCalendar')}>
            <Text>TaskCalendar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('OnlineBanking')}>
            <Text>Online Banking</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Rewards')}>
            <Text>Rewards</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('GoalSetting')}>
            <Text>Goal Setting</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Investment')}>
            <Text>Investment</Text>
          </TouchableOpacity>
          {user ? (
            <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
          ) : null}
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sidebarButton: {
    padding: 10,
  },
  sidebarButtonText: {
    fontSize: 25,
    color: 'black',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  recordsContainer: {
    marginTop: 20,
  },
  recordItem: {
    marginBottom: 10,
  },
  deleteButton: {
    color: 'red',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sidebarButton: {
    padding: 10,
  },
  sidebarButtonText: {
    fontSize: 25,
    color: 'black',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  userIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    zIndex: 1,
  },
  sidebarItem: {
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sidebarButton: {
    padding: 10,
  },
  sidebarButtonText: {
    fontSize: 25,
    color: 'black',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  userIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarItem: {
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    zIndex: 1,
  },
});



export default RecordsScreen;

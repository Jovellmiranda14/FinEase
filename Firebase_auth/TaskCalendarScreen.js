import React, { useState,useEffect, useMemo, useRef} from 'react';
import { View, Button, StyleSheet, Animated,ScrollView, Text, Modal, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { Picker } from '@react-native-picker/picker';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { getDatabase, ref, onValue } from '@firebase/database';
import { getDownloadURL, ref as storageRef, getStorage } from "firebase/storage";
import { LinearGradient } from 'expo-linear-gradient';



const getCurrentDate = () => {
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const day = currentDate.getDate().toString();
  const year = currentDate.getFullYear().toString();
  return { month, day, year };
};
const TestChart = ({ widthAndHeight, series, sliceColor, title, description, onDelete, disableDelete }) => {
  const total = series.reduce((acc, value) => acc + value, 0);
  const [chartTitle, setChartTitle] = useState(title);
  const [chartDescription, setChartDescription] = useState(description);

  const renderPercentageLabels = () => {
    const percentages = series.map((value) => ((value / total) * 100).toFixed(2));
    return series.map((value, index) => (
      <Text key={index} style={styles.percentageLabel}>
        {percentages[index]}%
      </Text>
    ));
  };

  return (
    <View style={styles.chartContainer}>

      <PieChart
        widthAndHeight={widthAndHeight}
        series={series}
        sliceColor={sliceColor}
        coverRadius={0.7} // Adjust the coverRadius to make the donut smaller
        coverFill={'#FFF'}
      />
      <View style={styles.percentageLabelsContainer}>{renderPercentageLabels()}</View>
      <TextInput
        style={styles.input}
        onChangeText={text => setChartTitle(text)}
        placeholder="Enter title"
        value={chartTitle}
      />
      <Text>{chartDescription}</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setChartDescription(text)}
        placeholder="Enter description"
        value={chartDescription}
      />
      {/* <Button title="Delete" onPress={onDelete} /> */}
    </View>
  );
};

const SummaryChart = ({ widthAndHeight, series, sliceColor }) => {
  const total = series.reduce((acc, value) => acc + value, 0);

  const renderPercentageLabels = () => {
    const percentages = series.map((value) => ((value / total) * 100).toFixed(2));
    return series.map((value, index) => (
      <Text key={index} style={styles.percentageLabel}>
        {percentages[index]}%
      </Text>
    ));
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>Summary</Text>
      <PieChart
        widthAndHeight={widthAndHeight}
        series={series}
        sliceColor={sliceColor}
        coverRadius={0.7} // Adjust the coverRadius to make the donut smaller
        coverFill={'#FFF'}
      />
      <View style={styles.percentageLabelsContainer}>{renderPercentageLabels()}</View>
    </View>
  );
};

const TaskCalendar = ({ navigation}) => {
  const { month, day, year } = getCurrentDate();
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedDay, setSelectedDay] = useState(day);
  const [selectedYear, setSelectedYear] = useState(year);
  const [profilePicture, setProfilePicture] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [user, setUser] = useState(null);


  const [charts, setCharts] = useState([
    { series: [100, 200], sliceColor: ['#000000', '#FFFFFF'], title: 'Chart 1', description: 'Description for Chart 1' }
  ]);
  const generateRandomSeries = () => {
    // Generate random numbers for the series
    const randomSeries = Array.from({ length: 2 }, () => Math.floor(Math.random() * 100));
    return randomSeries;
  };
  const handleUpdateChart = () => {
 
    const newSeries = generateRandomSeries();
    const newSliceColor = ['#000000', '#FFFFFF']; // Two colors for demonstration
    setCharts([...charts, { series: newSeries, sliceColor: newSliceColor, title: 'New Chart', description: 'New Description' }]);
  };

  const handleDeleteChart = (index) => {
    if (charts.length > 1) { // Only allow deletion if there's more than one chart
      const updatedCharts = [...charts];
      updatedCharts.splice(index, 1);
      setCharts(updatedCharts);
    } else {
    }
  };

  const totalSeries = charts.reduce((acc, chart) => {
    return chart.series.map((value, index) => (acc[index] || 0) + value);
  }, []);

  // Filter charts based on selected month and day
  const filteredCharts = useMemo(() => {
    return charts.filter((chart) => {

      return selectedMonth === month && selectedDay === day && selectedYear === year;
    });
  }, [charts, selectedMonth, selectedDay, selectedYear]);

  const database = getDatabase();
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
            setFirstName(firstName || '');
            setLastName(lastName || '');
            // Assuming fetchUserProfile fetches the profile picture based on user ID
            fetchUserProfile(user.uid, setProfilePicture);
          }
        });
      } else {
        // Clear profile picture URL when user is logged out
        setProfilePicture(null);
      }
    });
  
    return () => unsubscribe();
  }, [database]);
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

  const fetchUserProfile = async (uid, setProfilePicture) => {
    try {
      const storage = getStorage();
      const profilePictureRef = storageRef(storage, `profile-pictures/${uid}/profile-picture.jpg`);
      const url = await getDownloadURL(profilePictureRef);
      setProfilePicture(url);
    } catch (error) {
      // console.error('Error fetching profile picture:', error);
      setProfilePicture(null); // Reset profile picture if fetch fails
    }
  };

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
  return (
    <ImageBackground source={require('./assets/2ndBI.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarButton}>
            <Text style={styles.sidebarButtonText}>≡</Text>
          </TouchableOpacity>
          <Image source={require('./assets/logo-modified.png')} style={styles.logo} />
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.userIcon} />
            ) : (
              <Image source={require('./assets/user-icon.png')} style={styles.userIcon} />
            )}
          </TouchableOpacity>
        </View>
  
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {/* Render SummaryChart */}
          <SummaryChart
            widthAndHeight={200} // Size of the Circle
            series={charts[0].series}
            sliceColor={charts[0].sliceColor} 
          />
  
          <View style={styles.formContainer}>
            {/* Month Picker */}
            <Text>Month:</Text>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(itemValue, itemIndex) => setSelectedMonth(itemValue)}
              style={styles.picker}
            >
              {Array.from({ length: 12 }, (_, index) => (
                <Picker.Item key={index} label={new Date(2024, index).toLocaleString('en-US', { month: 'long' })} value={index + 1} />
              ))}
            </Picker>
  
            {/* Day Picker */}
            <Text>Day:</Text>
            <Picker
              selectedValue={selectedDay}
              onValueChange={(itemValue, itemIndex) => setSelectedDay(itemValue)}
              style={styles.picker}
            >
              {Array.from({ length: 31 }, (_, index) => (
                <Picker.Item key={index} label={(index + 1).toString()} value={index + 1} />
              ))}
            </Picker>
  
            {/* Year Picker */}
            <Text>Year:</Text>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
              style={styles.picker}
            >
              {Array.from({ length: 10 }, (_, index) => 2024 - index).map((year) => (
                <Picker.Item key={year} label={year.toString()} value={year.toString()} />
              ))}
            </Picker>
  
            {/* Render TestCharts */}
            {charts.map((chart, index) => (
              <TestChart
                key={index}
                widthAndHeight={150}
                series={chart.series}
                sliceColor={chart.sliceColor}
                onDelete={() => handleDeleteChart(index)}
                disableDelete={charts.length === 1} 
                // Disable delete button if only one chart is present
                // Temporary part
              />
            ))}
            <Button title="Add Chart" onPress={handleUpdateChart} />
          </View>
        </ScrollView>

       <Modal
       animationType="none"
       transparent={true}
       visible={isSidebarOpen}
       onRequestClose={toggleSidebar}
     >
       <LinearGradient
         colors={['rgba(16,42,96,0.97)', 'rgba(49,32,109,0.97)']}
         style={[styles.sidebar, { left: isSidebarOpen ? 0 : -300 }]}
       >
     <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
       <Image source={require('./assets/left_arrow.png')} />
     </TouchableOpacity>
         {profilePicture ? (
           <Image source={{ uri: profilePicture }} style={styles.sidebarIcon} />
         ) : (
           <Image source={require('./assets/user-icon.png')} style={styles.sidebarIcon} />
         )}
         <Text style={styles.sidebarName}>{firstName} {lastName}</Text>
         <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.sidebarItem}>
         <View style={styles.buttonContainer}>
                 <Text style={styles.buttonText}>Home</Text>
               </View>
       </TouchableOpacity>
         <TouchableOpacity onPress={() => navigation.navigate('Records')} style={styles.sidebarItem}>
           <View style={styles.buttonContainer}>
             <Text style={styles.buttonText}>Records</Text>
           </View>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => navigation.navigate('TaskCalendar')} style={styles.sidebarItem}>
           <View style={styles.buttonContainer}>
             <Text style={styles.buttonText}>TaskCalendar</Text>
           </View>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => navigation.navigate('Online Banking')} style={styles.sidebarItem}>
           <View style={styles.buttonContainer}>
             <Text style={styles.buttonText}>Online Banking</Text>
           </View>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => navigation.navigate('Rewards')} style={styles.sidebarItem}>
           <View style={styles.buttonContainer}>
             <Text style={styles.buttonText}>Rewards</Text>
           </View>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => navigation.navigate('Goal Setting')} style={styles.sidebarItem}>
           <View style={styles.buttonContainer}>
             <Text style={styles.buttonText}>Goal Setting</Text>
           </View>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => navigation.navigate('Investment')} style={[styles.sidebarItem, { marginBottom: 20 }]}>
           <View style={styles.buttonContainer}>
             <Text style={styles.buttonText}>Investment</Text>
           </View>
         </TouchableOpacity>
           <TouchableOpacity onPress={handleAuthentication} style={[styles.buttonContainer, { position: 'absolute', bottom: 20 }]}>
             <Text style={styles.buttonText}>Logout</Text>
           </TouchableOpacity>

       </LinearGradient>
     </Modal>
     </View>
     </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    margin: 10,
  },
  percentageLabelsContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%', // Position the container at the vertical center of the donut
    left: '50%', // Position the container at the horizontal center of the donut
    transform: [{ translateX: -10 }, { translateY: -10 }], // Adjust translation to center the labels
  },
  percentageLabel: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    paddingLeft: 10,
  }, //Sidebar
  logo: {
    height: 50,
    width: 50,
    top: 10,
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
    top: 10,
  },
  sidebarButtonText: {
    fontSize: 35,
    color: 'white',
    top: 10,
  },
  
  sidebarButton: {
    padding: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 22,
    left: 22,
    padding: 1,
    borderRadius: 5,
    zIndex: 1,
  },
  sidebarItem: {
    marginBottom: 10, 
    color: 'white',
    textAlign: "center",
    width: '100%',
  },
  sidebarIcon: {
    width: 85,
    height: 85,
    borderRadius: 55,
    marginRight: 4,
    top: -45,
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
  buttonContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },    
  sidebarName: {
    marginBottom: 10,
    fontSize: 18, 
    color: 'white',
    textAlign: "center",
    width: '100%',
    top: -35,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default TaskCalendar;
import React, { useState,useEffect, useMemo, useRef} from 'react';
import { View, Button, StyleSheet, Animated,ScrollView, Text, Modal, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { Picker } from '@react-native-picker/picker';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { getDatabase, ref, onValue } from '@firebase/database';
import { getDownloadURL, ref as storageRef, getStorage } from "firebase/storage";
import { LinearGradient } from 'expo-linear-gradient';




// const getCurrentDate = () => {
//   const currentDate = new Date();
//   const month = currentDate.toLocaleString('default', { month: 'long' });
//   const day = currentDate.getDate().toString();
//   const year = currentDate.getFullYear().toString();
//   return { month, day, year };
// };

// const SummaryChart = ({ widthAndHeight, series, sliceColor }) => {
//   const total = series.reduce((acc, value) => acc + value, 0);

//   const renderPercentageLabels = () => {
//     // Find the index of the maximum value in the series
//     const maxIndex = series.reduce((maxIndex, currentValue, currentIndex) => {
//       return currentValue > series[maxIndex] ? currentIndex : maxIndex;
//     }, 0);

//     // Calculate percentage for the maximum value
//     const maxPercentage = ((series[maxIndex] / total) * 100).toFixed(0);

//     // Return the Text component with the percentage of the maximum value
//     return (
//       <Text key={maxIndex}>
//         {maxPercentage}%
//       </Text>
//     );
//   };

//   return (
//     <View>
//       <Text>Summary</Text>
//       <PieChart
//         widthAndHeight={widthAndHeight}
//         series={series}
//         sliceColor={sliceColor}
//         coverRadius={0.7} // Adjust the coverRadius to make the donut smaller
//         coverFill={'#FFF'}
//       />
//       <View>{renderPercentageLabels()}</View>
//     </View>
//   );
// };

const TaskCalendar = ({ navigation }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newChartTitle, setNewChartTitle] = useState('');
  const [newChartDescription, setNewChartDescription] = useState('');
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [user, setUser] = useState(null);
  const [charts, setCharts] = useState([
    { series: [100, 200], sliceColor: ['#000000', '#FFFFFF'], newChartTitle: 'Initial Chart', newChartDescription: 'This is the initial chart' }
  ]);

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

  const generateRandomSeries = () => {
    return Array.from({ length: 2 }, () => Math.floor(Math.random() * 100));
  };

  const handleUpdateChart = () => {
    const newSeries = generateRandomSeries();
    const newSliceColor = ['#000000', '#FFFFFF'];
    setCharts([...charts, { series: newSeries, sliceColor: newSliceColor, newChartTitle: newChartTitle, newChartDescription: newChartDescription }]);
  };

  const handleDeleteChart = (index) => {
    if (charts.length > 1) {
      const updatedCharts = [...charts];
      updatedCharts.splice(index, 1);
      setCharts(updatedCharts);
    }
  };

  const fetchUserProfile = async (uid) => {
    try {
      const storage = getStorage();
      const profilePictureRef = storageRef(storage, `profile-pictures/${uid}/profile-picture.jpg`);
      const url = await getDownloadURL(profilePictureRef);
      setProfilePicture(url);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      setProfilePicture(null);
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

  useEffect(() => {
    const auth = getAuth();
    const database = getDatabase();

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
            fetchUserProfile(user.uid);
          }
        });
      } else {
        setProfilePicture(null);
      }
    });

    return () => unsubscribe();
  }, []);

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

        <ScrollView>
          <View>
            <View style={styles.chartContainer}>
              <View style={styles.overallProgressContainer}>
                <View style={styles.overallProgressTextContainer}>
                  <Text style={styles.overallProgressText}>Overall Progress</Text>
                </View>
                <PieChart
                  widthAndHeight={150}
                  series={[70, 30]}  // Example data for overall progress
                  sliceColor={['#4CAF50', '#FF5722']}  // Example colors
                  coverRadius={0.7}
                  coverFill={'#FFF'}
                />
              </View>
            </View>


            <TextInput
              onChangeText={setNewChartTitle}
              placeholder="Title"
              value={newChartTitle}
              style={[styles.input, { borderRadius: 15, backgroundColor: '#FFF' }]} // Update the borderRadius and backgroundColor here
            />
            <TextInput
              onChangeText={setNewChartDescription}
              placeholder="Description"
              value={newChartDescription}
              style={[styles.input, { borderRadius: 15, backgroundColor: '#FFF' }]} // Update the borderRadius and backgroundColor here
            />
<TouchableOpacity onPress={handleUpdateChart} style={[styles.buttonContainer, { maxWidth: 200, alignSelf: 'center' }]}>
  <Text style={styles.buttonText}>Add Chart</Text>
</TouchableOpacity>

            {charts.map((chart, index) => (
              <View key={index} style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Title: {chart.newChartTitle}</Text>
                <Text style={styles.chartDescription}>Description: {chart.newChartDescription}</Text>
                <PieChart
                  widthAndHeight={150}
                  series={chart.series}
                  sliceColor={chart.sliceColor}
                  coverRadius={0.7}
                  coverFill={'#FFF'}
                />
                <Button title="Delete Chart" onPress={() => handleDeleteChart(index)} />
              </View>
            ))}
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
              <Image source={{ uri:profilePicture }} style={styles.sidebarIcon} />
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
    backgroundColor: 'transparent', // Set background color to transparent to allow the background image to show through
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sidebarButton: {
    padding: 10,
  },
  sidebarButtonText: {
    fontSize: 35,
    color: 'white',
    top: 10,
  },
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
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    borderRadius: 20,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  sidebarItem: {
    marginBottom: 10,
    color: 'white',
    textAlign: "center",
    width: '100%',
  },
  sidebarName: {
    marginBottom: 10,
    fontSize: 18,
    color: 'white',
    textAlign: "center",
    width: '100%',
    top: -35,
  },
  closeButton: {
    position: 'absolute',
    top: 22,
    left: 22,
    padding: 1,
    borderRadius: 5,
    zIndex: 1,
  },
  sidebarIcon: {
    width: 85,
    height: 85,
    borderRadius: 55,
    marginRight: 4,
    top: -45,
  },
  overallProgressContainer: {
    alignItems: 'center',
  },
  overallProgressTextContainer: {
    backgroundColor: '#2C59B4',
    padding: 10,
    borderRadius: 10,
    position: 'absolute',
    top: -40,
    zIndex: 1,
  },
  overallProgressText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chartDescription: {
    marginBottom: 10,
  },
  input: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 15, // Make the text box rectangular but circular on the edges
  },
  buttonContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20, // Soft circular edge
    marginBottom: 10,
    backgroundColor: '#4B2FAC', // Background color
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
  },
});

export default TaskCalendar;

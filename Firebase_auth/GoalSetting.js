import React, { useState } from 'react';
import { View, Button } from 'react-native';
// Import the TestChart component

const App = () => {
  const [userSeries, setUserSeries] = useState([100, 200, 300]);
  const [userSliceColor, setUserSliceColor] = useState(['#ff5733', '#33ff57', '#5733ff']);

  const handleUpdateChart = () => {
    // Update userSeries and userSliceColor based on user input
    // For demonstration, let's assume new values are retrieved from user input
    const newSeries = [150, 250, 350];
    const newSliceColor = ['#ff9100', '#ff6c00', '#ff3c00'];
    setUserSeries(newSeries);
    setUserSliceColor(newSliceColor);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TestChart
        widthAndHeight={250}
        series={userSeries}
        sliceColor={userSliceColor}
      />
      <Button title="Update Chart" onPress={handleUpdateChart} />
    </View>
  );
};

export default App;

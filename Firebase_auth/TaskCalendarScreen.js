import React, { useState, useMemo } from 'react';
import { View, Button, StyleSheet, ScrollView, Text, TextInput } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { Picker } from '@react-native-picker/picker';

const TestChart = ({ widthAndHeight, series, sliceColor, title, description, onDelete }) => {
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
      <Text style={styles.title}>{chartTitle}</Text>
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
      <Button title="Delete" onPress={onDelete} />
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

const TaskCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedDay, setSelectedDay] = useState('1');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [charts, setCharts] = useState([
    { series: [100, 200], sliceColor: ['#000000', '#FFFFFF'], title: 'Chart 1', description: 'Description for Chart 1' }
  ]);
  const generateRandomSeries = () => {
    // Generate random numbers for the series
    const randomSeries = Array.from({ length: 2 }, () => Math.floor(Math.random() * 100));
    return randomSeries;
  };
  const handleUpdateChart = () => {
    // For demonstration, let's assume new series values are retrieved from elsewhere
    const newSeries = generateRandomSeries();
    const newSliceColor = ['#000000', '#FFFFFF']; // Two colors for demonstration
    setCharts([...charts, { series: newSeries, sliceColor: newSliceColor, title: 'New Chart', description: 'New Description' }]);
  };

  const handleDeleteChart = (index) => {
    const updatedCharts = [...charts];
    updatedCharts.splice(index, 1);
    setCharts(updatedCharts);
  };

  const totalSeries = charts.reduce((acc, chart) => {
    return chart.series.map((value, index) => (acc[index] || 0) + value);
  }, []);

  // Filter charts based on selected month and day
  const filteredCharts = useMemo(() => {
    return charts.filter((chart) => {
      // You may need to adjust the logic here based on your requirements
      // For demonstration, we're assuming all charts belong to January 1, 2024
      return selectedMonth === 'January' && selectedDay === '1' && selectedYear === '2024';
    });
  }, [charts, selectedMonth, selectedDay, selectedYear]);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <SummaryChart
        widthAndHeight={200} // Size of the Circle
        series={totalSeries}
        sliceColor={['#FF5733', '#33FF57']} // Two colors for demonstration
      />

      <View style={styles.container}>
        <Text>Month:</Text>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(itemValue, itemIndex) => setSelectedMonth(itemValue)}
          style={{ height: 50, width: 150 }}
        >
          <Picker.Item label="January" value="January" />
          <Picker.Item label="February" value="February" />
          <Picker.Item label="March" value="March" />
          <Picker.Item label="April" value="April" />
          <Picker.Item label="May" value="May" />
          <Picker.Item label="June" value="June" />
          <Picker.Item label="July" value="July" />
          <Picker.Item label="August" value="August" />
          <Picker.Item label="September" value="September" />
          <Picker.Item label="October" value="October" />
          <Picker.Item label="November" value="November" />
          <Picker.Item label="December" value="December" />
        </Picker>
        <Text>Day:</Text>
        <Picker
          selectedValue={selectedDay}
          onValueChange={(itemValue, itemIndex) => setSelectedDay(itemValue)}
          style={{ height: 50, width: 150 }}
        >
          {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
            <Picker.Item key={day} label={day.toString()} value={day.toString()} />
          ))}
        </Picker>
        <Text>Year:</Text>
        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
          style={{ height: 50, width: 150 }}
        >
          {Array.from({ length: 10 }, (_, index) => 2024 - index).map((year) => (
            <Picker.Item key={year} label={year.toString()} value={year.toString()} />
          ))}
        </Picker>
        {filteredCharts.map((chart, index) => (
          <TestChart
            key={index}
            widthAndHeight={150}  // Size of the Circle
            series={chart.series}
            sliceColor={chart.sliceColor}
            title={chart.title}
            description={chart.description}
            onDelete={() => handleDeleteChart(index)} // Pass delete function
          />
        ))}
        <Button title="Add Chart" onPress={handleUpdateChart} />
      </View>
    </ScrollView>
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
  },
});

export default TaskCalendar;

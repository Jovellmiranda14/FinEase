import React, { useState, useMemo, useRef } from 'react';
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
        onChangeText={(text) => setChartTitle(text)}
        placeholder="Enter title"
        value={chartTitle}
      />
      <Text>{chartDescription}</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setChartDescription(text)}
        placeholder="Enter description"
        value={chartDescription}
      />
      <Button title="Delete" onPress={onDelete} />
    </View>
  );
};
const getMonthName = (monthIndex) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
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
    setCharts([
      ...charts,
      { series: newSeries, sliceColor: newSliceColor, title: 'New Chart', description: 'New Description' }
    ]);
  };

  const handleDeleteChart = (index) => {
    const updatedCharts = [...charts];
    updatedCharts.splice(index, 1);
    setCharts(updatedCharts);
  };

  const totalSeries = useMemo(() => {
    return charts.reduce((acc, chart) => {
      return chart.series.map((value, index) => (acc[index] || 0) + value);
    }, []);
  }, [charts]);

  const filteredCharts = useMemo(() => {
    return charts.filter((chart) => {
      const [chartMonth, chartDay, chartYear] = chart.title.split(' '); // Assuming chart title format is "Month Day Year"
      return (
        chartMonth === selectedMonth &&
        chartDay === selectedDay &&
        chartYear === selectedYear
      );
    });
  }, [charts, selectedMonth, selectedDay, selectedYear]);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Summary</Text>
        <PieChart
          widthAndHeight={200}
          series={totalSeries}
          sliceColor={['#FF5733', '#33FF57']}
          coverRadius={0.7}
          coverFill={'#FFF'}
        />
      </View>

      <View style={styles.container}>
        <Text>Month:</Text>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          style={{ height: 50, width: 150 }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <Picker.Item key={i} label={getMonthName(i)} value={getMonthName(i)} />
          ))}
        </Picker>

        <Text>Day:</Text>
        <Picker
          selectedValue={selectedDay}
          onValueChange={(itemValue) => setSelectedDay(itemValue)}
          style={{ height: 50, width: 150 }}
        >
          {Array.from({ length: 31 }, (_, i) => (
            <Picker.Item key={i + 1} label={(i + 1).toString()} value={(i + 1).toString()} />
          ))}
        </Picker>

        <Text>Year:</Text>
        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
          style={{ height: 50, width: 150 }}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <Picker.Item key={2024 - i} label={(2024 - i).toString()} value={(2024 - i).toString()} />
          ))}
        </Picker>

        {filteredCharts.map((chart, index) => (
          <TestChart
            key={index}
            widthAndHeight={150}
            series={chart.series}
            sliceColor={chart.sliceColor}
            title={chart.title}
            description={chart.description}
            onDelete={() => handleDeleteChart(index)}
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
    marginTop: 20,
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
    marginVertical: 10,
  },
  percentageLabelsContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
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
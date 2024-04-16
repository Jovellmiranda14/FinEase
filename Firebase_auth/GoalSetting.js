import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-svg-charts';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';

const FinancialManagement = () => {
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [expenses, setExpenses] = useState('');
  const [investments, setInvestments] = useState('');
  const [savingGoals, setSavingGoals] = useState('');
  const [retirementGoals, setRetirementGoals] = useState('');

  const handleSubmit = () => {
    // Handle form submission here
    console.log('Monthly Budget:', monthlyBudget);
    console.log('Expenses:', expenses);
    console.log('Investments:', investments);
    console.log('Saving Goals:', savingGoals);
    console.log('Retirement Goals:', retirementGoals);
    // You can perform further actions like sending the data to a server, etc.
  };

  // Dummy data for the bar chart
  const data = [
    {
      value: parseFloat(monthlyBudget),
      label: 'Monthly Budget',
    },
    {
      value: parseFloat(expenses),
      label: 'Expenses',
    },
    {
      value: parseFloat(investments),
      label: 'Investments',
    },
    {
      value: parseFloat(savingGoals),
      label: 'Saving Goals',
    },
    {
      value: parseFloat(retirementGoals),
      label: 'Retirement Goals',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Financial Management</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={monthlyBudget}
          onValueChange={(value) => setMonthlyBudget(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Monthly Budget" value="" />
          <Picker.Item label="Less than $500" value="<500" />
          <Picker.Item label="$500 - $1000" value="500-1000" />
          <Picker.Item label="More than $1000" value=">1000" />
        </Picker>
        <Picker
          selectedValue={expenses}
          onValueChange={(value) => setExpenses(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Expenses" value="" />
          <Picker.Item label="High" value="High" />
          <Picker.Item label="Moderate" value="Moderate" />
          <Picker.Item label="Low" value="Low" />
        </Picker>
        <Picker
          selectedValue={investments}
          onValueChange={(value) => setInvestments(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Investments" value="" />
          <Picker.Item label="Aggressive" value="Aggressive" />
          <Picker.Item label="Moderate" value="Moderate" />
          <Picker.Item label="Conservative" value="Conservative" />
        </Picker>
        <Picker
          selectedValue={savingGoals}
          onValueChange={(value) => setSavingGoals(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Saving Goals" value="" />
          <Picker.Item label="Short-term" value="Short-term" />
          <Picker.Item label="Medium-term" value="Medium-term" />
          <Picker.Item label="Long-term" value="Long-term" />
        </Picker>
        <Picker
          selectedValue={retirementGoals}
          onValueChange={(value) => setRetirementGoals(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Retirement Goals" value="" />
          <Picker.Item label="Retire Early" value="Retire Early" />
          <Picker.Item label="Retire Comfortably" value="Retire Comfortably" />
          <Picker.Item label="Financial Independence" value="Financial Independence" />
        </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
      <View style={styles.chartContainer}>
        <BarChart
          style={{ height: 200 }}
          data={data}
          svg={{ fill: 'rgb(134, 65, 244)' }}
          contentInset={{ top: 30, bottom: 30 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '45%',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
  },
});

export default FinancialManagement;

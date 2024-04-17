import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecordsScreen = () => {
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

  return (
    <View style={styles.container}>
      <Text> </Text>
      <Text> </Text>
      <Text></Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
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
});

export default RecordsScreen;

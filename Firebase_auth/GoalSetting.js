import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';

const GoalSettingScreen = () => {
  const [headerText, setHeaderText] = useState('My Goals');
  const [goals, setGoals] = useState([  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newHeaderText, setNewHeaderText] = useState('');

  const handleGoalCompletion = (goalId) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
  };

  const calculateProgress = () => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter((goal) => goal.completed).length;
    return totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
  };

  const handleAddGoal = () => {
    if (newTitle.trim() !== '' && newDescription.trim() !== '') {
      const newId = goals.length + 1;
      const newGoalObj = { id: newId, title: newTitle, description: newDescription, completed: false };
      setGoals([...goals, newGoalObj]);
      setNewTitle('');
      setNewDescription('');
    }
  };

  const handleChangeHeaderText = () => {
    if (newHeaderText.trim() !== '') {
      setHeaderText(newHeaderText);
      setNewHeaderText('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{headerText}</Text>
      <View style={styles.addGoalContainer}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={newTitle}
          onChangeText={(text) => setNewTitle(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description of the Goal"
          value={newDescription}
          onChangeText={(text) => setNewDescription(text)}
        />
        <Button title="Add Goal" onPress={handleAddGoal} />
      </View>
      {goals.map((goal) => (
        <View key={goal.id} style={styles.goalContainer}>
          <Text style={styles.goalText}>{`${goal.title}: ${goal.description}`}</Text>
          <TouchableOpacity
            style={[styles.checkbox, goal.completed && styles.completedCheckbox]}
            onPress={() => handleGoalCompletion(goal.id)}
          >
            {goal.completed && <View style={styles.checkmark} />}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  changeHeaderTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 8,
  },
  addGoalContainer: {
    marginBottom: 20,
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalText: {
    flex: 1,
    fontSize: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
  },
  completedCheckbox: {
    backgroundColor: '#007BFF',
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  progressContainer: {
    marginTop: 20,
    width: '80%',
  },
  progressText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default GoalSettingScreen;

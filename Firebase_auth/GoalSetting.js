import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ProgressBarAndroid, TextInput, Button } from 'react-native';

const GoalSettingScreen = () => {
  const [goals, setGoals] = useState([
    { id: 1, description: 'Complete task 1', completed: false },
    { id: 2, description: 'Achieve milestone 2', completed: false },
    { id: 3, description: 'Learn new skill', completed: false },
    { id: 4, description: 'Read a book', completed: false },
  ]);
  const [newGoal, setNewGoal] = useState('');

  const handleGoalCompletion = (goalId) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
  };

  const calculateProgress = () => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter((goal) => goal.completed).length;
    return totalGoals > 0 ? completedGoals / totalGoals : 0;
  };

  const handleAddGoal = () => {
    if (newGoal.trim() !== '') {
      const newId = goals.length + 1;
      const newGoalObj = { id: newId, description: newGoal, completed: false };
      setGoals([...goals, newGoalObj]);
      setNewGoal('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Goals</Text>
      {goals.map((goal) => (
        <TouchableOpacity
          key={goal.id}
          style={[styles.goalItem, goal.completed && styles.completedGoal]}
          onPress={() => handleGoalCompletion(goal.id)}
        >
          <Text style={styles.goalText}>
            {goal.description} {goal.completed ? '✓' : '◻️'}
          </Text>
        </TouchableOpacity>
      ))}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Progress: {Math.round(calculateProgress() * 100)}%</Text>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={calculateProgress()}
          style={styles.progressBar}
        />
      </View>
      <View style={styles.addGoalContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter new goal"
          value={newGoal}
          onChangeText={(text) => setNewGoal(text)}
        />
        <Button title="Add Goal" onPress={handleAddGoal} />
      </View>
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
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  completedGoal: {
    backgroundColor: '#CFF6FF',
    borderColor: '#007BFF',
  },
  goalText: {
    fontSize: 16,
    marginRight: 10,
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
  progressBar: {
    height: 10,
  },
  addGoalContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 8,
  },
});

export default GoalSettingScreen;

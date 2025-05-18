import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import styles from './GoalSettingStyles';

const GoalSettingScreen = () => {
  const [headerText, setHeaderText] = useState('My Goals');
  const [goals, setGoals] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newHeaderText, setNewHeaderText] = useState('');

  const handleGoalCompletion = (goalId) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{headerText}</Text>
      <View style={styles.addGoalContainer}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Description of the Goal"
          value={newDescription}
          onChangeText={setNewDescription}
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

export default GoalSettingScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Workout } from '../utils/workout'; // your shared type
import AsyncStorage from '@react-native-async-storage/async-storage'; // if storing userId

export default function History() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchWorkouts = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId'); // or however you store it
      if (!userId) return;

      const res = await fetch(`http://your-backend-url/api/workouts?userId=${userId}`);
      const data = await res.json();
      setWorkouts(data);
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (workouts.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No workout history found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={workouts}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('WorkoutDetail', { workout: item })}
          style={{
            padding: 12,
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Workout on {new Date(item.date).toLocaleDateString()}</Text>
          <Text>Duration: {Math.floor(item.duration / 60)} min</Text>
          <Text>Total Exercises: {item.exercises.length}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

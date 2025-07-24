import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { Workout } from '../utils/workout';

type Props = {
  workout: Workout;
};

export default function WorkoutDetail({ workout }: Props) {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Workout</Text>
      <Text>Date: {new Date(workout.date).toLocaleString()}</Text>
      <Text>Duration: {Math.floor(workout.duration / 60)} min</Text>

      <Text style={{ marginTop: 12, fontWeight: 'bold' }}>Exercises:</Text>
      <FlatList
        data={workout.exercises}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginVertical: 8,
              padding: 8,
              borderWidth: 1,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>{item.exercise.name}</Text>
            <Image
              source={{ uri: item.exercise.imageUrl }}
              style={{
                width: '100%',
                height: 150,
                borderRadius: 8,
                marginVertical: 6,
              }}
              resizeMode="cover"
            />
            <Text>Reps: {item.reps}</Text>
            <Text>
              Weight: {item.weight} {item.weightUnit}
            </Text>
            <Text>Muscle Group: {item.exercise.muscleGroup}</Text>
            <Text>Equipment: {item.exercise.equipment}</Text>
          </View>
        )}
      />
    </View>
  );
}

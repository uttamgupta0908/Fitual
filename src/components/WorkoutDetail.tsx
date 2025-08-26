import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { Workout } from '../utils/workout';

type Props = {
  workout: Workout;
};

export default function WorkoutDetail({ workout }: Props) {
  return (
    <View style={{ padding: 16, backgroundColor: '#1F2937', flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' }}>
        Workout
      </Text>
      <Text style={{ color: '#D1D5DB', marginTop: 4 }}>
        Date: {new Date(workout.date).toLocaleString()}
      </Text>
      <Text style={{ color: '#D1D5DB' }}>
        Duration: {Math.floor(workout.duration / 60)} min
      </Text>

      <Text style={{ marginTop: 12, fontWeight: 'bold', color: '#FFFFFF' }}>
        Exercises:
      </Text>
      <FlatList
        data={workout.exercises}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginVertical: 8,
              padding: 12,
              borderWidth: 1,
              borderColor: '#374151',
              borderRadius: 8,
              backgroundColor: '#111827',
            }}
          >
            <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>
              {item.exercise.name}
            </Text>
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
            <Text style={{ color: '#D1D5DB' }}>Reps: {item.reps}</Text>
            <Text style={{ color: '#D1D5DB' }}>
              Weight: {item.weight} {item.weightUnit}
            </Text>
            <Text style={{ color: '#D1D5DB' }}>
              Muscle Group: {item.exercise.muscleGroup}
            </Text>
            <Text style={{ color: '#D1D5DB' }}>
              Equipment: {item.exercise.equipment}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

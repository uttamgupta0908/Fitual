import { View, Text } from 'react-native';
import React from 'react';

export default function WorkoutRecord() {
  const { workoutId } = useLocalSearchParams();
  return (
    <View>
      <Text>WorkoutRecord</Text>
    </View>
  );
}

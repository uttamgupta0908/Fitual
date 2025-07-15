import { useRoute } from '@react-navigation/native';
import { Text } from 'react-native';

const ExerciseDetail = () => {
  const route = useRoute();
  const { id } = route.params as { id: string };

  return (
    <Text>Exercise ID: {id}</Text>
  );
};

export default ExerciseDetail;
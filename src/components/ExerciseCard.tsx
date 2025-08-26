import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { ChevronRight, HeartPulse } from 'lucide-react-native';
import { Exercise } from '../utils/workout';

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return '#22C55E';
    case 'intermediate':
      return '#FACC15';
    case 'advanced':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
    default:
      return 'Unknown';
  }
};

interface ExerciseCardProps {
  item: Exercise;
  onPress: () => void;
  showChevron?: boolean;
}

export default function ExerciseCard({
  item,
  onPress,
  showChevron = false,
}: ExerciseCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#1F2937',
        borderRadius: 24,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#374151',
      }}
    >
      <View style={{ flexDirection: 'row', padding: 24 }}>
        {/* Image */}
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 16,
            marginRight: 16,
            overflow: 'hidden',
            backgroundColor: '#111827',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          ) : (
            <View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HeartPulse size={24} color="white" />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#FFFFFF',
                marginBottom: 4,
              }}
            >
              {item.name}
            </Text>
            <Text
              style={{ fontSize: 14, color: '#D1D5DB', marginBottom: 8 }}
              numberOfLines={2}
            >
              {item.description || 'No description available.'}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: getDifficultyColor(item.difficulty),
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 9999,
              }}
            >
              <Text
                style={{ fontSize: 12, fontWeight: '600', color: '#FFFFFF' }}
              >
                {getDifficultyText(item.difficulty)}
              </Text>
            </View>
            {showChevron && <ChevronRight size={20} color="#9CA3AF" />}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { diff } from 'react-native/types_generated/Libraries/ReactNative/ReactFabricPublicInstance/ReactNativeAttributePayload';
import { Image } from 'react-native-svg';

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-500';
    case 'intermediate':
      return 'bg-yellow-500';
    case 'advanced':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};
const getDifficultyText=(difficulty:string)=>{
    switch(difficulty){
        case "beginner":
            return"Beginner";
        case "intermediate":
            return "Intermediate";
        case "advanced":
            return "Advanced";
        default:
            return "Unknown";
        
    }
}
interface ExerciseCardProps {
  item: Exercise;
  onPress: () => void;
  showChevron?: boolean;
}

export default function ExerciseCard() {

    item,
    onPress,
    showChevron = true,
}: ExerciseCardProps) {


  return (
    <TouchableOpacity className='bg-white rounded-2xl mb-4 shadow-sm border border-gray-100' onPress={onPress}>
      <View className='flex-row p-6'>
      <View className='w-20 h-20 bg-white rounded-xl mr-4 overflow-hidden'>
      {item.image ?(
        <Image
         source={{ uri: urlFor(item.image?.asset?._ref).url() }}
            className='w-full h-full'
            resizeMode='contain'
        />
      ):(
        <View className=" w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center">
        // <Ionicons name="fitness" size={24} color="white" />
        </View>
         
      )}
      
      </View>
      </View>
    </TouchableOpacity>
  );
}

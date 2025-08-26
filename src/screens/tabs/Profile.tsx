import {
  View,
  Text,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchWorkoutsFromAPI, Workout } from '../../utils/workout';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import {
  BellDot,
  ChevronRight,
  LogOut,
  MessageCircleQuestionMark,
  Settings,
  User,
} from 'lucide-react-native';
import { formatDuration } from '../../utils/formatworkout';

export default function Profile() {
  const [workout, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigation = useNavigation();

  const fetchWorkouts = async () => {
    try {
      const results = await fetchWorkoutsFromAPI();
      setWorkouts(results);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user?.id]);

  const totalWorkouts = workout.length;
  const totalDuration = workout.reduce(
    (sum, workout) => sum + (workout.duration || 0),
    0,
  );
  const averageDuration =
    totalDuration > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

  const joinDate = user?.createdAt ? new Date(user.createdAt) : new Date();
  const daySinceJoining = Math.floor(
    (new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const handleSignout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-950">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-400 mt-4">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <ScrollView className="flex-1">
        {/* header */}
        <View className="px-6 pt-8 pb-6">
          <Text className="text-3xl font-bold text-white">Profile</Text>
          <Text className="text-lg text-gray-400 mt-1">
            Manage your account and Stats
          </Text>
        </View>

        {/* User Info Card */}
        <View className="px-6 mb-6">
          <View className="bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-800">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center mr-4" />
              <View className="flex-1">
                <Text className="text-xl font-semibold text-white">
                  {user?.name || 'User'}
                </Text>
                <Text className="text-gray-400">{user?.email}</Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Member since {formatJoinDate(joinDate)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* stats overview */}
        <View className="px-6 mb-6">
          <View className="bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-800">
            <Text className="text-lg font-semibold text-white mb-4">
              Your Fitness Stats
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-blue-500">
                  {totalWorkouts}
                </Text>
                <Text className="text-sm text-gray-400 text-center">
                  Total{'\n'} Workouts
                </Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-green-500">
                  {formatDuration(totalDuration)}
                </Text>
                <Text className="text-sm text-gray-400 text-center">
                  Total{'\n'}Time
                </Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-purple-500">
                  {daySinceJoining}
                </Text>
                <Text className="text-sm text-gray-400 text-center">
                  Days{'\n'}Active
                </Text>
              </View>
            </View>
            {totalWorkouts > 0 && (
              <View className="mt-4 pt-4 border-t border-gray-800">
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-400">
                    Average workout duration:
                  </Text>
                  <Text className="font-semibold text-white">
                    {formatDuration(averageDuration)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* account settings */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-white mb-4">
            Account Settings
          </Text>
          <View className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800">
            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-800">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center mr-3">
                  <User size={20} color="white" />
                </View>
                <Text className="text-white font-medium">Edit Profile</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-800">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-green-600 rounded-full items-center justify-center mr-3">
                  <BellDot size={20} color="white" />
                </View>
                <Text className="text-white font-medium">Notifications</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-800">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-purple-600 rounded-full items-center justify-center mr-3">
                  <Settings size={20} color="white" />
                </View>
                <Text className="text-white font-medium">Preferences</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-orange-600 rounded-full items-center justify-center mr-3">
                  <MessageCircleQuestionMark size={20} color="white" />
                </View>
                <Text className="text-white font-medium">Help & Support</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* signOut */}
        <View className="px-6 mb-8">
          <TouchableOpacity
            onPress={handleSignout}
            className="bg-red-600 rounded-2xl p-4 shadow-sm"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              <LogOut size={20} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                Sign Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

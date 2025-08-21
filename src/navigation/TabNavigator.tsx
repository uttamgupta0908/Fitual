import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {
  Home as HomeIcon,
  User,
  History as HistoryIcon,
  House,
  BookMarked,
  CirclePlus,
  CircleUserRound,
} from 'lucide-react-native';
import { View, Text, Image } from 'react-native';
import Home from '../screens/tabs/Home';
import Exercises from '../screens/tabs/Exercises';
import Workout from '../screens/tabs/Workout';
import History from '../screens/tabs/History';
import Profile from '../screens/tabs/Profile';
// import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
// const { user } = useAuth();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarBackground: () => (
          <View style={{ backgroundColor: 'white', height: 100 }} />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Exercise"
        component={Exercises}
        options={{
          title: 'Exercises',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <BookMarked color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Workout"
        component={Workout}
        options={{
          title: 'Workout',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <CirclePlus color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          title: 'History',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <HistoryIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            //   user?.imageUrl || user?.externalAccounts?.[0]?.imageUrl ?
            //     <Image
            //       source={{
            //         uri: user?.imageUrl ?? user?.externalAccounts?.[0]?.imageUrl,
            //       }}
            //       style={{ width: 28, height: 28, borderRadius: 100 }}
            //     />
            // <Image
            //   source={user?.imageUrl ?? user?.externalAccounts[0]?.imageUrl}
            //   className="rounded-full"
            //   style={{ width: 28, height: 28, borderRadius: 100 }}
            // />
            <CircleUserRound color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

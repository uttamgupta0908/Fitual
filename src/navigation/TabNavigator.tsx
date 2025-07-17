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
import { View, Text } from 'react-native';
import Home from '../screens/Home';
import Exercises from '../screens/Exercises';
import Workout from '../screens/Workout';
import History from '../screens/History';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

// const HomeScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>Home Screen</Text>
//   </View>
// );

// const ExerciseScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>Exercise Screen</Text>
//   </View>
// );
// const WorkoutScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>Workout Screen</Text>
//   </View>
// );
// const ProfileScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>Profile Screen</Text>
//   </View>
// );

// const HistoryScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>History Screen</Text>
//   </View>
// );

const App = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // tabBarIcon: ({ color, size }) => {
        //   if (route.name === 'Home') {
        //     return <HomeIcon color={color} size={size} />;
        //   } else if (route.name === 'History') {
        //     return <HistoryIcon color={color} size={size} />;
        //   } else {
        //     return <User color={color} size={size} />;
        //   }
        // },
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
            <CircleUserRound color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default App;

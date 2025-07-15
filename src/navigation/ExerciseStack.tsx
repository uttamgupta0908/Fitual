import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import ExerciseDetail from '../components/common/ExerciseDetail'
import Exercises from '../screens/Exercises'

const Stack = createNativeStackNavigator()
const ExerciseStack = () => {
  return (
    <Stack.Navigator initialRouteName='Exercise'>
        <Stack.Screen name='Exercise' component={Exercises}/>
        <Stack.Screen name='ExerciseDetail' component={ExerciseDetail}/>
    </Stack.Navigator>
  )
}

export default ExerciseStack
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
const Stack = createNativeStackNavigator();

export default function AuthLayout() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SIGN_UP" component={SignUpScreen} />
      <Stack.Screen name="SIGN_IN" component={SignInScreen} />
    </Stack.Navigator>
  );
}

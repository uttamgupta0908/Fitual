import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { signin } from '../../utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../context/AuthContext';

type RootStackParamList = {
  Profile: undefined;
  TABS: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Profile'>;
};

export default function SignInScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn } = useAuth();

  const handleSignin = async () => {
    if (!email || !password) {
      Alert.alert('Oops!', 'Email and password are required');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      navigation.navigate('TABS'); // or your main screen
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  // setLoading(true);
  // signIn(email, password);
  // try {
  //   const data = await signin(email, password);
  //   await AsyncStorage.setItem('token', data.token);
  //   navigation.navigate('(tabs)');
  // } catch (err: any) {
  //   Alert.alert('Error', err.message);
  // } finally {
  //   setLoading(false);
  // }

  return (
    <LinearGradient colors={['#1f1c2c', '#928DAB']} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 36,
            fontWeight: '800',
            marginBottom: 12,
            letterSpacing: 0.5,
          }}
        >
          Welcome Back
        </Text>

        <Text style={{ color: '#ccc', fontSize: 16, marginBottom: 32 }}>
          Sign in to your account
        </Text>

        <View style={{ width: '100%', maxWidth: 360 }}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email Address"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              backgroundColor: '#2c2c2e',
              color: '#fff',
              borderRadius: 12,
              marginBottom: 16,
              padding: 14,
              fontSize: 16,
              borderWidth: 1,
              borderColor: '#3c3c3c',
            }}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            style={{
              backgroundColor: '#2c2c2e',
              color: '#fff',
              borderRadius: 12,
              marginBottom: 24,
              padding: 14,
              fontSize: 16,
              borderWidth: 1,
              borderColor: '#3c3c3c',
            }}
          />

          <TouchableOpacity
            onPress={handleSignin}
            disabled={loading}
            style={{
              backgroundColor: '#6C63FF',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Forgot Password?',
                'Add your forgot password logic here',
              )
            }
            style={{ marginTop: 20, alignItems: 'center' }}
          >
            <Text style={{ color: '#bbb' }}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

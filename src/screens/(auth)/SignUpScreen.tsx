import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { signup } from '../../utils/auth';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../context/AuthContext';

type RootStackParamList = {
  SignIn: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'SignIn'>;
};

export default function SignUpScreen({ navigation }: Props) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { signUp } = useAuth();
  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Oops!', 'All fields are required');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      Alert.alert('Success', 'Account created');
      navigation.navigate('SignIn');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

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
          Create Account
        </Text>

        <Text style={{ color: '#ccc', fontSize: 16, marginBottom: 32 }}>
          Sign up to get started
        </Text>

        <View style={{ width: '100%', maxWidth: 360 }}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Full Name"
            placeholderTextColor="#888"
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
            onPress={handleSignup}
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
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SignIn')}
            style={{ marginTop: 20, alignItems: 'center' }}
          >
            <Text style={{ color: '#bbb' }}>
              Already have an account?{' '}
              <Text style={{ color: '#fff', fontWeight: '600' }}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

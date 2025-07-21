import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { signup } from '../../utils/api';

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

  const handleSignup = async () => {
    try {
      await signup(name, email, password);
      Alert.alert('Success', 'Account created');
      navigation.navigate('SignIn');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
}

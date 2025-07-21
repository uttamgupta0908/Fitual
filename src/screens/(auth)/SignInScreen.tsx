import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { signin } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Profile: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Profile'>;
};

export default function SignInScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSignin = async () => {
    try {
      const data = await signin(email, password);
      await AsyncStorage.setItem('token', data.token);
      navigation.navigate('Profile');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
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

      <Button title="Sign In" onPress={handleSignin} />
    </View>
  );
}

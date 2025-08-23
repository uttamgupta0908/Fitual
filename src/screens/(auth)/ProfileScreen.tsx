// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, Alert } from 'react-native';
// import { getProfile, signout } from '../../utils/auth';
// import { StackNavigationProp } from '@react-navigation/stack';

// type RootStackParamList = {
//   SignIn: undefined;
// };

// type Props = {
//   navigation: StackNavigationProp<RootStackParamList, 'SignIn'>;
// };

// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

// export default function ProfileScreen({ navigation }: Props) {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const data = await getProfile();
//         setUser(data);
//       } catch (err: any) {
//         Alert.alert('Error', err.message);
//       }
//     };

//     loadProfile();
//   }, []);

//   const handleSignout = async () => {
//     await signout();
//     navigation.navigate('SignIn');
//   };

//   if (!user) return <Text>Loading...</Text>;

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Welcome, {user.name}</Text>
//       <Text>Email: {user.email}</Text>
//       <Button title="Sign Out" onPress={handleSignout} />
//     </View>
//   );
// }

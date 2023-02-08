// import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import useLogout from '../hooks/useLogout';
import useAuth from '../hooks/useAuth';
import jwtDecode from 'jwt-decode';

export type Props = {
  navigation: any;
};

const Logout: React.FC<Props> = ({ navigation }) => {
  const logout = useLogout();
  const { auth } = useAuth();

  // const navigation = useNavigation();

  const signOut = async () => {
    console.log('auth before logout: ', auth);
    const decoded: any = auth?.accessToken
      ? jwtDecode(auth.accessToken)
      : undefined;
    const roles = decoded?.UserInfo?.roles || [];
    console.log('roles after decode: ', roles);
    await logout();
    console.log('Logout Success');
    navigation.navigate('Login');
  };
  return (
    <View>
      <Text>Logout Page</Text>
      <Button onPress={signOut} title="Sign Out" />
    </View>
  );
};

export default Logout;

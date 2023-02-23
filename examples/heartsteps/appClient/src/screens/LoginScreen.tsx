import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
  Alert
} from 'react-native';
import React, { useContext, useState } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import * as Keychain from 'react-native-keychain';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { AxiosContext } from '../context/AxiosContext';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
const LOGIN_URL = './auth';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

const CustomTitle = styled(Text)`
  font-size: 60px;
  align-items: center;
  justify-content: center;
  color: '#FFFFFF';
  margin: 20px;
`;

const Login: React.FC = () => {
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const { auth, setAuth } = useAuth();
  // const { publicAxios } = useContext(AxiosContext);

  const navigation = useNavigation();

  const onLogin = async () => {
    console.log('navigation: ', navigation);

    try {
      const response = await axios.get('/pong');
      console.log(JSON.stringify(response?.data));
    } catch (err: any) {
      console.log('ping error: ', err.message);
    }

    try {
      const response = await axios.post(
        LOGIN_URL,
        // backend expects [user, pwd] so we use obj destructuring in JSON.stringify
        JSON.stringify({ user, pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      // TODO: SECURITY - delete log in production
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      setAuth({ user, accessToken });
      console.log('auth state after login: ', { user, accessToken });
      setUser('');
      setPwd('');
      // navigates to where user wanted to go before they were sent to login page
      console.log('SUCCESSFULLY SIGNED IN!');
      navigation.navigate('Root');
    } catch (err: any) {
      console.log('error: ', err);
      if (!err?.response) {
        setErrMsg('No Server Response');
        console.log('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
        console.log('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
        console.log('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      console.log('Login Failed');
    }
  };

  // const onLogin = async () => {
  //   try {
  //     const response = await publicAxios.post('/auth', {
  //       user,
  //       pwd
  //     });

  //     const { accessToken, refreshToken } = response.data;
  //     authContext.setAuthState({
  //       accessToken,
  //       refreshToken,
  //       authenticated: true
  //     });

  //     await AsyncStorage.setItem(
  //       'token',
  //       JSON.stringify({
  //         accessToken,
  //         refreshToken
  //       })
  //     );

  //     // await Keychain.setGenericPassword(
  //     //   'token',
  //     //   JSON.stringify({
  //     //     accessToken,
  //     //     refreshToken
  //     //   })
  //     // );
  //   } catch (error) {
  //     Alert.alert('Login Failed', error.response.data.message);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Login</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#fefefe"
          keyboardType="default"
          autoCapitalize="none"
          onChangeText={(text) => setUser(text)}
          value={user}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#fefefe"
          secureTextEntry
          onChangeText={(text) => setPwd(text)}
          value={pwd}
        />
      </View>
      <Button color="red" title="Login" onPress={() => onLogin()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%'
  },
  logo: {
    fontSize: 60,
    color: '#fff',
    margin: '20%'
  },
  form: {
    width: '80%',
    margin: '10%'
  },
  input: {
    fontSize: 20,
    color: '#fff',
    paddingBottom: 10,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    marginVertical: 20
  },
  button: {}
});

export default Login;

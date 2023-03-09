import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from '../api/axios';

const Users = () => {
  // TODO: replace 'any' with user TS type
  const [users, setUsers] = useState<any[]>();
  const axiosPrivate = useAxiosPrivate();
  const navigation = useNavigation();

  const updateUsers = async () => {
    console.log('RUNNING GET USERS HOOK');
    try {
      const response = await axiosPrivate.get('/users');
      // TODO: replace 'any' with user TS type
      const userNames = response.data.map((user: any) => user.username);
      // TODO: SECURITY - DELETE LOG IN PRODUCTION
      // console.log(response.data);
      setUsers(userNames);
    } catch (err) {
      console.log(err);
      console.log('ACCESS TOKEN EXPIRED WHILE FETCHING USERS');
      /* 
      whenever a user's refresh token expires
      after they re-login, user is sent back to the last page they were on
      i.e. user sent back to /participant/john/name page instead of /home page
      */
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    let isMounted = true;
    // controller is to cancel request if component unmounts
    const controller = new AbortController();

    const getUsers = async () => {
      console.log('RUNNING GET USERS HOOK');
      try {
        const response = await axiosPrivate.get('/users', {
          signal: controller.signal
        });
        // TODO: replace 'any' with user TS type
        const userNames = response.data.map((user: any) => user.username);
        // TODO: SECURITY - DELETE LOG IN PRODUCTION
        // console.log(response.data);
        if (isMounted) {
          setUsers(userNames);
        }
      } catch (err) {
        console.log(err);
        console.log('ACCESS TOKEN EXPIRED WHILE FETCHING USERS');
        /* 
        whenever a user's refresh token expires
        after they re-login, user is sent back to the last page they were on
        i.e. user sent back to /participant/john/name page instead of /home page
        */
        navigation.navigate('Login');
      }
    };

    getUsers();

    // cleanup function, runs on Users component unmount
    return () => {
      isMounted = false;
      controller.abort(); // cancel any pending requests
    };
  }, []);

  return (
    <View>
      <Text>Users List</Text>
      <Button title="Update Users" onPress={updateUsers} />
      {users?.length ? (
        <ScrollView>
          {/* TODO: replace key with uuid */}
          {users.map((userName, i) => (
            <Text key={i}>{userName}</Text>
          ))}
        </ScrollView>
      ) : (
        <Text>No users to display</Text>
      )}
    </View>
  );
};

export default Users;

import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Logout from './LogoutScreen';
import Users from '../components/Users';

const DashboardScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text>Admin Page</Text>
      <Users />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default DashboardScreen;

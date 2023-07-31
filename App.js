import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cast from './components/cast';
import Loading from './components/loading';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='HomeScreen' options={{headerShown: false}} component={HomeScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


import Login from "./login";
import Signup from "./signup";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="Login" component={Login} />
      <Tab.Screen name="Register" component={Signup} />
    </Tab.Navigator>
  );
}

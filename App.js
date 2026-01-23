
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "./src/Screens/Splash";
import Signup from "./src/Screens/Signup";
import Login from "./src/Screens/Login";
import Home from "./src/Screens/Home";
import Details from "./src/Screens/Details";
import Cart from "./src/Screens/Cart";
import { Provider } from "react-redux";
import { Store } from "./Redux/Store";
import ProductsList from "./src/Screens/ProductsList"
import Orderplaced from "./src/Screens/Orderplaced";
import CheckoutScreen from "./src/Screens/Checkout";
import Wishlist from "./src/Screens/Wishlist";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Details" component={Details} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="OrderPlaced" component={Orderplaced} />
          <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
          <Stack.Screen name="ProductsList" component={ProductsList} />
          <Stack.Screen name="Wishlist" component={Wishlist} />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

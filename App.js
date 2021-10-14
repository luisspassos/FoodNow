import React, { useState } from 'react';
import { View, TouchableNativeFeedback, Pressable, Animated, Text, StatusBar } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import Login from './Telas/LoginScreen';
import Cadastro from './Telas/CadastroScreen'
import ScreenProdutos from './Telas/ScreenProdutos';
import Perfil from './Telas/PerfilScreen';
import CadastrarCoisas from './Telas/CadastrarCoisasScreen';
import Conta from './Telas/Conta';
import Notificacoes from './Telas/Notificacoes';
import Restaurante from './Telas/RestauranteComprar';
import Busca from './Telas/BuscaScreen'
import ComprarProduto from './Telas/ComprarProduto'
import ListaItens from './Telas/listaItens';
import TrocarFoto from './Telas/TrocarFoto';
import Trocar from './Telas/TrocarScreen';
import EditarCoisas from './Telas/EditarScreen';
import { FontAwesome, AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Font from 'expo-font';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TabTop = createMaterialTopTabNavigator();

const configTransition = {
  animation: 'spring',
  config: {
    stiffness: 2000,
    damping: 2000,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

function EditarProdutosScreen({ navigation, route }) {
  return (
    <EditarCoisas tipo="Produtos" navigation={navigation} route={route} />
  )
}

function EditarScreen({ navigation, route }) {
  return (
    <EditarCoisas tipo="Lugares" navigation={navigation} route={route} />
  )
}

function TrocarFotoScreen() {
  return (
    <TrocarFoto />
  )
}

function BuscaProdutosScreen({ navigation, route }) {
  return (
    <Busca route={route} navigation={navigation} tipo="Produtos" />
  )
}

function TrocarScreen({ route }) {
  return (
    <Trocar route={route} />
  )
}

function Categoria({ route, navigation }) {
  return (
    <ListaItens route={route} navigation={navigation} tipo="Lugares" />
  )
}

function AbaComprarProduto({ navigation, route }) {
  return (
    <ComprarProduto navigation={navigation} route={route} />
  )
}

function AbaCadastrarProdutos({ navigation, route }) {
  return (
    <CadastrarCoisas navigation={navigation} route={route} tipo="Produtos" />
  )
}

function AbaNotificacoes() {
  return (
    <Notificacoes />
  )
}

function AbaConta({ navigation }) {
  return (
    <Conta navigation={navigation} />
  )
}

function AbaCadatrarCoisas({ navigation, route }) {
  return (
    <CadastrarCoisas navigation={navigation} route={route} tipo="Lugares" />
  )
}

function RestauranteComprar({ navigation, route }) {
  return (
    <Restaurante navigation={navigation} route={route} />
  )
}

function AbaRestaurantes({ navigation, route }) {

  const arrayTipos = ["Lanches", "Sorvetes", "Brasileira", "Pizza"];
  const iconsCategoria = [
    {
      text: "Pizza",
      icon: "pizza-outline",
      tipoIcone: Ionicons
    },
    {
      text: "Brasileira",
      icon: "silverware-fork-knife",
      tipoIcone: MaterialCommunityIcons
    },
    {
      text: "Lanches",
      icon: "hamburger",
      tipoIcone: FontAwesome5
    },
    {
      text: "Sorvetes",
      icon: "ice-cream",
      tipoIcone: FontAwesome5
    }
  ];

  return (
    <ScreenProdutos iconsCategoria={iconsCategoria} arrayTipos={arrayTipos} navigation={navigation} route={route} />
  )
}

function AbaMercados({ navigation, route }) {
  const arrayTipos = ["Produtos", "Farmácia"];
  const iconsCategoria = [
    {
      text: "Produtos",
      icon: "box",
      tipoIcone: Entypo
    },
    {
      text: "Farmácia",
      icon: "prescription-bottle",
      tipoIcone: FontAwesome5
    }
  ];

  return (
    <ScreenProdutos iconsCategoria={iconsCategoria} arrayTipos={arrayTipos} navigation={navigation} route={route} />
  )
}

function AbaBebidas({ navigation, route }) {
  const arrayTipos = ["Cervejas"];
  const iconsCategoria = [
    {
      text: "Cervejas",
      icon: "ios-beer-outline",
      tipoIcone: Ionicons
    },
  ];

  return (
    <ScreenProdutos iconsCategoria={iconsCategoria} arrayTipos={arrayTipos} navigation={navigation} route={route} />
  )
}

function LoginScreen({ navigation, route }) {
  return (
    <Login navigation={navigation} route={route} />
  );
}

function CadastroScreen({ navigation }) {
  return (
    <Cadastro navigation={navigation} />
  );
}

const TabTopBar = ({ state, descriptors, navigation, position }) => {

  const inputRange = state.routes.map((_, i) => i);

  const indicator = position.interpolate({
    inputRange,
    outputRange: [1, 0.75, 0.6]
  })

  const pos = position.interpolate({
    inputRange,
    outputRange: [-1, 191, 428]
  })

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: Constants.statusBarHeight + 5, paddingHorizontal: 10 }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          navigation.navigate(route.name)
        }

        return (
          <React.Fragment key={`arrayElement${index}`}>
            <View>
              <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#A18E85')} onPress={onPress} >
                <View style={{ padding: 5 }}>
                  <Text style={{ fontFamily: 'Roboto_700Bold', fontSize: 23, color: isFocused ? '#ED3E3E' : '#A18E85' }}>{label}</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </React.Fragment>

        )
      })}
      <Animated.View style={{ backgroundColor: '#ED3E3E', height: 1, transform: [{ scaleX: indicator }, { translateX: pos }], width: 150, position: 'absolute', top: 85, left: 18 }} />
    </View>
  )
}

function HomeScreen() {
  return (
    <TabTop.Navigator
      tabBar={(props) => <TabTopBar {...props} />}
    >
      <TabTop.Screen name="Restaurantes" component={AbaRestaurantes} />
      <TabTop.Screen name="Mercados" component={AbaMercados} />
      <TabTop.Screen name="Bebidas" component={AbaBebidas} />
    </TabTop.Navigator>
  )
}

function BuscaScreen({ navigation, route }) {
  return (
    <Busca tipo="Lugares" route={route} navigation={navigation} />
  )
}

function PedidosScreen() {
  return (
    <ListaItens tipo="Pedidos" />
  )
}

function PerfilScreen({ navigation, route }) {
  return (
    <Perfil navigation={navigation} route={route} />
  )
}

function StackPerfil() {

  const [isReady, setIsReady] = useState(false);

  function cacheFonts(fonts) {
    return fonts.map(font => Font.loadAsync(font));
  }

  const carregarIcone = async () => {
    const fontAssets = cacheFonts([MaterialIcons.font]);

    await Promise.all([fontAssets]);
  }

  if (isReady == false) {
    return (
      <AppLoading
        startAsync={carregarIcone}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: { fontFamily: 'Roboto_700Bold', fontSize: 22 }, headerStyle: { borderBottomColor: '#A18E85', borderBottomWidth: 1, elevation: 0, height: 120 }, headerBackImage: () => (<MaterialIcons name="keyboard-backspace" size={40} color="black" />), headerPressColor: '#A18E85', cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, transitionSpec: {
          open: configTransition,
          close: configTransition,
        },
      }}
    >
      <Stack.Screen options={{ headerShown: false }} name="PerfilTela" component={PerfilScreen} />
      <Stack.Screen options={{ title: 'NOTIFICAÇÕES' }} name="Notificacoes" component={AbaNotificacoes} />
      <Stack.Screen options={{ title: 'CONTA' }} name="Conta" component={AbaConta} />
      <Stack.Screen options={{ title: 'CADASTRAR' }} name="CadastrarCoisas" component={AbaCadatrarCoisas} />
    </Stack.Navigator>
  )
}

function tabsApp() {
  return (
    <Tab.Navigator
      backBehavior="history"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let IconType;
          if (route.name === 'Ínicio') {
            IconType = FontAwesome
            iconName = "home"
          } else if (route.name === 'Busca') {
            IconType = AntDesign
            iconName = 'search1'
          } else if (route.name === 'Pedidos') {
            IconType = Feather
            iconName = 'shopping-bag'
          } else {
            IconType = AntDesign
            iconName = 'user'
          }

          return <IconType name={iconName} size={30} color={color} />

        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#A18E85',
        tabBarLabelStyle: { fontFamily: 'Roboto_700Bold', fontSize: 13, marginTop: -10, marginBottom: 10 },
        tabBarStyle: { height: 70, elevation: 0, borderTopColor: '#ededed', borderTopWidth: 0.9 },
        headerShown: false,
        tabBarButton: (props) => <Pressable android_ripple={{ color: '#A18E85', borderless: true }} {...props} />
      })}
    >
      <Tab.Screen name="Ínicio" component={HomeScreen} />
      <Tab.Screen name="Busca" component={BuscaScreen} />
      <Tab.Screen name="Pedidos" component={PedidosScreen} />
      <Tab.Screen name="Perfil" component={StackPerfil} />
    </Tab.Navigator>)
}

function SnackAll() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false, headerTitleStyle: { fontFamily: 'Roboto_700Bold', fontSize: 22 }, headerStyle: { borderBottomColor: '#A18E85', borderBottomWidth: 1, elevation: 0, height: 120 }, headerBackImage: () => (<MaterialIcons name="keyboard-backspace" size={40} color="black" />), headerPressColor: '#A18E85', cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, transitionSpec: {
        open: configTransition,
        close: configTransition,
      }
    }}>
      <Stack.Screen name="TabsView" component={tabsApp} />
      <Stack.Screen name="RestauranteComprar" component={RestauranteComprar} />
      <Stack.Screen name="ComprarProdutos" component={AbaComprarProduto} />
      <Stack.Screen options={{ headerShown: true, title: "CADASTRAR" }} name="CadastrarProdutos" component={AbaCadastrarProdutos} />
      <Stack.Screen name="Categoria" options={({ route }) => ({ title: route.params.name, headerShown: true })} component={Categoria} />
      <Stack.Screen name="Trocar" options={{ headerShown: true, title: "TROCAR" }} component={TrocarScreen} />
      <Stack.Screen name="TrocarFoto" options={{ headerShown: true, title: "TROCAR" }} component={TrocarFotoScreen} />
      <Stack.Screen name="BuscaProdutos" options={{ headerShown: true, title: "BUSCAR" }} component={BuscaProdutosScreen} />
      <Stack.Screen name="Editar" options={{ headerShown: true, title: "EDITAR" }} component={EditarScreen} />
      <Stack.Screen name="EditarProdutos" options={{ headerShown: true, title: "EDITAR" }} component={EditarProdutosScreen} />
    </Stack.Navigator>
  )
}

function MyStack() {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} />
      <Stack.Screen name="App" component={SnackAll} />
    </Stack.Navigator>
  );
}

export default function App() {

  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  })

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <NavigationContainer theme={{ colors: { background: 'white' } }}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <MyStack />
      </NavigationContainer>
    );
  }
}

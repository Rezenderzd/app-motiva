import { Tabs } from 'expo-router';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import {AppProvider, AppContext} from '../components/provider';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

function TabsLayout() {
  const { isDarkMode, toggleSwitchMode, isLogin, setIsLogin } = useContext(AppContext);
  const router = useRouter()
  const logout = async () =>{
    setIsLogin(false)
    router.replace('/login')
    await AsyncStorage.removeItem('email')
  }


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? 'rgb(94,34,243)' : '#fff',
        tabBarInactiveTintColor: isDarkMode ? '#888888' : '#888888',
        tabBarStyle:      { backgroundColor: isDarkMode ? '#fff' : 'rgb(94,34,243)' },
        headerStyle:      { backgroundColor: isDarkMode ? '#fff' : 'rgb(94,34,243)' },
        headerTitleStyle: { color: isDarkMode ? 'rgb(94,34,243)' : '#fff' },
        headerRight: () => (
          <View style={styles.viewBtn}>
            <TouchableOpacity onPress={toggleSwitchMode} style={{ marginRight: 15 }}>
              {isDarkMode ? <AntDesign name="sun" size={24} color="black" /> : <Entypo name="moon" size={24} color="white" />}
            </TouchableOpacity>
            {isLogin? 
              <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                <Text style={{ fontSize: 20 }}><MaterialIcons name="logout" size={24} color={isDarkMode? "black": "white" } /></Text>
              </TouchableOpacity>
              :
              null
            }

          </View>
        ),
      }}     
    >
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          href:null
          // tabBarIcon: ({ size }) => (
          //   <Text style={{ fontSize: size || 24 }}>🚀</Text>
          // ),
        }}
      />
      <Tabs.Screen
        name="solicitacoes"
        options={{
          title: 'Solicitações',
          href: isLogin ? undefined : null,
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size || 24 }}><MaterialCommunityIcons name="calendar" size={24} color={isDarkMode? "black": "white" } /></Text>
          ),
        }}
      />
      <Tabs.Screen
        name="vistoria"
        options={{
          title: 'Vistoria',
          href: isLogin ? undefined : null,
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size || 24 }}><AntDesign name="warning" size={24} color={isDarkMode? "black": "white" } /></Text>
          ),
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: 'Historico',
          href: isLogin ? undefined : null,
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size || 24 }}><FontAwesome6 name="clock-rotate-left" size={24} color={isDarkMode? "black": "white"} /></Text>
          ),
        }}
      />
      <Tabs.Screen 
        name="mudar-senha" 
        options={{ 
          title:'Alterar senha',
          href: null, 
        }} 
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  viewBtn:{
    flexDirection:'row'
  }
})
export default function Layout() {
  return (
    <AppProvider>
      <TabsLayout />
    </AppProvider>
  );
}
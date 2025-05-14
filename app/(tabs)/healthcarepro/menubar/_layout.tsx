import React from "react";
import { Tabs } from "expo-router";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import  icons  from "../../../../constants/icons";


export default function Layout(): JSX.Element {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 1,
          paddingTop: 5,
        },
        tabBarStyle: {
          backgroundColor: "#F05050",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: "2.5%",
          height: 52,
          position: "absolute",
        },
      }}
    >
      {/* <Image source={icons.logoB} style={styles.logo}/> */}
      {/* Home Tab */}
      <Tabs.Screen
        name="dashboard" 
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <View style={styles.tabItemContainer}>
              <Image
                source={icons.home}
                style={[
                  styles.tabIcon,
                  focused ? styles.activeIcon : null, 
                  focused ? styles.Container : null,  
                ]}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItemContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabItem: {
    alignItems: "center",
  },
  tabIcon: {
    width: 28,
    height: 28,
    tintColor: "#FFFFFF",
    resizeMode: "contain",
  },
  activeIcon: {
    tintColor: "#FE8080", // Change la couleur de l'icône active
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
  },
  Container: {
    width: 30,  // Change la taille de l'icône si active
    height: 30,
  },
});

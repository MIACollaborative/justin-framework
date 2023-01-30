import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import AppStack from "./AppStack";


export default function AppNav() {

    return (
      <NavigationContainer>
        <AppStack></AppStack>
      </NavigationContainer>
    );
  }
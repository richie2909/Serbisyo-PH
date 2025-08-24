import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";



export default function layout() {
    return <>
    <StatusBar />
    <Stack screenOptions={{headerShown : false}}/> 
    </>
}
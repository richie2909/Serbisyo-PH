import { Stack } from 'expo-router';
import "../global.css"
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}

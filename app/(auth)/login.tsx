import { View, Text, TextInput } from "react-native";

export default function Login() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-900 ">
      <View className="w-[90%] h-90 mx-[5%] border-spacing-1 border-2 p-10 border-blue-500">
        <Text className="text-white text-lg">Login Screen</Text>
        <View className="m-2 py-3">
          <TextInput
            className="border-1 text-white bg-white text-md border-white rounded-2xl px-2 py-1"
            placeholder="Enter your Email"
            secureTextEntry
          ></TextInput>
        </View>
      </View>
    </View>
  );
}


import {View, Text} from "react-native"


export interface PersonalInfo {
    FullName : string
    PhoneNumber : string

}

export default function PersonalInfo({FullName, PhoneNumber}: PersonalInfo) {
    return <View className="bg-white shadow  mx-[10%] my-8 rounded-2xl w-[80%] px-5 py-3">
        <Text className="font-semibold text-large text-bg-400 ">Personal Info</Text>
        <Text className="w-50 h-10 mx-5 my-3 focus:outline-none text-black border-1 border-gray-700 rounded-2xl bg-gray-500">{FullName}</Text>
        <Text className="w-50 h-10 mx-5 my-3 focus:outline-none text-black border-1 border-gray-300">{PhoneNumber}</Text>
    </View>
}
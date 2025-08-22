import {View, Text, Image} from "react-native"

export interface ProfileDetails {
    userName : string
    email : string
    imgURL : string
}

export default function ProfileView({userName, email, imgURL} : ProfileDetails) {
    return  <View className="bg-white p-6 rounded-2xl shadow mb-6 items-center">
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          className="w-24 h-24 rounded-full mb-4"
        />
        <Text className="text-xl font-bold text-gray-800">{userName}</Text>
        <Text className="text-gray-500">{email}</Text>
      </View>
}
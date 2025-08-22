// app/Profile.tsx
import PersonalInfo from "@/components/PersonalInfo";
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput, Image } from "react-native";
import ProfileView from "@/components/ProfileView";
import { useState } from "react";
import NotificationSetting from "@/components/NotificationSetting";
import GeneralSetting from "@/components/GeneralSetting";
import DeleteAccount from "@/components/DeleteAccount";

export default function Profile() {
  
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Profile Card */}

      <ProfileView email="no" userName="noe" imgURL="shte" />
      

      {/* Personal Info */}
      <PersonalInfo FullName="Richie" PhoneNumber="hotdog"/> 

      {/* Notifications */}
      <NotificationSetting />
     

      {/* General Settings */}
   

      <GeneralSetting />
      {/* Danger Zone */}
      <DeleteAccount /> 
    </ScrollView>
  );
}

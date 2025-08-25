import { ScrollView } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import ProfileView from "@/components/ProfileView";
import PersonalInfo from "@/components/PersonalInfo";
import NotificationSetting from "@/components/NotificationSetting";
import GeneralSetting from "@/components/GeneralSetting";
import DeleteAccount from "@/components/DeleteAccount";

export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) return null; // or show spinner

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <ProfileView
        email={user?.email ?? "Not Available"}
        userName={user?.user_metadata?.full_name ?? "No Name"}
        imgURL={user?.user_metadata?.avatar_url ?? ""}
      />

      <PersonalInfo
        fullName={user?.user_metadata?.full_name ?? "Unknown"}
        phoneNumber={user?.user_metadata?.phone ?? "No Phone"}
      />

      <NotificationSetting />
      <GeneralSetting />
      <DeleteAccount />
    </ScrollView>
  );
}

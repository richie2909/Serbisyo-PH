// components/ErrorModal.tsx
import { Modal, View, Text, TouchableOpacity } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

type ErrorModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function ErrorModal({ visible, onClose }: ErrorModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center">
        <View className="bg-white w-80 p-6 rounded-2xl shadow-lg items-center">
          {/* Error Icon */}
          <Svg height="80" width="80" viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="45" stroke="#ef4444" strokeWidth="6" fill="#fee2e2" />
            {/* Exclamation line */}
            <Line x1="50" y1="28" x2="50" y2="60" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
            {/* Dot */}
            <Line x1="50" y1="72" x2="50" y2="74" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
          </Svg>

          <Text className="text-lg font-bold text-gray-800 mt-4">
            Something went wrong
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Please check your connection and try again.
          </Text>

          <TouchableOpacity
            className="bg-[#ef4444] mt-6 px-6 py-3 rounded-xl w-full"
            onPress={onClose}
          >
            <Text className="text-white font-semibold text-center">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 p-6">
      <View className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 items-center">
        <Text className="text-3xl font-extrabold text-indigo-600 tracking-tight">
          m
        </Text>
      </View>
    </View>
  );
}

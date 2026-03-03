import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Briefcase } from 'lucide-react-native';

export default function VaultScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0B] items-center justify-center">
      <Briefcase size={64} color="#4A4A4A" className="mb-4" />
      <Text className="text-white text-2xl font-bold mb-2">Your Vault</Text>
      <Text className="text-white/50 text-center px-12">
        Unlock protected features and premium content in your focus vault.
      </Text>
    </SafeAreaView>
  );
}

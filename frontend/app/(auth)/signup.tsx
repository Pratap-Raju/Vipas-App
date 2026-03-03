import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Check your email for confirmation!');
      router.push('/(auth)/login');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-8 justify-center">
      <Text className="text-4xl font-bold text-foreground mb-8">Join Vipas</Text>
      <View className="gap-4">
        <View>
          <Text className="text-muted-foreground mb-2">Full Name</Text>
          <TextInput
            className="bg-secondary/20 p-4 rounded-xl text-foreground"
            placeholder="John Doe"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
        <View>
          <Text className="text-muted-foreground mb-2">Email</Text>
          <TextInput
            className="bg-secondary/20 p-4 rounded-xl text-foreground"
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>
        <View>
          <Text className="text-muted-foreground mb-2">Password</Text>
          <TextInput
            className="bg-secondary/20 p-4 rounded-xl text-foreground"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          className="bg-primary py-4 rounded-xl items-center mt-4"
        >
          <Text className="text-primary-foreground text-lg font-semibold">
            {loading ? 'Creating account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>
        <View className="flex-row justify-center mt-4">
          <Text className="text-muted-foreground">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-bold">Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

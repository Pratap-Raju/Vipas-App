import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { 
  Zap, 
  CheckCircle2, 
  ArrowLeft, 
  Flame, 
  ShieldCheck, 
  Lock, 
  Infinity, 
  BarChart3,
  Sparkles
} from 'lucide-react-native';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

export default function PricingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      setProfile(data);
      setLoading(false);
    }
    fetchProfile();
  }, [user]);

  const currentStreak = profile?.current_streak_days || 0;
  const isEligible = currentStreak >= 30; // Whole month streak
  const discountPrice = "2.50";
  const regularPrice = "9.99";

  const features = [
    {
      icon: Infinity,
      title: "Block Unlimited Apps",
      description: "No limits on how many distracting apps you can block simultaneously."
    },
    {
      icon: ShieldCheck,
      title: "Custom Focus Sessions",
      description: "Tailor your focus and break durations to match your productivity rhythm."
    },
    {
      icon: BarChart3,
      title: "Detailed Productivity Stats",
      description: "Deep dive into your focus trends and app usage history."
    },
    {
      icon: Sparkles,
      title: "Premium Content",
      description: "Access curated philosophy and growth videos in focus mode."
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#09090B]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="bg-white/5 p-2 rounded-full border border-white/10"
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">Vipas Pro</Text>
          <View className="w-10" /> 
        </View>

        {/* Hero Section */}
        <View className="px-6 mt-8 items-center">
          <LinearGradient
            colors={['#B4FFB4', '#5AFF5A']}
            className="w-20 h-20 rounded-3xl items-center justify-center shadow-lg shadow-[#B4FFB4]/20"
          >
            <Zap size={40} color="black" fill="black" />
          </LinearGradient>
          
          <Text className="text-white text-4xl font-black mt-8 text-center tracking-tighter">
            Unlock Your{'\n'}Full Potential
          </Text>
          <Text className="text-white/50 text-center mt-4 text-lg font-medium leading-relaxed px-4">
            Join the elite 5% who stay focused and productive every single day.
          </Text>
        </View>

        {/* Pricing Card */}
        <View className="px-6 mt-8">
          <View className="bg-zinc-900 rounded-[32px] border border-white/10 p-6 overflow-hidden relative">
            {/* Background Glow */}
            <View className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full" />
            
            <View className="flex-row justify-between items-start mb-6">
              <View>
                <Text className="text-white/40 font-bold uppercase tracking-widest text-[9px] mb-1">Monthly Plan</Text>
                <View className="flex-row items-end">
                  <Text className="text-white text-4xl font-black">${isEligible ? discountPrice : regularPrice}</Text>
                  <Text className="text-white/40 font-bold mb-1 ml-1 text-sm">/mo</Text>
                </View>
              </View>
              <View className="bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20">
                <Text className="text-indigo-400 font-bold text-[10px]">Standard</Text>
              </View>
            </View>

            {/* Streak Discount Indicator */}
            <View className={`p-4 rounded-2xl border mb-6 ${isEligible ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
              <View className="flex-row items-center gap-3 mb-3">
                <View className={`p-2 rounded-xl ${isEligible ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
                  <Flame size={18} color={isEligible ? '#10B981' : '#FFF'} fill={isEligible ? '#10B981' : 'none'} />
                </View>
                <View className="flex-1">
                  <Text className={`font-bold text-sm ${isEligible ? 'text-emerald-400' : 'text-white'}`}>
                    {isEligible ? 'Streak Discount Active!' : '30-Day Streak Challenge'}
                  </Text>
                  <Text className="text-white/40 text-[10px] mt-0.5">
                    {isEligible 
                      ? "You've earned 75% off for life." 
                      : `Keep a 30-day streak to unlock ${discountPrice}/mo.`}
                  </Text>
                </View>
              </View>
              
              {/* Progress Bar */}
              <View className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                <View 
                  className={`h-full rounded-full ${isEligible ? 'bg-emerald-500' : 'bg-white/20'}`} 
                  style={{ width: `${Math.min((currentStreak / 30) * 100, 100)}%` }} 
                />
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-white/30 text-[9px] font-bold">{currentStreak} / 30 Days</Text>
                <Text className="text-white/30 text-[9px] font-bold">{isEligible ? 'Unlocked' : `${30 - currentStreak} Days Left`}</Text>
              </View>
            </View>

            <TouchableOpacity 
              className="bg-white py-4 rounded-2xl items-center shadow-xl"
              activeOpacity={0.9}
            >
              <Text className="text-black text-lg font-black">Get Vipas Pro</Text>
            </TouchableOpacity>
            
            <Text className="text-white/30 text-center mt-4 text-[10px] font-medium uppercase tracking-widest">
              Cancel anytime • 7-day free trial
            </Text>
          </View>
        </View>

        {/* Features List */}
        <View className="px-6 mt-16 mb-20">
          <Text className="text-white text-2xl font-bold mb-8">What's Included</Text>
          
          <View className="gap-8">
            {features.map((feature, index) => (
              <View key={index} className="flex-row gap-5">
                <View className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/10">
                  <feature.icon size={24} color="white" strokeWidth={2.5} />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-lg mb-1">{feature.title}</Text>
                  <Text className="text-white/40 text-sm leading-relaxed">{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

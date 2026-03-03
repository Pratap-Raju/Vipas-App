import { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ShieldCheck, 
  Timer, 
  Zap, 
  Trophy, 
  ArrowLeft, 
  Hourglass, 
  Instagram, 
  Bell, 
  Flame, 
  Users, 
  Handshake
} from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [screenTime, setScreenTime] = useState('');

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/(auth)/signup');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepOne onNext={handleNext} />;
      case 1:
        return <StepTwo onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <StepThree onSelect={(val) => { setScreenTime(val); handleNext(); }} onBack={handleBack} />;
      case 3:
        return <StepFour onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <StepFive onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <StepSix onNext={handleNext} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-[#09090B]">
      {renderStep()}
    </View>
  );
}

// Screen 1: "BePresent combines app blocking..."
function StepOne({ onNext }: { onNext: () => void }) {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-8 pt-12">
        <Text className="text-4xl font-bold text-white leading-tight mb-4">
          Vipas{"\n"}combines app{"\n"}blocking...
        </Text>
        
        <View className="flex-1 items-center justify-center">
          {/* Phone Illustration Mockup */}
          <View className="w-64 h-[450px] bg-[#18181B] rounded-[40px] border-[1px] border-white/10 shadow-2xl relative overflow-hidden">
            <View className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full" />
            
            <View className="flex-1 bg-black items-center justify-center p-6">
              {/* Instagram App with "sleeping" icon */}
              <View className="mb-8 items-center">
                <View className="relative">
                  <View className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] w-16 h-16 rounded-2xl items-center justify-center opacity-60">
                    <Instagram size={32} color="white" />
                  </View>
                  <View className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                    <Text className="text-white font-bold text-xl">zzz</Text>
                  </View>
                </View>
              </View>

              <View className="bg-[#18181B] w-full p-5 rounded-3xl border border-white/5">
                <Text className="text-white text-xl font-bold text-center mb-1">Open Instagram?</Text>
                <Text className="text-gray-400 text-sm text-center mb-6">0/5 Opens Today</Text>
                
                <TouchableOpacity className="bg-white/10 py-3 px-4 rounded-xl mb-4 border border-white/10">
                  <Text className="text-white font-semibold text-center">Open App</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={onNext}>
                  <Text className="text-blue-500 font-bold text-center text-lg">Nevermind, Be Present</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          onPress={onNext}
          className="bg-white py-5 rounded-full items-center mb-4"
        >
          <Text className="text-black text-xl font-bold">Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Screen 2: "With Psychology and Gamification"
function StepTwo({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-8 pt-12">
        <Text className="text-4xl font-bold text-white leading-tight mb-8">
          With Psychology{"\n"}and Gamification
        </Text>

        <View className="flex-1 items-center">
          {/* Floating Tags */}
          <View className="flex-row justify-end w-full mb-4">
            <View className="bg-[#18181B] px-4 py-2 rounded-full border border-white/5 flex-row items-center">
              <Flame size={20} color="#FF5A00" className="mr-2" />
              <Text className="text-white font-bold">Streaks</Text>
            </View>
          </View>
          
          <View className="flex-row justify-start w-full mb-4">
            <View className="bg-[#18181B] px-4 py-2 rounded-full border border-white/5 flex-row items-center">
              <Trophy size={20} color="#FFD700" className="mr-2" />
              <Text className="text-white font-bold">Leaderboards</Text>
            </View>
          </View>

          <View className="flex-row justify-end w-full mb-8">
            <View className="bg-[#18181B] px-4 py-2 rounded-full border border-white/5 flex-row items-center">
              <Handshake size={20} color="#6366F1" className="mr-2" />
              <Text className="text-white font-bold">Accountability</Text>
            </View>
          </View>

          {/* Phone Illustration - Dark Mode Dashboard */}
          <View className="w-64 h-80 bg-[#09090B] rounded-t-[40px] border-x-[1px] border-t-[1px] border-white/10 shadow-2xl relative">
            <View className="p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white font-bold text-lg">Vipas</Text>
                <View className="flex-row gap-3">
                  <View className="flex-row items-center">
                    <Flame size={14} color="#FF5A00" />
                    <Text className="text-white text-xs font-bold ml-1">5</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Zap size={14} color="#FFD700" />
                    <Text className="text-white text-xs font-bold ml-1">110 XP</Text>
                  </View>
                </View>
              </View>

              {/* Dark Progress Circle Mockup */}
              <View className="bg-[#18181B] rounded-3xl p-4 border border-white/5">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="relative w-16 h-16 items-center justify-center">
                    <Svg width="64" height="64" viewBox="0 0 64 64">
                      <Circle cx="32" cy="32" r="28" stroke="#27272A" strokeWidth="6" fill="none" />
                      <Circle cx="32" cy="32" r="28" stroke="#3B82F6" strokeWidth="6" fill="none" strokeDasharray="175" strokeDashoffset="40" />
                    </Svg>
                    <Text className="absolute text-xl">🚀</Text>
                  </View>
                  <View>
                    <Text className="text-white text-3xl font-bold">25m</Text>
                    <Text className="text-gray-400 text-[10px]">Used today</Text>
                  </View>
                </View>
                <View className="h-1 w-full bg-[#27272A] rounded-full overflow-hidden mt-2">
                  <View className="h-full bg-blue-500 w-[40%]" />
                </View>
              </View>

              {/* App Icons Row */}
              <View className="flex-row justify-center gap-2 mt-4">
                {[Instagram, Zap, ShieldCheck, Trophy].map((Icon, i) => (
                  <View key={i} className="bg-[#18181B] p-2 rounded-xl flex-row items-center border border-white/5">
                    <Icon size={12} color="#A1A1AA" />
                    <Text className="text-[#A1A1AA] text-[10px] ml-1">12m</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          onPress={onNext}
          className="bg-white py-5 rounded-full items-center mb-4"
        >
          <Text className="text-black text-xl font-bold">Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Screen 3: "What's your daily average screen time?"
function StepThree({ onSelect, onBack }: { onSelect: (val: string) => void; onBack: () => void }) {
  const options = [
    '1-2 hours',
    '2-3 hours',
    '3-4 hours',
    '4-5 hours',
    '5-6 hours',
    '6-7 hours',
    '7-8 hours',
    'Over 8 hours'
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#09090B]">
      <View className="flex-1 px-6">
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={onBack} className="mr-4">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1 h-2 bg-[#18181B] rounded-full overflow-hidden">
            <View className="w-1/3 h-full bg-blue-500" />
          </View>
        </View>

        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-blue-500/10 rounded-3xl items-center justify-center border border-blue-500/20">
            <Timer size={40} color="#3B82F6" />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-3xl font-bold text-center text-white leading-tight">
            What's your daily average screen time?
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
          <View className="gap-3">
            {options.map((option) => (
              <TouchableOpacity 
                key={option}
                onPress={() => onSelect(option)}
                className="bg-[#18181B] py-5 px-6 rounded-2xl border border-white/5"
              >
                <Text className="text-lg font-semibold text-white">{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Screen 4: "Connect BePresent to Screen Time"
function StepFour({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-8 pt-12">
        <Text className="text-3xl font-bold text-center text-white leading-tight mb-4">
          Securely connect to{"\n"}Screen Time
        </Text>
        
        <Text className="text-lg text-center text-gray-400 font-medium mb-12">
          Your data is completely private and{"\n"}never leaves your device.
        </Text>

        <View className="flex-1 items-center justify-center">
          <View className="relative w-48 h-48 items-center justify-center">
            {/* Screen Time Icon */}
            <View className="absolute top-0 left-0 w-32 h-32 bg-[#5B21B6] rounded-[32px] items-center justify-center transform rotate-[-10deg] shadow-lg border border-white/10">
              <Hourglass size={64} color="white" />
            </View>
            
            {/* Vipas Icon */}
            <View className="absolute bottom-0 right-0 w-32 h-32 bg-[#2563EB] rounded-[32px] p-4 transform rotate-[10deg] shadow-lg border border-white/10 items-center justify-center">
              <ShieldCheck size={48} color="white" />
              <Text className="text-white font-bold text-xl mt-1">Vipas</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          onPress={onNext}
          className="bg-white py-5 rounded-full items-center mb-4"
        >
          <Text className="text-black text-xl font-bold">Connect Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Screen 5: System Prompt Mockup (Darker)
function StepFive({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <View className="flex-1 bg-black/90 items-center justify-center p-8">
      <View className="bg-[#1C1C1E] w-full rounded-[24px] overflow-hidden shadow-2xl border border-white/10">
        <View className="p-8 items-center">
          <Text className="text-xl font-bold text-center text-white mb-3">
            "Vipas" Would Like to{"\n"}Access Screen Time
          </Text>
          <Text className="text-sm text-center text-gray-400 leading-snug">
            Providing access to Screen Time allows us to help you block distracting apps and maintain your focus.
          </Text>
        </View>
        
        <View className="flex-row border-t border-white/10">
          <TouchableOpacity 
            onPress={onNext}
            className="flex-1 py-5 items-center border-r border-white/10"
          >
            <Text className="text-blue-500 text-lg font-medium">Allow Access</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={onNext}
            className="flex-1 py-5 items-center"
          >
            <Text className="text-gray-500 text-lg font-medium">Don't Allow</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Screen 6: "Enable Screen Time Reminders" (Darker)
function StepSix({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-8 pt-12">
        <Text className="text-3xl font-bold text-center text-white leading-tight mb-12">
          Get gentle reminders{"\n"}to stay focused
        </Text>

        <View className="flex-1 items-center justify-center">
          <View className="w-64 h-[400px] bg-[#09090B] rounded-[40px] border-[1px] border-white/10 shadow-2xl relative overflow-hidden">
            <View className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full" />
            
            <View className="flex-1 p-2 bg-black">
              <View className="flex-row justify-between items-center mb-6 pt-6 px-3">
                <Text className="text-white text-[10px] font-bold">09.41</Text>
                <View className="flex-row gap-2">
                   <View className="w-3 h-3 rounded-full bg-white/10" />
                   <View className="w-3 h-3 rounded-full bg-white/10" />
                </View>
              </View>

              {/* Dark Instagram Feed Mockup */}
              <View className="flex-row gap-3 mb-6 px-3">
                {[1, 2, 3, 4].map(i => (
                  <View key={i} className="w-12 h-12 rounded-full border-2 border-purple-500/30 p-0.5">
                    <View className="flex-1 bg-white/5 rounded-full" />
                  </View>
                ))}
              </View>

              <View className="bg-[#18181B] h-48 rounded-2xl mx-3 mb-4 border border-white/5" />
              <View className="bg-[#18181B] h-4 w-3/4 mx-3 mb-2 rounded border border-white/5" />
              <View className="bg-[#18181B] h-4 w-1/2 mx-3 rounded border border-white/5" />

              {/* Glassmorphism Notification Overlay */}
              <View className="absolute top-1/2 left-4 right-4 -translate-y-1/2 bg-[#1C1C1E]/95 rounded-2xl p-4 shadow-2xl flex-row items-center border border-white/10">
                <View className="w-12 h-12 bg-blue-600 rounded-xl items-center justify-center mr-4">
                  <ShieldCheck size={28} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-white text-sm">Vipas Reminds You</Text>
                  <Text className="text-xs text-gray-400 mt-0.5">🔒 Opening Instagram for 5 min</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="mb-4">
          <TouchableOpacity 
            onPress={onNext}
            className="bg-white py-5 rounded-full items-center mb-4"
          >
            <Text className="text-black text-xl font-bold">Enable Notifications</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={onNext}
            className="py-2 items-center"
          >
            <Text className="text-gray-400 text-lg font-medium">Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

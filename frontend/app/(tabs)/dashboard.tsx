import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Image, Dimensions, Animated, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { 
  Flame, 
  Share2, 
  Plus, 
  Pause, 
  Play, 
  Moon, 
  Sun, 
  Dumbbell, 
  BookOpen, 
  Focus, 
  CloudMoon,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  Settings2,
  X,
  Coffee,
  StopCircle
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Session State
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(25); // in minutes
  const [breakDuration, setBreakDuration] = useState(5); // in minutes
  const [timer, setTimer] = useState(0); // in seconds
  const [activeSessions, setActiveSessions] = useState<string[]>([]);
  
  // Modal State
  const [showConfigModal, setShowConfigModal] = useState(false);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    setProfile(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (isFocusActive || isBreakActive) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 0) {
            // Handle timer completion
            if (isFocusActive) {
              // Transition to break or stop
              setIsFocusActive(false);
              // Auto-start break if needed, but for now just stop
              return 0;
            } else {
              setIsBreakActive(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFocusActive, isBreakActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startFocusSession = () => {
    setTimer(sessionDuration * 60);
    setIsFocusActive(true);
    setIsBreakActive(false);
    setShowConfigModal(false);
  };

  const startBreak = () => {
    setTimer(breakDuration * 60);
    setIsBreakActive(true);
    setIsFocusActive(false);
  };

  const resumeFocus = () => {
    // If we're resuming, we might want to know how much session time was left
    // For simplicity, let's just use the current timer value if we paused it, 
    // but here "Break" is a separate state with its own duration.
    // If user finishes break early, we start a new session or resume previous?
    // Let's just start a new session or set it to sessionDuration for now.
    setTimer(sessionDuration * 60);
    setIsFocusActive(true);
    setIsBreakActive(false);
  };

  const stopSession = () => {
    setIsFocusActive(false);
    setIsBreakActive(false);
    setTimer(0);
  };

  const toggleSession = (id: string) => {
    if (activeSessions.includes(id)) {
      setActiveSessions(activeSessions.filter(s => s !== id));
    } else {
      setActiveSessions([...activeSessions, id]);
    }
  };

const SessionCard = ({ id, title, description, time, icon: Icon, iconColor }: any) => {
const isActive = activeSessions.includes(id);

return (
<TouchableOpacity 
activeOpacity={0.7}
onPress={() => toggleSession(id)}
className="mb-4 rounded-[30px] border border-white/5 bg-[#1C1C1E]"
style={{ width: CARD_WIDTH, minHeight: 220 }}
>
<View className="p-5 flex-1 justify-between">
<View>
<View className="bg-white/5 self-start p-3 rounded-2xl mb-4">
<Icon size={22} color={iconColor} strokeWidth={2.5} />
</View>
<Text numberOfLines={1} className="text-white text-lg font-bold leading-tight mb-1">{title}</Text>
<Text numberOfLines={2} className="text-white/40 text-[11px] font-medium leading-tight mb-1">{description}</Text>
<Text className="text-white/20 text-[10px] font-bold uppercase tracking-wider mt-1">{time}</Text>
</View>

<View className={`self-start px-4 py-2 rounded-full flex-row items-center gap-1.5 ${isActive ? 'bg-indigo-500' : 'bg-white/10'}`}>
{isActive ? (
<>
<CheckCircle2 size={12} color="white" strokeWidth={3} />
<Text className="text-white text-[11px] font-bold">Active</Text>
</>
) : (
<>
<Plus size={12} color="white" strokeWidth={3} />
<Text className="text-white text-[11px] font-bold">Add</Text>
</>
)}
</View>
</View>
</TouchableOpacity>
);
};

  return (
    <SafeAreaView className="flex-1 bg-[#09090B]">
      {/* Header */}
      <View className="px-5 py-3 flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-lg bg-white items-center justify-center">
             <Focus size={18} color="black" strokeWidth={3} />
          </View>
          <Text className="text-white text-xl font-bold tracking-tight">Vipas</Text>
        </View>
        
          <View className="flex-row items-center gap-2">
            <TouchableOpacity className="flex-row items-center bg-[#1C1C1E] px-3 py-1.5 rounded-full border border-white/5">
              <Flame size={14} color="#FF9500" fill="#FF9500" />
              <Text className="text-white font-bold ml-1 text-xs">{profile?.current_streak_days || 0}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => router.push('/pricing')}
              className="bg-[#B4FFB4] px-3 py-1.5 rounded-full flex-row items-center gap-1"
            >
              <Zap size={11} color="black" fill="black" />
              <Text className="text-black font-black text-[10px]">PRO</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-[#1C1C1E] p-2 rounded-full border border-white/5">
              <Share2 size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

      </View>

        <ScrollView 
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchProfile} tintColor="#FFF" />}
        >
            {/* Welcome Section */}
            <View className="mt-4 mb-6">
              <Text className="text-white/40 text-sm font-medium">Monday, March 2</Text>
              <Text className="text-white text-3xl font-extrabold mt-0.5 tracking-tight">Focusing Today</Text>
            </View>
    
            {/* Section: Active Mode Status Card / Custom Session Control */}
            {!isFocusActive && !isBreakActive ? (
               <TouchableOpacity 
                 activeOpacity={0.9}
                 onPress={() => setShowConfigModal(true)}
                 className="overflow-hidden rounded-[40px] mb-8"
               >
                 <LinearGradient
                   colors={['#4F46E5', '#3730A3']}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 1 }}
                   className="p-6 flex-row items-center justify-between"
                 >
                   <View className="flex-1">
                     <Text className="text-white/70 font-bold uppercase tracking-widest text-[9px] mb-1">Custom Block</Text>
                     <Text className="text-white text-xl font-black">Configure Session</Text>
                     <Text className="text-indigo-100/60 text-[12px] mt-1 font-medium leading-tight">Set duration & break preferences.</Text>
                   </View>
                   <View className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                     <Settings2 size={20} color="white" strokeWidth={2.5} />
                   </View>
                 </LinearGradient>
               </TouchableOpacity>
            ) : (
              <View className="bg-[#1C1C1E] rounded-[40px] p-6 mb-8 border border-white/5 shadow-2xl">
                 <View className="flex-row justify-between items-center mb-6">
                    <View>
                       <Text className="text-white/40 font-bold uppercase tracking-widest text-[10px] mb-1">
                         {isFocusActive ? 'Deep Work' : 'On Break'}
                       </Text>
                       <Text className="text-white text-4xl font-bold font-mono tracking-tighter">
                         {formatTime(timer)}
                       </Text>
                    </View>
                    <View className={`p-4 rounded-2xl ${isFocusActive ? 'bg-indigo-500/10' : 'bg-emerald-500/10'}`}>
                       {isFocusActive ? <Focus size={28} color="#818CF8" strokeWidth={2.5} /> : <Coffee size={28} color="#10B981" strokeWidth={2.5} />}
                    </View>
                 </View>
                 
                 <View className="flex-row gap-3">
                    {isFocusActive ? (
                      <TouchableOpacity 
                        onPress={startBreak}
                        className="flex-1 bg-white/5 border border-white/10 py-4 rounded-2xl flex-row items-center justify-center gap-2"
                      >
                        <Coffee size={18} color="white" />
                        <Text className="text-white font-bold text-base">Break</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity 
                        onPress={resumeFocus}
                        className="flex-1 bg-indigo-600 py-4 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg shadow-indigo-600/50"
                      >
                        <Play size={18} color="white" fill="white" />
                        <Text className="text-white font-bold text-base">Resume</Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity 
                      onPress={stopSession}
                      className="flex-1 bg-red-500/10 border border-red-500/10 py-4 rounded-2xl flex-row items-center justify-center gap-2"
                    >
                      <StopCircle size={18} color="#EF4444" />
                      <Text className="text-red-500 font-bold text-base">End</Text>
                    </TouchableOpacity>
                 </View>
              </View>
            )}


        {/* Section: Productivity Cards */}
        <View className="mt-2">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-xl font-bold">Get More Done</Text>
            <TouchableOpacity className="flex-row items-center gap-1">
              <Text className="text-white/40 text-sm font-bold">See All</Text>
              <ArrowRight size={14} color="rgba(255,255,255,0.3)" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row flex-wrap justify-between">
            <SessionCard 
              id="laser-focus"
              title="Laser Focus"
              description="Your daily focus hour"
              time="2PM - 3PM"
              icon={Focus}
              iconColor="#A855F7"
            />
            <SessionCard 
              id="morning-routine"
              title="Sunrise Mode"
              description="Wake up without distraction"
              time="6AM - 9AM"
              icon={Sun}
              iconColor="#F59E0B"
            />
          </View>
        </View>

        {/* Section: Wellness Cards */}
        <View className="mt-8">
           <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-xl font-bold">Relax & Reset</Text>
          </View>
          
          <View className="flex-row flex-wrap justify-between">
            <SessionCard 
              id="wind-down"
              title="Wind Down"
              description="Prepare for deep sleep"
              time="8PM - 10PM"
              icon={CloudMoon}
              iconColor="#6366F1"
            />
            <SessionCard 
              id="gym-time"
              title="Body & Soul"
              description="Active movement session"
              time="5PM - 6PM"
              icon={Dumbbell}
              iconColor="#EF4444"
            />
          </View>
        </View>

        {/* Section: Daily Progress */}
        <View className="mt-8 bg-[#1C1C1E] rounded-[40px] border border-white/5 p-8 shadow-xl">
           <View className="flex-row items-center justify-between mb-8">
             <View>
                <Text className="text-white text-2xl font-black">Daily Streak</Text>
                <Text className="text-white/40 text-sm font-medium mt-1">You're in the top 5% today</Text>
             </View>
             <View className="bg-[#B4FFB4]/10 px-4 py-2 rounded-full border border-[#B4FFB4]/20">
                <Text className="text-[#B4FFB4] font-black text-xs uppercase tracking-tighter">+120 XP</Text>
             </View>
           </View>

           <View className="flex-row justify-between items-end gap-3 px-1">
              {[0.4, 0.6, 0.8, 0.5, 0.9, 0.7, 1].map((height, i) => (
                <View key={i} className="flex-1 items-center gap-4">
                  <View className="w-full h-[100px] bg-white/5 rounded-full justify-end overflow-hidden">
                    <LinearGradient
                      colors={i === 6 ? ['#4F46E5', '#818CF8'] : ['#3F3F46', '#27272A']}
                      className="w-full rounded-full" 
                      style={{ height: `${height * 100}%` }} 
                    />
                  </View>
                  <Text className={`text-[11px] font-black ${i === 6 ? 'text-white' : 'text-white/20'}`}>
                    {['M','T','W','T','F','S','S'][i]}
                  </Text>
                </View>
              ))}
           </View>
        </View>

      </ScrollView>

      {/* Configuration Modal */}
      <Modal
        visible={showConfigModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfigModal(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-[#1C1C1E] rounded-t-[40px] p-6 border-t border-white/10 shadow-2xl">
            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-white text-2xl font-black tracking-tight">Custom Block</Text>
              <TouchableOpacity 
                onPress={() => setShowConfigModal(false)}
                className="bg-white/5 p-2 rounded-full border border-white/5"
              >
                <X size={20} color="white" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            {/* Focus Duration */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Block Duration</Text>
                <Text className="text-indigo-400 font-bold text-sm">{sessionDuration} min</Text>
              </View>
              <View className="flex-row gap-2">
                {[15, 25, 45, 60].map((dur) => (
                  <TouchableOpacity 
                    key={dur}
                    onPress={() => setSessionDuration(dur)}
                    className={`flex-1 py-3.5 rounded-xl items-center border ${sessionDuration === dur ? 'bg-indigo-600 border-indigo-400' : 'bg-white/5 border-white/10'}`}
                  >
                    <Text className={`font-bold text-sm ${sessionDuration === dur ? 'text-white' : 'text-white/40'}`}>{dur}m</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Break Duration */}
            <View className="mb-8">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Break Duration</Text>
                <Text className="text-emerald-400 font-bold text-sm">{breakDuration} min</Text>
              </View>
              <View className="flex-row gap-2">
                {[5, 10, 15, 20].map((dur) => (
                  <TouchableOpacity 
                    key={dur}
                    onPress={() => setBreakDuration(dur)}
                    className={`flex-1 py-3.5 rounded-xl items-center border ${breakDuration === dur ? 'bg-emerald-600 border-emerald-400' : 'bg-white/5 border-white/10'}`}
                  >
                    <Text className={`font-bold text-sm ${breakDuration === dur ? 'text-white' : 'text-white/40'}`}>{dur}m</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              onPress={startFocusSession}
              className="bg-white py-4 rounded-2xl items-center mb-4 shadow-xl"
            >
              <Text className="text-black text-lg font-black">Start Blocking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Active Session Overlay (Fixed at bottom) */}
      {(isFocusActive || isBreakActive) && (
        <View className="absolute bottom-8 left-4 right-4 shadow-2xl">
          <View className="bg-zinc-900/95 backdrop-blur-3xl rounded-[32px] border border-white/10 p-4 flex-row items-center justify-between shadow-2xl overflow-hidden">
             {/* Status Indicator */}
            <View className="flex-row items-center gap-3">
              <View className={`p-3 rounded-2xl relative ${isFocusActive ? 'bg-white/10' : 'bg-emerald-500/10'}`}>
                {isFocusActive ? <Focus size={20} color="white" /> : <Coffee size={20} color="#10B981" />}
                <View className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#1C1C1E] ${isFocusActive ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
              </View>
              <View>
                <Text className="text-white font-black text-base leading-tight">{isFocusActive ? 'Work Mode' : 'Break Time'}</Text>
                <View className="flex-row items-center gap-1.5 mt-0.5">
                  <View className={`w-1.5 h-1.5 rounded-full ${isFocusActive ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                  <Text className="text-white/60 font-mono text-xs tracking-wider font-bold">
                    {formatTime(timer)}
                  </Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              onPress={isFocusActive ? startBreak : resumeFocus}
              className="bg-white px-6 py-3 rounded-full flex-row items-center gap-2 shadow-lg"
            >
              {isFocusActive ? (
                <>
                  <Pause size={16} color="black" fill="black" />
                  <Text className="text-black font-black text-base">Break</Text>
                </>
              ) : (
                <>
                  <Play size={16} color="black" fill="black" />
                  <Text className="text-black font-black text-base">Resume</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

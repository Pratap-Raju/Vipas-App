import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Shield, Plus, Power, Trash2 } from 'lucide-react-native';

export default function ShieldScreen() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('sessions')
      .select('*, session_blocked_apps(*)')
      .eq('user_id', user.id);
    setSessions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const toggleSession = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('sessions')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      fetchSessions();
    }
  };

  const deleteSession = async (id: string) => {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      fetchSessions();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-6">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-3xl font-bold text-foreground">Shield</Text>
          <TouchableOpacity className="bg-primary p-3 rounded-full">
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="bg-secondary/10 p-6 rounded-3xl mb-8 border border-secondary/20">
          <View className="flex-row items-center gap-4 mb-4">
            <View className="bg-primary/20 p-3 rounded-2xl">
              <Shield size={28} color="#3b82f6" />
            </View>
            <View>
              <Text className="text-xl font-bold text-foreground">Active Protection</Text>
              <Text className="text-muted-foreground">Your shield is currently monitoring apps</Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center pt-4 border-t border-secondary/20">
            <Text className="text-lg font-medium text-foreground">Shield Status</Text>
            <Switch value={true} trackColor={{ false: '#767577', true: '#3b82f6' }} />
          </View>
        </View>

        <Text className="text-xl font-bold text-foreground mb-4">Focus Sessions</Text>
        
        {sessions.length === 0 ? (
          <View className="items-center justify-center p-12 bg-secondary/5 rounded-3xl border border-dashed border-secondary/30">
            <Power size={48} color="#94a3b8" className="mb-4" />
            <Text className="text-muted-foreground text-center">No focus sessions found. Create one to start blocking distracting apps.</Text>
          </View>
        ) : (
          sessions.map((session) => (
            <View key={session.id} className="bg-card p-5 rounded-3xl mb-4 shadow-sm border border-border">
              <View className="flex-row justify-between items-start mb-3">
                <View>
                  <Text className="text-xl font-bold text-foreground">{session.name}</Text>
                  <Text className="text-muted-foreground">{session.session_blocked_apps?.length || 0} apps blocked</Text>
                </View>
                <Switch 
                  value={session.is_active} 
                  onValueChange={() => toggleSession(session.id, session.is_active)}
                  trackColor={{ false: '#767577', true: '#3b82f6' }}
                />
              </View>
              <View className="flex-row justify-between items-center pt-3 border-t border-border">
                <Text className="text-muted-foreground">
                  {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(session.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <TouchableOpacity onPress={() => deleteSession(session.id)}>
                  <Trash2 size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

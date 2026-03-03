import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { ShieldAlert, ExternalLink, Play, BookOpen } from 'lucide-react-native';

export default function ShieldUIScreen() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('recommendations')
      .select('*')
      .limit(5);
    setRecommendations(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const openYoutube = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-6">
      <View className="items-center justify-center pt-12 pb-8">
        <View className="bg-red-500/10 p-6 rounded-full mb-6">
          <ShieldAlert size={64} color="#ef4444" />
        </View>
        <Text className="text-4xl font-bold text-foreground text-center mb-2">Focus Mode On</Text>
        <Text className="text-xl text-muted-foreground text-center">
          This app is currently blocked to help you stay focused.
        </Text>
      </View>

      <View className="flex-1 bg-secondary/5 rounded-3xl border border-secondary/20 p-6 mt-8">
        <View className="flex-row items-center gap-3 mb-6">
          <BookOpen size={24} color="#3b82f6" />
          <Text className="text-2xl font-bold text-foreground">Wisdom of the Day</Text>
        </View>

        <ScrollView className="flex-1">
          {loading ? (
            <Text className="text-center text-muted-foreground mt-12">Loading wisdom...</Text>
          ) : recommendations.length === 0 ? (
            <Text className="text-center text-muted-foreground mt-12">No recommendations found. Keep focused!</Text>
          ) : (
            recommendations.map((rec) => (
              <TouchableOpacity
                key={rec.id}
                className="bg-card p-4 rounded-2xl mb-4 border border-border shadow-sm"
                onPress={() => openYoutube(rec.youtube_url)}
              >
                <View className="flex-row items-center gap-4">
                  <View className="bg-primary/10 p-3 rounded-xl">
                    <Play size={24} color="#3b82f6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-foreground" numberOfLines={2}>
                      {rec.title}
                    </Text>
                    <Text className="text-sm text-primary uppercase font-bold tracking-wider">
                      {rec.category}
                    </Text>
                  </View>
                  <ExternalLink size={20} color="#94a3b8" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      <TouchableOpacity
        className="mt-8 bg-primary py-5 rounded-2xl flex-row items-center justify-center gap-2"
        onPress={() => Linking.openURL('vipas://dashboard')}
      >
        <Text className="text-primary-foreground text-xl font-bold">Back to Vipas Dashboard</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

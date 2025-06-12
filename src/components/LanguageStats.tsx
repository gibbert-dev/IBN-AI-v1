import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "@/utils/syncService";
import { BarChart3, TrendingUp, Users, Globe } from "lucide-react";

interface LanguageStatsProps {
  refreshTrigger?: number;
}

const LanguageStats = ({ refreshTrigger = 0 }: LanguageStatsProps) => {
  const [stats, setStats] = useState({
    totalTranslations: 0,
    uniqueWords: 0,
    avgWordsPerTranslation: 0,
    recentContributions: 0,
    topContributors: [] as string[],
    languageProgress: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const translations = await getTranslations();
      
      // Calculate statistics
      const totalTranslations = translations.length;
      const allWords = new Set();
      let totalWordCount = 0;
      
      translations.forEach(t => {
        const words = t.ibono.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        words.forEach(word => allWords.add(word));
        totalWordCount += words.length;
      });
      
      const uniqueWords = allWords.size;
      const avgWordsPerTranslation = totalTranslations > 0 ? Math.round(totalWordCount / totalTranslations) : 0;
      
      // Recent contributions (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentContributions = translations.filter(t => 
        t.created_at && new Date(t.created_at) > weekAgo
      ).length;
      
      // Language progress (arbitrary milestone of 1000 translations)
      const languageProgress = Math.min((totalTranslations / 1000) * 100, 100);
      
      setStats({
        totalTranslations,
        uniqueWords,
        avgWordsPerTranslation,
        recentContributions,
        topContributors: [], // Could be enhanced with user tracking
        languageProgress
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Language Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-ibonai-green" />
          Language Statistics
        </CardTitle>
        <CardDescription>
          Progress in building the Ibọnọ language dataset
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-ibonai-green">{stats.totalTranslations}</div>
            <div className="text-sm text-muted-foreground">Total Translations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-ibonai-blue">{stats.uniqueWords}</div>
            <div className="text-sm text-muted-foreground">Unique Words</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Language Progress</span>
            <Badge variant="secondary">{Math.round(stats.languageProgress)}%</Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-ibonai-green to-ibonai-lightGreen h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.languageProgress}%` }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground">
            Goal: 1,000 translations for initial model training
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>{stats.recentContributions} this week</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-ibonai-blue" />
            <span>Avg {stats.avgWordsPerTranslation} words</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageStats;
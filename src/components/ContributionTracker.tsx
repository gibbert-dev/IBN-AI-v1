import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "@/utils/syncService";
import { Calendar, Award, Target, Clock } from "lucide-react";

const ContributionTracker = () => {
  const [contributions, setContributions] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    streak: 0,
    weeklyGoal: 10,
    monthlyGoal: 50
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContributions();
  }, []);

  const loadContributions = async () => {
    setIsLoading(true);
    try {
      const translations = await getTranslations();
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Count contributions by period
      const todayCount = translations.filter(t => 
        t.created_at && new Date(t.created_at) >= today
      ).length;
      
      const weekCount = translations.filter(t => 
        t.created_at && new Date(t.created_at) >= weekStart
      ).length;
      
      const monthCount = translations.filter(t => 
        t.created_at && new Date(t.created_at) >= monthStart
      ).length;
      
      // Calculate streak (simplified - consecutive days with contributions)
      let streak = 0;
      const sortedDates = translations
        .filter(t => t.created_at)
        .map(t => new Date(t.created_at!).toDateString())
        .filter((date, index, arr) => arr.indexOf(date) === index)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      
      if (sortedDates.length > 0) {
        let currentDate = new Date();
        for (const dateStr of sortedDates) {
          const date = new Date(dateStr);
          const diffDays = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays <= streak + 1) {
            streak++;
            currentDate = date;
          } else {
            break;
          }
        }
      }
      
      setContributions({
        today: todayCount,
        thisWeek: weekCount,
        thisMonth: monthCount,
        streak,
        weeklyGoal: 10,
        monthlyGoal: 50
      });
    } catch (error) {
      console.error("Error loading contributions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const weeklyProgress = Math.min((contributions.thisWeek / contributions.weeklyGoal) * 100, 100);
  const monthlyProgress = Math.min((contributions.thisMonth / contributions.monthlyGoal) * 100, 100);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contribution Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-ibonai-orange" />
          Your Contributions
        </CardTitle>
        <CardDescription>
          Track your progress in building the Ibọnọ dataset
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Today's contributions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-ibonai-blue" />
            <span className="font-medium">Today</span>
          </div>
          <Badge variant={contributions.today > 0 ? "default" : "secondary"}>
            {contributions.today} translations
          </Badge>
        </div>
        
        {/* Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">Current Streak</span>
          </div>
          <Badge variant={contributions.streak > 0 ? "default" : "secondary"}>
            {contributions.streak} days
          </Badge>
        </div>
        
        {/* Weekly Goal */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Weekly Goal</span>
            <span className="text-sm text-muted-foreground">
              {contributions.thisWeek}/{contributions.weeklyGoal}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-ibonai-green to-ibonai-lightGreen h-2 rounded-full transition-all duration-500"
              style={{ width: `${weeklyProgress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Monthly Goal */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Monthly Goal</span>
            <span className="text-sm text-muted-foreground">
              {contributions.thisMonth}/{contributions.monthlyGoal}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-ibonai-orange to-yellow-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${monthlyProgress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="pt-4 border-t">
          <div className="text-sm font-medium mb-2">Recent Achievements</div>
          <div className="space-y-1">
            {contributions.streak >= 7 && (
              <Badge variant="outline" className="mr-2 mb-1">
                🔥 Week Warrior
              </Badge>
            )}
            {contributions.thisMonth >= 25 && (
              <Badge variant="outline" className="mr-2 mb-1">
                🌟 Monthly Contributor
              </Badge>
            )}
            {contributions.today >= 5 && (
              <Badge variant="outline" className="mr-2 mb-1">
                ⚡ Daily Champion
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContributionTracker;
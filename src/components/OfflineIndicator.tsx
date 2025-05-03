
import { useOfflineStatus } from "@/context/OfflineContext";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const OfflineIndicator = () => {
  const { isOnline, isSyncing, lastSyncTime } = useOfflineStatus();
  
  const getFormattedTime = () => {
    if (!lastSyncTime) return "Never";
    
    const now = new Date();
    const diff = now.getTime() - lastSyncTime.getTime();
    
    // Less than a minute ago
    if (diff < 60000) {
      return "Just now";
    }
    
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Format time
    return lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={isOnline ? "default" : "destructive"} 
            className={`flex items-center gap-1 ${isOnline ? 'bg-green-600' : 'bg-amber-600'} hover:${isOnline ? 'bg-green-700' : 'bg-amber-700'}`}
          >
            {isOnline ? (
              isSyncing ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <Wifi className="h-3 w-3" />
              )
            ) : (
              <WifiOff className="h-3 w-3" />
            )}
            {isOnline ? (isSyncing ? "Syncing..." : "Online") : "Offline"}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>
            {isOnline 
              ? `Connected to server. Last sync: ${getFormattedTime()}`
              : "Working offline. Changes will sync when you reconnect."
            }
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default OfflineIndicator;

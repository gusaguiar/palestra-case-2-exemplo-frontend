
import { Bell, Activity, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
  onNotificationsClick: () => void;
  notificationCount: number;
}

export const DashboardHeader = ({ onNotificationsClick, notificationCount }: DashboardHeaderProps) => {
  return (
    <header className="relative bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-blue-ocean to-navy-dark flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-light rounded-full border-2 border-card animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">MonitorHub</h1>
              <p className="text-xs text-muted-foreground font-medium">Sistema Industrial • Tempo Real</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNotificationsClick}
              className="relative hover:bg-muted/80 transition-all duration-200"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] font-bold shadow-md"
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-muted/80 transition-all duration-200">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-muted/80 transition-all duration-200 lg:hidden">
              <Menu className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

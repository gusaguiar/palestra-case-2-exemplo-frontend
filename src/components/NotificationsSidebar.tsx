
import { X, AlertTriangle, Info, TrendingUp, Clock, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  sensor?: string;
}

interface NotificationsSidebarProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export const NotificationsSidebar = ({ open, onClose, notifications }: NotificationsSidebarProps) => {
  const getNotificationConfig = (type: string) => {
    switch (type) {
      case 'critical':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-gradient-to-r from-red-50 via-white to-red-50/30 border-red-200/60',
          badgeColor: 'bg-red-100 text-red-800 border-red-200',
          iconBg: 'bg-red-100',
          pulse: 'animate-pulse'
        };
      case 'warning':
        return {
          icon: TrendingUp,
          color: 'text-amber-600',
          bgColor: 'bg-gradient-to-r from-amber-50 via-white to-amber-50/30 border-amber-200/60',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          iconBg: 'bg-amber-100',
          pulse: ''
        };
      case 'info':
        return {
          icon: Info,
          color: 'text-blue-600',
          bgColor: 'bg-gradient-to-r from-blue-50 via-white to-blue-50/30 border-blue-200/60',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
          iconBg: 'bg-blue-100',
          pulse: ''
        };
      default:
        return {
          icon: Info,
          color: 'text-slate-600',
          bgColor: 'bg-gradient-to-r from-slate-50 via-white to-slate-50/30 border-slate-200/60',
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
          iconBg: 'bg-slate-100',
          pulse: ''
        };
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white/95 backdrop-blur-md shadow-2xl z-50 border-l border-slate-200/60 transform transition-transform duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-blue-100">
                <Wifi className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Alertas do Sistema</h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="hover:bg-slate-100/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 font-medium">
              {notifications.length} notificação{notifications.length !== 1 ? 'ões' : ''} ativa{notifications.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center space-x-1 text-xs text-emerald-600 font-medium">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>Tempo real</span>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Info className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">Nenhuma notificação</p>
                <p className="text-xs text-slate-400 mt-1">Sistema operando normalmente</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const config = getNotificationConfig(notification.type);
                const Icon = config.icon;

                return (
                  <div 
                    key={notification.id}
                    className={`relative overflow-hidden p-4 rounded-xl border ${config.bgColor} hover:shadow-md transition-all duration-200 group`}
                  >
                    {/* Side indicator */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${notification.type === 'critical' ? 'bg-red-500' : notification.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'} ${config.pulse}`} />
                    
                    <div className="flex items-start space-x-3 ml-2">
                      <div className={`p-2 rounded-lg ${config.iconBg} ${config.pulse}`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-slate-900 text-sm leading-tight">
                            {notification.title}
                          </h4>
                          <Badge className={`${config.badgeColor} text-[10px] font-semibold ml-2 flex-shrink-0`}>
                            {notification.type === 'critical' ? 'CRÍTICO' :
                             notification.type === 'warning' ? 'ATENÇÃO' : 'INFO'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed mb-3">
                          {notification.message}
                        </p>
                        {notification.sensor && (
                          <div className="flex items-center space-x-1 mb-2">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                            <p className="text-xs text-slate-600 font-medium">
                              {notification.sensor}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <p className="text-xs text-slate-500 font-medium">
                            {notification.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

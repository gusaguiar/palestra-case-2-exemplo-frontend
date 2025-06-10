
import { X, AlertTriangle, Info, TrendingUp } from 'lucide-react';
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
          bgColor: 'bg-red-50 border-red-200',
          badgeColor: 'bg-red-100 text-red-800'
        };
      case 'warning':
        return {
          icon: TrendingUp,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-200',
          badgeColor: 'bg-yellow-100 text-yellow-800'
        };
      case 'info':
        return {
          icon: Info,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 border-blue-200',
          badgeColor: 'bg-blue-100 text-blue-800'
        };
      default:
        return {
          icon: Info,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 border-gray-200',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 border-l border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Notificações</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {notifications.length} notificação(ões) ativa(s)
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-4 space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const config = getNotificationConfig(notification.type);
                const Icon = config.icon;

                return (
                  <div 
                    key={notification.id}
                    className={`p-4 rounded-lg border-2 ${config.bgColor} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={`w-5 h-5 ${config.color} mt-1`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-800 text-sm">
                            {notification.title}
                          </h4>
                          <Badge className={`${config.badgeColor} text-xs`}>
                            {notification.type === 'critical' ? 'Crítico' :
                             notification.type === 'warning' ? 'Atenção' : 'Info'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          {notification.message}
                        </p>
                        {notification.sensor && (
                          <p className="text-xs text-slate-500 mb-2">
                            Sensor: {notification.sensor}
                          </p>
                        )}
                        <p className="text-xs text-slate-400">
                          {notification.timestamp}
                        </p>
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

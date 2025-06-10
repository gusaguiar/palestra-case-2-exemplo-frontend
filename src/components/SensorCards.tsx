
import { Thermometer, Gauge, Wrench, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SensorData } from '@/types/sensor';

interface SensorCardsProps {
  data: SensorData;
}

export const SensorCards = ({ data }: SensorCardsProps) => {
  const sensorConfig = [
    {
      title: 'Temperatura do Ar',
      value: `${data.airTemperature.toFixed(1)}`,
      unit: 'K',
      icon: Thermometer,
      status: data.airTemperature > 299.5 ? 'warning' : 'healthy',
      change: Math.random() > 0.5 ? '+0.3%' : '-0.1%',
      trend: Math.random() > 0.5 ? 'up' : 'down',
      color: 'primary'
    },
    {
      title: 'Temperatura Processo',
      value: `${data.processTemperature.toFixed(1)}`,
      unit: 'K',
      icon: Thermometer,
      status: data.processTemperature > 309.5 ? 'critical' : data.processTemperature > 309.0 ? 'warning' : 'healthy',
      change: Math.random() > 0.5 ? '+0.2%' : '-0.1%',
      trend: Math.random() > 0.5 ? 'up' : 'down',
      color: 'secondary'
    },
    {
      title: 'Velocidade Rotacional',
      value: `${data.rotationalSpeed.toFixed(0)}`,
      unit: 'rpm',
      icon: Gauge,
      status: data.rotationalSpeed > 2000 ? 'critical' : data.rotationalSpeed > 1600 ? 'warning' : 'healthy',
      change: Math.random() > 0.5 ? '-0.5%' : '+1.2%',
      trend: Math.random() > 0.5 ? 'up' : 'down',
      color: 'accent'
    },
    {
      title: 'Torque',
      value: `${data.torque.toFixed(1)}`,
      unit: 'Nm',
      icon: Wrench,
      status: data.torque > 60 ? 'critical' : data.torque > 50 ? 'warning' : 'healthy',
      change: Math.random() > 0.5 ? '+1.8%' : '-0.8%',
      trend: Math.random() > 0.5 ? 'up' : 'down',
      color: 'tertiary'
    },
    {
      title: 'Status da Máquina',
      value: data.machineFailure ? 'Não Healthy' : 'Healthy',
      unit: '',
      icon: AlertTriangle,
      status: data.machineFailure ? 'critical' : 'healthy',
      change: '',
      trend: data.machineFailure ? 'down' : 'up',
      color: data.machineFailure ? 'critical' : 'accent'
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'healthy':
        return {
          badge: 'bg-green-light/20 text-navy-dark border-green-light/30',
          text: 'Normal',
          glow: 'shadow-green-light/20'
        };
      case 'warning':
        return {
          badge: 'bg-teal-bright/20 text-navy-dark border-teal-bright/30',
          text: 'Atenção',
          glow: 'shadow-teal-bright/20'
        };
      case 'critical':
        return {
          badge: 'bg-red-50 text-red-700 border-red-200/60',
          text: 'Crítico',
          glow: 'shadow-red-100/40'
        };
      default:
        return {
          badge: 'bg-muted/20 text-foreground border-muted/30',
          text: 'Indefinido',
          glow: 'shadow-muted/20'
        };
    }
  };

  const getColorConfig = (color: string) => {
    const configs: Record<string, string> = {
      primary: 'from-blue-ocean/10 via-white to-blue-ocean/5 border-blue-ocean/20',
      secondary: 'from-teal-bright/10 via-white to-teal-bright/5 border-teal-bright/20',
      accent: 'from-green-light/10 via-white to-green-light/5 border-green-light/20',
      tertiary: 'from-green-pale/30 via-white to-green-pale/10 border-green-pale/40',
      critical: 'from-red-50/70 via-white to-red-50/30 border-red-200/50'
    };
    return configs[color] || configs.accent;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
      {sensorConfig.map((sensor, index) => {
        const Icon = sensor.icon;
        const TrendIcon = sensor.trend === 'up' ? TrendingUp : TrendingDown;
        const statusConfig = getStatusConfig(sensor.status);
        const colorConfig = getColorConfig(sensor.color);
        
        return (
          <Card 
            key={index} 
            className={`group relative overflow-hidden bg-gradient-to-br ${colorConfig} backdrop-blur-sm hover:shadow-lg ${statusConfig.glow} transition-all duration-300 border`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground group-hover:text-navy-dark transition-colors">
                  {sensor.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-[10px] font-medium ${statusConfig.badge} shadow-sm`}>
                    {statusConfig.text}
                  </Badge>
                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-foreground tracking-tight">{sensor.value}</span>
                  <span className="text-sm font-medium text-muted-foreground">{sensor.unit}</span>
                </div>
                {sensor.change && (
                  <div className="flex items-center space-x-1">
                    <TrendIcon className={`w-3 h-3 ${sensor.trend === 'up' ? 'text-green-light' : 'text-red-500'}`} />
                    <span className={`text-xs font-medium ${sensor.trend === 'up' ? 'text-green-light' : 'text-red-600'}`}>
                      {sensor.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs 24h</span>
                  </div>
                )}
              </div>
            </CardContent>
            
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Card>
        );
      })}
    </div>
  );
};

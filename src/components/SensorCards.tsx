
import { Thermometer, Gauge, Clock, Wrench, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
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
      status: data.airTemperature > 305 ? 'warning' : 'healthy',
      change: Math.random() > 0.5 ? '+2.1%' : '-0.8%',
      trend: Math.random() > 0.5 ? 'up' : 'down',
      color: 'blue'
    },
    {
      title: 'Temperatura Processo',
      value: `${data.processTemperature.toFixed(1)}`,
      unit: 'K',
      icon: Thermometer,
      status: data.processTemperature > 315 ? 'critical' : 'healthy',
      change: Math.random() > 0.5 ? '+1.4%' : '-2.1%',
      trend: Math.random() > 0.5 ? 'up' : 'down',
      color: 'orange'
    },
    {
      title: 'Velocidade Rotacional',
      value: `${data.rotationalSpeed.toFixed(0)}`,
      unit: 'rpm',
      icon: Gauge,
      status: data.rotationalSpeed > 1600 ? 'warning' : 'healthy',
      change: Math.random() > 0.5 ? '-0.3%' : '+1.2%',
      trend: Math.random() > 0.5 ? 'up' : 'down',
      color: 'green'
    },
    {
      title: 'Torque',
      value: `${data.torque.toFixed(1)}`,
      unit: 'Nm',
      icon: Wrench,
      status: data.torque > 45 ? 'critical' : 'healthy',
      change: Math.random() > 0.5 ? '+2.8%' : '-1.5%',
      trend: Math.random() > 0.5 ? 'up' : 'down',
      color: 'purple'
    },
    {
      title: 'Desgaste Ferramenta',
      value: `${data.toolWear.toFixed(0)}`,
      unit: 'min',
      icon: Clock,
      status: data.toolWear > 200 ? 'critical' : data.toolWear > 150 ? 'warning' : 'healthy',
      change: '+0.2%',
      trend: 'up',
      color: 'red'
    },
    {
      title: 'Status Máquina',
      value: data.machineFailure ? 'Falha' : 'OK',
      unit: '',
      icon: AlertTriangle,
      status: data.machineFailure ? 'critical' : 'healthy',
      change: '',
      trend: data.machineFailure ? 'down' : 'up',
      color: 'slate'
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'healthy':
        return {
          badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          text: 'Normal',
          glow: 'shadow-emerald-100/50'
        };
      case 'warning':
        return {
          badge: 'bg-amber-100 text-amber-700 border-amber-200',
          text: 'Atenção',
          glow: 'shadow-amber-100/50'
        };
      case 'critical':
        return {
          badge: 'bg-red-100 text-red-700 border-red-200',
          text: 'Crítico',
          glow: 'shadow-red-100/50'
        };
      default:
        return {
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          text: 'Indefinido',
          glow: 'shadow-slate-100/50'
        };
    }
  };

  const getColorConfig = (color: string) => {
    const configs: Record<string, string> = {
      blue: 'from-blue-500/10 to-blue-600/5 border-blue-200/50',
      orange: 'from-orange-500/10 to-orange-600/5 border-orange-200/50',
      green: 'from-emerald-500/10 to-emerald-600/5 border-emerald-200/50',
      purple: 'from-purple-500/10 to-purple-600/5 border-purple-200/50',
      red: 'from-red-500/10 to-red-600/5 border-red-200/50',
      slate: 'from-slate-500/10 to-slate-600/5 border-slate-200/50'
    };
    return configs[color] || configs.slate;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                <CardTitle className="text-sm font-semibold text-slate-700 group-hover:text-slate-800 transition-colors">
                  {sensor.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-[10px] font-medium ${statusConfig.badge} shadow-sm`}>
                    {statusConfig.text}
                  </Badge>
                  <Icon className="w-4 h-4 text-slate-500 group-hover:text-slate-600 transition-colors" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">{sensor.value}</span>
                  <span className="text-sm font-medium text-slate-600">{sensor.unit}</span>
                </div>
                {sensor.change && (
                  <div className="flex items-center space-x-1">
                    <TrendIcon className={`w-3 h-3 ${sensor.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`} />
                    <span className={`text-xs font-medium ${sensor.trend === 'up' ? 'text-emerald-700' : 'text-red-600'}`}>
                      {sensor.change}
                    </span>
                    <span className="text-xs text-slate-500">vs 24h</span>
                  </div>
                )}
              </div>
            </CardContent>
            
            {/* Subtle animation indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-300/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Card>
        );
      })}
    </div>
  );
};
